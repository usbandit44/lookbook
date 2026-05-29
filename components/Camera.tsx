import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useBackgroundRemover } from "@/hooks/useBackgroundRemover";
import { useWardrobeImagePicker } from "@/hooks/useWardrobeImagePicker";
import { selectNewItemImg, updateNewItemImg } from "@/redux/slices/cameraSlice";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import ClothingSubtypeClassifier from "../modules/clothing-subtype-classifier";
import AppButton from "./ui/AppButton";
import AppText from "./ui/AppText";

export function Camera() {
  //const apiHandler = new ApiHandler();

  const { state, process } = useBackgroundRemover();
  const { pickImage } = useWardrobeImagePicker();

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      dispatch(updateNewItemImg(uri));
      //await process(uri); // auto remove background
    }
  };

  useEffect(() => {
    async function Temp() {
      if (state.status === "done") {
        const classification = await ClothingSubtypeClassifier.classify(
          state.resultUri,
        );
        console.log(classification.label);
        dispatch(updateNewItemImg(state.resultUri));
        router.navigate("/add-item");
      }
    }
    Temp();
  }, [state]);

  const [openToolTip, setOpenToolTip] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const dispatch = useAppDispatch();
  const imgUri = useAppSelector(selectNewItemImg);
  const router = useRouter();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (imgUri) {
      process(imgUri);
    }
  }, [imgUri]);
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
    console.log(ClothingSubtypeClassifier.hello());
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      await dispatch(updateNewItemImg(photo.uri));
    }
    // process(imgUri);
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const renderPicture = () => {
    return (
      <View>
        <Image
          source={{ uri: imgUri }}
          contentFit="contain"
          style={{ width: "100%", aspectRatio: 1 }}
        />
        <View style={{ height: 50 }}></View>
      </View>
    );
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
          {/* <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: 32,
              gap: 5,
            }}
          ></View> */}
          <Pressable
            style={{ flexDirection: "column" }}
            onPress={() => handlePickImage()}
          >
            <Icon name="photo" type="material" color="white" size={32} />
            <AppText style={{ color: "white" }}>Library</AppText>
          </Pressable>

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
          <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppButton
        onPress={() => {
          if (imgUri == "") {
            router.back();
          } else {
            dispatch(updateNewItemImg(""));
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
      {state.status == "loading" ? (
        <ActivityIndicator size="large" />
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
    //flex: 1,
    width: "100%",
    // height: 500,
    aspectRatio: 1,
  },
  shutterContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",

    paddingHorizontal: 30,
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
});

export default Camera;
