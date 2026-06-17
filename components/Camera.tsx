import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useBackgroundRemover } from "@/hooks/useBackgroundRemover";
import { useWardrobeImagePicker } from "@/hooks/useWardrobeImagePicker";
// import { selectNewItemImg, updateNewItemImg } from "@/redux/slices/cameraSlice";
import {
  itemColors,
  itemSubTypes,
  itemTypesArray,
  NewItemType,
} from "@/constants/constants";
import { getClassification } from "@/functions/getClassification";
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
  ActivityIndicator,
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
  //const apiHandler = new ApiHandler();
  const rootState = useRootNavigationState();

  const getPreviousRouteName = () => {
    // Ensure the navigation state has finished initializing
    if (!rootState?.routes) return null;

    const routes = rootState.routes;

    // If there is more than one page in the current stack
    if (routes.length > 1) {
      // The second to last item is the previous page
      const previousRoute = routes[routes.length - 2];
      return previousRoute.name;
    }

    return null;
  };
  const previousPage = getPreviousRouteName();

  const { process } = useBackgroundRemover();
  const { pickMultipleImages, pickSingleImage } = useWardrobeImagePicker();
  const [processingImages, setProcessingImages] = useState(false);
  async function processImages(imgs: string[]) {
    setProcessingImages(true);
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
    }
    setProcessingImages(false);
    router.navigate("/add-item");
  }

  async function processUpdatedImage(img: string) {
    setProcessingImages(true);
    const color = await classifyClothing(img);
    const resultUri = await process(img);
    if (resultUri?.resultUri) {
      dispatch(setItemImgUrl({ index: itemsIndex, url: resultUri.resultUri }));
      //remove old type and subtype
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
      setProcessingImages(false);
      router.navigate("/add-item");
    }
  }

  const handlePickImage = async () => {
    if (retakeRef.current) {
      const uri = await pickSingleImage();
      if (uri) {
        processUpdatedImage(uri);
      }
    } else {
      const uris = await pickMultipleImages();
      if (uris) {
        processImages(uris);
      }
    }
  };

  // useEffect(() => {
  //   async function Temp() {
  //     if (state.status === "done") {
  //       const classification = await ClothingSubtypeClassifier.classify(
  //         state.resultUri,
  //       );
  //       console.log(classification.label);
  //       dispatch(updateNewItemImg(state.resultUri));
  //       router.navigate("/add-item");
  //     }
  //   }
  //   Temp();
  // }, [state]);
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
  //const imgUri = useAppSelector(selectNewItemImg);
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
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      //await dispatch(updateNewItemImg(photo.uri));
      setPhotos((prev) => [...prev, photo.uri]);
    }
    // process(imgUri);
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
      {photos.length == 0 ? null : (
        <AppButton
          onPress={async () => {
            if (retakeRef.current) {
              processUpdatedImage(photos[photos.length - 1]);
            } else {
              processImages(photos);
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

      {processingImages ? <ActivityIndicator size="large" /> : renderCamera()}
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
    //flex: 1,
    width: "100%",
    // height: 500,
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
