import AppText from "@/components/ui/AppText";
import icons from "@/constants/icons";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { updateNewItemImg } from "@/redux/slices/cameraSlice";
import { clearCurrentItem } from "@/redux/slices/itemSlice";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Icon } from "react-native-elements";

const BottomNav = () => {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [active, setActive] = useState(false);
  const navHeight = useRef(new Animated.Value(80)).current;
  //   const navCorner = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(navHeight, {
      toValue: active ? 160 : 80,
      duration: 300,
      useNativeDriver: false, // Required for height
    }).start();
    // Animated.timing(navCorner, {
    //   toValue: active ? 50 : 0,
    //   duration: 250,
    //   useNativeDriver: false, // Required for height
    // }).start();
  }, [active]);

  // Counter-scale for children to stay normal size

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: navHeight,
        },
      ]}
    >
      {active ? (
        <View
          style={{
            position: "static",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 60,
          }}
        >
          <Pressable
            onPress={() => {
              setActive(false);
            }}
            style={{
              position: "absolute",
              top: 15,
              left: 15,
            }}
          >
            <Icon name="close" type="material"></Icon>
          </Pressable>
          <View style={styles.navButtonContainer}>
            <Pressable
              onPress={() => {
                setActive(false);
                dispatch(updateNewItemImg(""));
                dispatch(clearCurrentItem());
                router.navigate("/camera-screen");
              }}
              style={styles.navButton}
            >
              <Icon name="shirt-outline" type="ionicon" size={35}></Icon>
            </Pressable>
            <AppText type="p3SemiBold">Add Item</AppText>
          </View>
          <View style={styles.navButtonContainer}>
            <Pressable
              onPress={() => {
                router.navigate("/outfit/create-outfit");
              }}
              style={styles.navButton}
            >
              <Image
                source={icons.createOutfitIcon}
                style={{ width: 45, height: 45, resizeMode: "contain" }}
              />
            </Pressable>
            <AppText type="p3SemiBold">Create Outfit</AppText>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={() => {
            setActive(true);
          }}
        >
          <Icon
            name="add-circle-outline"
            type="material"
            color="black"
            size={30}
          />
        </Pressable>
      )}
    </Animated.View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: "black",
    borderWidth: 1,

    overflow: "hidden",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  navButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  navButton: {
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
  },
});
