import { Colors } from "@/constants/constants";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Icon } from "react-native-elements";

const BottomNav = () => {
  const pathname = usePathname();

  const { width } = useWindowDimensions();
  const router = useRouter();
  const [active, setActive] = useState(false);
  const navHeight = useRef(new Animated.Value(80)).current;
  //   const navCorner = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(navHeight, {
      toValue: active ? 160 : 80,
      duration: 250,
      useNativeDriver: false, // Required for height
    }).start();
    // Animated.timing(navCorner, {
    //   toValue: active ? 50 : 0,
    //   duration: 250,
    //   useNativeDriver: false, // Required for height
    // }).start();
  }, [active]);

  // Counter-scale for children to stay normal size
  if (!pathname.includes("pages")) {
    return null;
  }
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
          <Pressable
            onPress={() => {
              setActive(false);
              setTimeout(() => {
                router.navigate("/add-item");
              }, 260);
            }}
            style={styles.navButton}
          >
            <Icon name="shirt-outline" type="ionicon" size={35}></Icon>
          </Pressable>
          <Pressable
            onPress={() => {
              setActive(false);
            }}
            style={styles.navButton}
          >
            <Text>Heldlo</Text>
          </Pressable>
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
    backgroundColor: Colors.light.background,
    overflow: "hidden",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
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
