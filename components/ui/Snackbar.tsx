import { Theme } from "@/constants/themes";
import { SnackbarAction } from "@/constants/types";
import { useTheme } from "@/hooks/ThemeProvider";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import AppText from "./AppText";

const Snackbar: React.FC<{
  children: string;
  action?: SnackbarAction;
  type: "default" | "success" | "error";
  visibility: boolean;
  //setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  onClear?: () => void;
}> = (props) => {
  let bgColor;
  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);
  switch (props.type) {
    case "default":
      bgColor = "blue";
      break;
    case "success":
      bgColor = theme.ink;
      break;
    case "error":
      bgColor = theme.danger;
      break;
    default:
      bgColor = "blue";
      break;
  }
  const moveUpAnim = useRef(new Animated.Value(-70)).current;
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (props.visibility) {
      Animated.timing(moveUpAnim, {
        toValue: 90,
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
          <View style={styles.dot}></View>
          <AppText type="m16" text={props.children} style={{}}></AppText>
        </View>
        <View style={styles.action}>
          {props.action ? (
            <Pressable onPress={props.action.actionFn}>
              <Text style={styles.text}>{props.action.actionMsg}</Text>
            </Pressable>
          ) : null}
          {/* <Pressable
            onPress={() => {
              props.onClose();
              console.log("ok");
              if (props.onClear) props.onClear();
            }}
            hitSlop={10}
          >
            <AppIcon name="close" color={theme.onInk} />
          </Pressable> */}
        </View>
      </View>
    </Animated.View>
  );
};

export default Snackbar;

const s = (t: Theme) =>
  StyleSheet.create({
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
      height: 45,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      backgroundColor: "green",
      borderRadius: 999,
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
    dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: t.onInk },
  });
