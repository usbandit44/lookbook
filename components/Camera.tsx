import ProcessingIndicator from "@/components/ui/ProcessingIndicator";
import {
  itemColors,
  itemSubTypes,
  itemTypesArray,
  NewItemType,
} from "@/constants/constants";
import { getClassification } from "@/functions/getClassification";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
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
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { classifyClothing } from "../modules/clothing-classifier";
import AppButton from "./ui/AppButton";
import AppText from "./ui/AppText";

export function Camera() {
  const rootState = useRootNavigationState();

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
  const [progressTotal, setProgressTotal] = useState(0);
  const [statusText, setStatusText] = useState("Processing your photos...");

  async function processImages(imgs: string[]) {
    setProgress(0);
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

  const [openToolTip, setOpenToolTip] = useState(false);

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
            <Image
              source={{ uri: photos[photos.length - 1] }}
              style={styles.thumb}
            />
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
            }}
            onPress={() => handlePickImage()}
          >
            <Icon name="photo" type="material" color="white" size={32} />
            <AppText style={{ color: "white" }}>Library</AppText>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {processingImages ? null : (
        <AppButton
          onPress={() => {
            if (retakeRef.current) {
              router.navigate("/add-item");
            } else {
              dispatch(clearItems());
              router.navigate("/pages");
            }
          }}
          style={{
            padding: 15,
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "transparent",
          }}
        >
          <Icon
            name="arrow-back-ios-new"
            type="material"
            color="white"
            size={24}
          />
        </AppButton>
      )}

      {photos.length == 0 ? null : (
        <AppButton
          onPress={async () => {
            if (retakeRef.current) {
              setProcessingImages(true);
              requestAnimationFrame(() => {
                processUpdatedImage(photos[photos.length - 1]);
              });
            } else {
              setProcessingImages(true);
              requestAnimationFrame(() => {
                processImages(photos);
              });
            }
          }}
          style={{
            padding: 15,
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "transparent",
          }}
        >
          <Icon name="check" type="material" color="white" size={30} />
        </AppButton>
      )}

      {processingImages ? (
        <ProcessingIndicator
          progress={progress}
          total={progressTotal}
          statusText={statusText}
        />
      ) : (
        renderCamera()
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    aspectRatio: 1,
  },
  shutterContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 30,
    gap: 50,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  stack: {
    position: "absolute",
    bottom: 0,
    left: 0,
    marginHorizontal: 50,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  thumb: {
    width: 55,
    height: 55,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: "white",
    backgroundColor: "#ddd",
  },
});

export default Camera;
