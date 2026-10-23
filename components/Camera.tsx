import ProcessingIndicator from "@/components/ui/ProcessingIndicator";
import {
  itemColors,
  itemSubTypes,
  itemTypesArray,
  NewItemType,
} from "@/constants/constants";
import { Theme } from "@/constants/themes";
import { getClassification } from "@/functions/getClassification";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useTheme } from "@/hooks/ThemeProvider";
import { useBackgroundRemover } from "@/hooks/useBackgroundRemover";
import { useSnackbar } from "@/hooks/useSnackBar";
import { useWardrobeImagePicker } from "@/hooks/useWardrobeImagePicker";
import {
  addItem,
  addItemTagToFront,
  clearItems,
  removeItemTag,
  selectIndex,
  selectItems,
  setItemImgUrl,
  setItemType,
} from "@/redux/slices/itemSlice";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Linking from "expo-linking";
import { useRootNavigationState, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Button,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { classifyClothing } from "../modules/clothing-classifier";
import AppButton from "./ui/AppButton";
import { AppIcon } from "./ui/AppIcon";
import AppText from "./ui/AppText";

const MAX_MENU_HEIGHT = 500;
const CAMERA_ASPECT = 4 / 5; // width / height

export function Camera() {
  const rootState = useRootNavigationState();
  const { theme } = useTheme();
  const posthog = usePostHog();
  const t = theme;
  const styles = s(t);

  const snackbarSettingsContext = useSnackbar();
  if (!snackbarSettingsContext) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  const { showSnackbar, hideSnackbar } = snackbarSettingsContext;

  const showError = (message: string) => {
    showSnackbar(message, "error");
    setTimeout(() => hideSnackbar(), 3000);
  };

  // Successful results from earlier runs, keyed by source uri,
  // so retrying after a failure doesn't re-process good photos.
  const processedRef = useRef(new Map<string, NewItemType>());

  const [active, setActive] = useState(false);
  const navTranslate = useRef(new Animated.Value(MAX_MENU_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(navTranslate, {
      toValue: active ? 0 : MAX_MENU_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [active]);

  const { width: screenWidth } = useWindowDimensions();
  const GRID_COLUMNS = 3;
  const GRID_GAP = 10;
  const GRID_PADDING = 20; // matches photoMenu's padding
  const tileSize =
    (screenWidth - GRID_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) /
    GRID_COLUMNS;

  // Space actually available to the camera preview (measured via onLayout).
  // On phones this is the full natural 4:5 height; on iPad the slot shrinks
  // so the shutter row stays on screen, and the preview fits inside it.
  const [cameraSlot, setCameraSlot] = useState({ width: 0, height: 0 });
  const cameraWidth = Math.min(
    cameraSlot.width,
    cameraSlot.height * CAMERA_ASPECT,
  );
  const cameraHeight = cameraWidth / CAMERA_ASPECT;

  const getPreviousRouteName = () => {
    if (!rootState?.routes) return null;
    const routes = rootState.routes;
    if (routes.length > 1) {
      const previousRoute = routes[routes.length - 2];
      return previousRoute.name;
    }
    return null;
  };
  const previousPage = getPreviousRouteName();

  const { process } = useBackgroundRemover();
  const { pickMultipleImages, pickSingleImage, MAX_PHOTOS } =
    useWardrobeImagePicker();
  const [processingImages, setProcessingImages] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pickerActive, setPickerActive] = useState(false);
  const [progressTotal, setProgressTotal] = useState(0);
  const [statusText, setStatusText] = useState("Processing your photos...");

  async function processImages(imgs: string[]) {
    setProgress(0);
    setProgressTotal(imgs.length);
    setStatusText("Removing backgrounds and identifying items...");

    const failed: string[] = [];
    let completed = 0;

    for (const img of imgs) {
      if (!processedRef.current.has(img)) {
        try {
          const color = await classifyClothing(img);
          const result = await process(img);

          if (result?.resultUri) {
            const [type, subtype] = await getClassification(result.resultUri);
            processedRef.current.set(img, {
              name: "",
              type,
              color: color.label,
              tags: [type, subtype, color.label],
              favorited: false,
              imgUrl: result.resultUri,
              backgroundRemoved: true,
            });
          } else {
            failed.push(img);
          }
        } catch (e) {
          console.error("[camera] processing failed for", img, e);
          failed.push(img);
        }
      }
      completed += 1;
      setProgress(completed);
    }

    if (imgs.length > 0) {
      const cameraCount = imgs.filter((img) => photos.includes(img)).length;
      posthog.capture("wardrobe_images_processed", {
        item_count: imgs.length - failed.length,
        attempted_count: imgs.length,
        failed_count: failed.length,
        camera_count: cameraCount,
        library_count: imgs.length - cameraCount,
      });
    }

    if (failed.length > 0) {
      // Stay on the camera; keep the good photos (including library picks) in the list
      setPhotos(imgs.filter((img) => !failed.includes(img)));
      setProcessingImages(false);
      showError(
        failed.length === 1
          ? "No item detected. Photo removed."
          : `No item detected in ${failed.length} photos.`,
      );
      return;
    }

    // All succeeded: dispatch in order and move on
    for (const img of imgs) {
      const newItem = processedRef.current.get(img);
      if (newItem) dispatch(addItem(newItem));
    }
    processedRef.current.clear();
    setProcessingImages(false);
    router.navigate("/add-item");
  }

  async function processUpdatedImage(img: string) {
    setProgress(0);
    setProgressTotal(1);
    setStatusText("Updating your item...");

    try {
      const color = await classifyClothing(img);
      const result = await process(img);

      if (!result?.resultUri) {
        setPhotos([]);
        setProcessingImages(false);
        showError(
          "Couldn't find a clothing item in that photo. Try retaking it.",
        );
        return;
      }

      dispatch(setItemImgUrl({ index: itemsIndex, url: result.resultUri }));
      for (const type of itemTypesArray) {
        if (item.tags.includes(type)) {
          dispatch(removeItemTag({ index: itemsIndex, tag: type }));
          for (const subType of itemSubTypes.filter((s) => s.key === type)) {
            if (item.tags.includes(subType.value)) {
              dispatch(
                removeItemTag({ index: itemsIndex, tag: subType.value }),
              );
            }
          }
        }
      }
      for (const c of itemColors) {
        if (item.tags.includes(c)) {
          dispatch(removeItemTag({ index: itemsIndex, tag: c }));
        }
      }
      const [type, subtype] = await getClassification(result.resultUri);
      dispatch(setItemType({ index: itemsIndex, type }));
      dispatch(addItemTagToFront({ index: itemsIndex, tag: color.label }));
      dispatch(addItemTagToFront({ index: itemsIndex, tag: subtype }));
      dispatch(addItemTagToFront({ index: itemsIndex, tag: type }));
      setProgress(1);
      setProcessingImages(false);
      router.navigate("/add-item");
    } catch (e) {
      console.error("[camera] update processing failed", e);
      setPhotos([]);
      setProcessingImages(false);
      showError("Something went wrong processing that photo. Try again.");
    }
  }

  const handlePickImage = async () => {
    setProgress(0);
    setProgressTotal(0);
    setStatusText("Preparing your photos...");
    setPickerActive(true);
    try {
      if (retakeRef.current) {
        const uri = await pickSingleImage();
        if (uri) {
          setProcessingImages(true);
          requestAnimationFrame(() => {
            processUpdatedImage(uri);
          });
        }
        // uri is null → user canceled, do nothing, camera stays visible
      } else {
        const remainingSlots = MAX_PHOTOS - photos.length;
        const uris = await pickMultipleImages(remainingSlots);
        if (uris) {
          setProcessingImages(true);
          requestAnimationFrame(() => {
            processImages([...photos, ...uris]);
          });
        }
        // uris is null → user canceled, do nothing
      }
    } finally {
      setPickerActive(false);
    }
  };

  const itemsIndex = useAppSelector(selectIndex);
  const itemsList = useAppSelector(selectItems);
  const item = itemsList[itemsIndex];
  const retakeRef = useRef(false);
  useEffect(() => {
    if (item != null) {
      retakeRef.current = true;
    }
  }, []);

  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const dispatch = useAppDispatch();
  const [photos, setPhotos] = useState<string[]>([]);
  const router = useRouter();

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button
          onPress={
            permission.canAskAgain
              ? requestPermission
              : () => Linking.openSettings()
          }
          title={"Continue"}
        />
      </View>
    );
  }

  const takePicture = async () => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert(
        "Limit reached",
        `You can only add up to ${MAX_PHOTOS} photos at a time.`,
      );
      return;
    }
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      if (retakeRef.current) {
        setPhotos([photo.uri]);
        return;
      }
      setPhotos((prev) => [...prev, photo.uri]);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const startProcessing = () => {
    setProcessingImages(true);
    requestAnimationFrame(() => {
      if (retakeRef.current) {
        processUpdatedImage(photos[0]);
      } else {
        processImages(photos);
      }
    });
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraSection}>
        <View
          style={[styles.cameraSlot, { height: screenWidth / CAMERA_ASPECT }]}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setCameraSlot((prev) =>
              prev.width === width && prev.height === height
                ? prev
                : { width, height },
            );
          }}
        >
          {cameraWidth > 0 && (
            <CameraView
              style={{ width: cameraWidth, height: cameraHeight }}
              ref={ref}
              mode={"picture"}
              facing={facing}
              mute={false}
              responsiveOrientationWhenOrientationLocked={false}
            />
          )}
        </View>
        <View style={styles.shutterContainer}>
          {photos.length == 0 ? (
            <View style={{ width: 55 }} />
          ) : (
            <Pressable
              onPress={() => setActive(true)}
              hitSlop={10}
              style={({ pressed }) => [
                styles.slot,
                pressed && { opacity: 0.6 },
              ]}
            >
              <View style={styles.stack}>
                <View style={styles.back} />
                <View style={styles.front}>
                  <Image
                    source={{ uri: photos[photos.length - 1] }}
                    style={styles.thumb}
                  />
                </View>
              </View>
              <AppText
                text={`${String(photos.length).padStart(2, "0")}/${retakeRef.current ? "01" : "15"}`}
                type={"m19"}
                style={{ fontSize: 10 }}
              />
            </Pressable>
          )}

          <Pressable onPress={takePicture}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: "white",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <Pressable
            style={{
              flexDirection: "column",
              width: 55,
              alignItems: "center",
              gap: 4,
            }}
            onPress={() => handlePickImage()}
          >
            <AppIcon
              name={"library"}
              color={theme.whiteA[85]}
              size={45}
              strokeWidth={0.65}
            />
            <AppText text={"Library"} type={"m19"} style={{ fontSize: 10 }} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <>
      <Pressable
        style={[
          styles.menuFiller,
          { backgroundColor: active ? theme.inkA[40] : "transparent" },
        ]}
        onPress={() => setActive(false)}
        pointerEvents={active ? "auto" : "none"}
      ></Pressable>
      <View
        style={[
          styles.container,
          {
            justifyContent:
              processingImages || pickerActive ? "center" : "flex-start",
          },
        ]}
      >
        {processingImages || pickerActive ? null : (
          <View style={styles.nav}>
            <AppButton
              onPress={() => {
                processedRef.current.clear();
                if (retakeRef.current) {
                  router.navigate("/add-item");
                } else {
                  dispatch(clearItems());
                  router.navigate("/pages");
                }
              }}
              type="icon"
              icon={
                <AppIcon
                  name="arrowLeft"
                  color={theme.whiteA[70]}
                  size={24}
                ></AppIcon>
              }
            ></AppButton>
            <AppText
              text={"New Piece"}
              type={"m22"}
              style={{ color: theme.whiteA[40] }}
            />

            {photos.length == 0 ? (
              <View style={{ width: 24 }} />
            ) : (
              <AppButton
                onPress={startProcessing}
                type="icon"
                icon={
                  <AppIcon
                    name="check"
                    color={theme.whiteA[70]}
                    size={24}
                  ></AppIcon>
                }
              ></AppButton>
            )}
          </View>
        )}

        {processingImages || pickerActive ? (
          <ProcessingIndicator
            progress={progress}
            total={progressTotal}
            statusText={statusText}
          />
        ) : (
          renderCamera()
        )}
      </View>
      <Animated.View
        style={[
          styles.photoMenu,
          {
            maxHeight: MAX_MENU_HEIGHT,
            transform: [{ translateY: navTranslate }],
          },
        ]}
      >
        <View style={styles.menuHeader}>
          <AppText
            text={`Photos taken - ${String(photos.length).padStart(2, "0")}/15`}
            type="m22"
            style={{ color: theme.whiteA[55] }}
          />
          <AppButton
            type="text"
            label="Close"
            onPress={() => setActive(false)}
            textColor={theme.onInk}
          />
        </View>
        <FlatList
          style={{ flex: 1, width: "100%" }}
          data={photos}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 10,
          }}
          contentContainerStyle={{ rowGap: 10 }}
          keyExtractor={(uri, index) => `${uri}-${index}`}
          renderItem={({ item: photo, index }) => (
            <View
              style={[styles.tile, { width: tileSize, height: tileSize * 1.3 }]}
            >
              <Pressable
                style={styles.removeTile}
                onPress={() => {
                  const lastPhoto = photos.length == 1;
                  processedRef.current.delete(photo);
                  setPhotos((prev) => prev.filter((_, i) => i !== index));
                  if (lastPhoto) {
                    setActive(false);
                  }
                }}
              >
                <AppIcon name="close" size={15} />
              </Pressable>
              <Image
                source={{ uri: photo }}
                style={[{ width: "100%", height: "100%" }]}
              ></Image>
            </View>
          )}
        />
        <View style={styles.menuButtons}>
          <AppButton
            type="primary"
            label="Take More"
            style={{ borderWidth: 1, borderColor: t.whiteA[16] }}
            onPress={() => {
              setActive(false);
            }}
          ></AppButton>
          <AppButton
            type="secondary"
            label="Continue"
            style={{ borderWidth: 1, borderColor: t.whiteA[16] }}
            onPress={() => {
              startProcessing();
              setActive(false);
            }}
          ></AppButton>
        </View>
      </Animated.View>
    </>
  );
}

const s = (t: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.inkAlt,
      alignItems: "center",
      gap: 40,
    },
    cameraSection: {
      flex: 1,
      width: "100%",
      gap: 70,
      paddingBottom: 30,
    },
    cameraSlot: {
      width: "100%",
      flexShrink: 1, // shrinks below its natural 4:5 height when space runs out (iPad)
      minHeight: 0,
      alignItems: "center",
    },
    shutterContainer: {
      width: "100%",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 30,
    },
    shutterBtn: {
      backgroundColor: "transparent",
      borderWidth: 2.5,
      borderColor: t.whiteA[40],
      width: 85,
      height: 85,
      borderRadius: 45,
      alignItems: "center",
      justifyContent: "center",
    },
    shutterBtnInner: {
      width: 65,
      height: 65,
      borderRadius: 50,
    },
    nav: {
      padding: 15,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    slot: {
      width: 55,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    stack: { width: "75%", height: 46.75 },
    back: {
      position: "absolute",
      left: 0,
      top: 5,
      width: "95%",
      height: "95%",
      borderWidth: 1.5,
      borderColor: t.whiteA[30],
    },
    front: {
      position: "absolute",
      left: 5,
      top: 0,
      width: "95%",
      height: "95%",
      borderWidth: 1.5,
      borderColor: t.whiteA[85],
      backgroundColor: t.inkAlt,
      overflow: "hidden",
    },
    thumb: { flex: 1, resizeMode: "cover" },
    photoMenu: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: 20,
      alignItems: "flex-start",
      zIndex: 100,
      overflow: "hidden",
      elevation: 100,
      backgroundColor: t.inkAlt,
      gap: 20,
      borderTopWidth: 1,
      borderColor: t.whiteA[16],
    },
    menuFiller: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 50,
      elevation: 50, // Android needs elevation as well as zIndex
    },
    menuHeader: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    tile: {
      backgroundColor: t.inkA[7],
      objectFit: "cover",
      borderWidth: 1,
      borderColor: t.whiteA[16],
    },
    removeTile: {
      position: "absolute",
      top: 0,
      right: 0,
      width: 26,
      height: 26,
      backgroundColor: t.surface,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    },
    menuButtons: {
      flexDirection: "row",
      width: "100%",
      gap: 8,
      paddingBottom: 15,
    },
  });

export default Camera;
