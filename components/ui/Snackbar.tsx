import { SnackbarAction } from "@/constants/types";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Icon } from "react-native-elements";

const Snackbar: React.FC<{
  children: string;
  action?: SnackbarAction;
  type: "default" | "success" | "error";
  visibility: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  onClear?: () => void;
}> = (props) => {
  let icon;
  let bgColor;
  switch (props.type) {
    case "default":
      icon = (
        <Icon name="info-outline" type="material" color="#ffffff" size={24} />
      );
      bgColor = "blue";
      break;
    case "success":
      icon = <Icon name="done" type="material" color="#ffffff" size={24} />;
      bgColor = "green";
      break;
    case "error":
      icon = (
        <Icon name="error-outline" type="material" color="#ffffff" size={24} />
      );
      bgColor = "red";
      break;
    default:
      icon = (
        <Icon name="info-outline" type="material" color="#ffffff" size={24} />
      );
      bgColor = "blue";
      break;
  }
  const moveUpAnim = useRef(new Animated.Value(-70)).current;
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (props.visibility) {
      Animated.timing(moveUpAnim, {
        toValue: 20,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(moveUpAnim, {
        toValue: -70,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [props.visibility, moveUpAnim]);

  return (
    <Animated.View
      style={{
        ...styles.container,
        bottom: moveUpAnim,
        width: width,
      }}
      pointerEvents={props.visibility ? "auto" : "none"}
    >
      <View style={{ ...styles.snackbar, backgroundColor: bgColor }}>
        <View style={styles.message}>
          {icon}
          <Text style={styles.text}>{props.children}</Text>
        </View>
        <View style={styles.action}>
          {props.action ? (
            <Pressable onPress={props.action.actionFn}>
              <Text style={styles.text}>{props.action.actionMsg}</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => {
              props.setVisibility(false);
              if (props.onClear) props.onClear();
            }}
            hitSlop={10}
          >
            <Icon name="close" type="material" color="#ffffff" size={24} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

export default Snackbar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,

    padding: 10,
    left: 0,

    justifyContent: "center",
    alignItems: "center",
  },
  snackbar: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "green",
    borderRadius: 5,
    shadowColor: "rgba(0, 0, 0, 0.24)", // The color of the shadow
    shadowOffset: {
      width: 0, // Horizontal offset
      height: 3, // Vertical offset
    },
    shadowOpacity: 1, // Opacity (0 to 1) - the color rgba handles the opacity here
    shadowRadius: 8, // Blur radius

    // Android Shadow Prop
    elevation: 8, // Elevation for a similar visual depth on Android
  },
  message: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  action: { flexDirection: "row", alignItems: "center", gap: 30 },
  text: { color: "#ffffff", fontWeight: "bold" },
});
