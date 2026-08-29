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

export function Camera() {
  const rootState = useRootNavigationState();
  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);

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
    setProgressTotal(imgs.length);
    setStatusText("Removing backgrounds and identifying items...");

    let completed = 0;
    for (const img of imgs) {
      const color = await classifyClothing(img);
      const resultUri = await process(img);

      if (resultUri?.resultUri) {
        const [type, subtype] = await getClassification(resultUri.resultUri);
        const item: NewItemType = {
          name: "",
          type: type,
          color: color.label,
          tags: [type, subtype, color.label],
          favorited: false,
          imgUrl: resultUri.resultUri,
          backgroundRemoved: true,
        };
        dispatch(addItem(item));
      }
      completed += 1;
      setProgress(completed);
    }
    setProcessingImages(false);
    router.navigate("/add-item");
  }

  async function processUpdatedImage(img: string) {
    setProgress(0);
    setProgressTotal(1);
    setStatusText("Updating your item...");

    const color = await classifyClothing(img);
    const resultUri = await process(img);
    if (resultUri?.resultUri) {
      dispatch(setItemImgUrl({ index: itemsIndex, url: resultUri.resultUri }));
      for (const type of itemTypesArray) {
        if (item.tags.includes(type)) {
          dispatch(removeItemTag({ index: itemsIndex, tag: type }));
          const subTypes = itemSubTypes.filter((item) => item.key === type);
          for (const subType of subTypes) {
            if (item.tags.includes(subType.value)) {
              dispatch(
                removeItemTag({
                  index: itemsIndex,
                  tag: subType.value,
                }),
              );
            }
          }
        }
      }
      for (const color of itemColors) {
        if (item.tags.includes(color)) {
          dispatch(removeItemTag({ index: itemsIndex, tag: color }));
        }
      }
      const [type, subtype] = await getClassification(resultUri.resultUri);
      dispatch(setItemType({ index: itemsIndex, type }));
      dispatch(addItemTagToFront({ index: itemsIndex, tag: color.label }));
      dispatch(addItemTagToFront({ index: itemsIndex, tag: subtype }));
      dispatch(addItemTagToFront({ index: itemsIndex, tag: type }));
      setProgress(1);
      setProcessingImages(false);
      router.navigate("/add-item");
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

  const renderCamera = () => {
    return (
      <View style={{ gap: 70 }}>
        <CameraView
          style={styles.camera}
          ref={ref}
          mode={"picture"}
          facing={facing}
          mute={false}
          responsiveOrientationWhenOrientationLocked={false}
        ></CameraView>
        <View style={styles.shutterContainer}>
          {photos.length == 0 ? (
            <View style={{ width: 55 }} />
          ) : (
            // <Image
            //   source={{ uri: photos[photos.length - 1] }}
            //   style={styles.thumb}
            // />
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
                onPress={async () => {
                  if (retakeRef.current) {
                    setProcessingImages(true);
                    requestAnimationFrame(() => {
                      processUpdatedImage(photos[0]);
                    });
                  } else {
                    setProcessingImages(true);
                    requestAnimationFrame(() => {
                      processImages(photos);
                    });
                  }
                }}
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
            onPress={async () => {
              if (retakeRef.current) {
                setProcessingImages(true);
                requestAnimationFrame(() => {
                  processUpdatedImage(photos[0]);
                });
              } else {
                setProcessingImages(true);
                requestAnimationFrame(() => {
                  processImages(photos);
                });
              }
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
    camera: {
      width: "100%",
      aspectRatio: 4 / 5,
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
    // stack: {
    //   position: "absolute",
    //   bottom: 0,
    //   left: 0,
    //   marginHorizontal: 50,
    //   width: 120,
    //   height: 120,
    //   justifyContent: "center",
    //   alignItems: "center",
    // },
    // thumb: {
    //   width: 55,
    //   height: 55,
    //   borderRadius: 50,
    //   borderWidth: 0.5,
    //   borderColor: "white",
    //   backgroundColor: "#ddd",
    // },
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
      // "ADD TO LOOKBOOK" / "CLOSE"
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
