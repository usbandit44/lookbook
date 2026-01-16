import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { selectNewItemImg, updateNewItemImg } from "@/redux/slices/cameraSlice";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { removeBackground } from "react-native-background-remover";
import { Icon } from "react-native-elements";
import Popover from "react-native-popover-view";

export function Camera() {
  const [isRemoveBackgroundEnabled, setIsRemoveBackgroundEnabled] =
    useState(false);
  const toggleSwitch = () => {
    setIsRemoveBackgroundEnabled((previousState) => !previousState);
    console.log(isRemoveBackgroundEnabled);
  };

  const [openToolTip, setOpenToolTip] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const dispatch = useAppDispatch();
  const imgUri = useAppSelector(selectNewItemImg);
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
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      if (isRemoveBackgroundEnabled) {
        const backgroundRemovedImageURI = await removeBackground(photo.uri);
        dispatch(updateNewItemImg(backgroundRemovedImageURI));
      } else {
        dispatch(updateNewItemImg(photo.uri));
      }
    }
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
          style={{ width: 500, aspectRatio: 4 / 5 }}
        />
        <Button
          onPress={() => dispatch(updateNewItemImg(""))}
          title="Take another picture"
        />
        <Button
          title="Keep picture"
          onPress={() => router.navigate("/add-item")}
        />
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
          zoom={0.1}
        ></CameraView>
        <View style={styles.shutterContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: 32,
              gap: 5,
            }}
          >
            <Popover
              from={
                <TouchableOpacity>
                  <Icon name="info" type="material" color="white" size={24} />
                </TouchableOpacity>
              }
            >
              <Text style={{ padding: 20 }}>
                Turn on to enbale background removale
              </Text>
            </Popover>
            <Switch
              trackColor={{ false: "#767577", true: "#0f8702ff" }}
              thumbColor={"#f4f3f4"}
              onValueChange={toggleSwitch}
              value={isRemoveBackgroundEnabled}
            />
          </View>

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
      <Pressable
        onPress={() => {
          router.back();
        }}
        style={{ padding: 15, position: "absolute", top: 0, left: 0 }}
      >
        <Icon name="close" type="material" color="white" size={30} />
      </Pressable>
      {imgUri == "" ? renderCamera() : renderPicture()}
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
