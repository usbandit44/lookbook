import { TextToken, Theme } from "@/constants/themes";
import { useTheme } from "@/hooks/ThemeProvider";
import React, { useState } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import AppText from "./AppText";

type ButtonType =
  | "primary"
  | "secondary"
  | "ghostPrimary"
  | "ghostSecondary"
  | "text"
  | "icon"
  | "link";

const AppButton: React.FC<{
  label?: string;
  onPress?: () => void;
  type?: ButtonType;
  style?: ViewStyle;
  icon?: React.ReactNode | null;
  textColor?: string;
  disabled?: boolean;
}> = ({ type = "primary", icon = null, ...props }) => {
  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);

  const [isPressed, setIsPressed] = useState(false);
  const isDarkBackground = type === "primary";

  let typeStyling: any = {};
  let textType: TextToken = "m3";

  switch (type) {
    case "primary":
      typeStyling = {
        backgroundColor: theme.ink,
        // paddingLeft: 25,
        // paddingRight: 25,
        borderWidth: 1,
        borderColor: theme.ink,
        padding: 15,
      };

      textType = "m3";
      break;
    case "secondary":
      typeStyling = {
        padding: 15,
        // paddingLeft: 25,
        // paddingRight: 25,
        borderWidth: 1,
        borderColor: theme.inkA[20],
        backgroundColor: theme.surface,
      };
      textType = "m13";

      break;
    case "ghostPrimary":
      typeStyling = {
        backgroundColor: theme.inkA[35],
        // paddingLeft: 25,
        // paddingRight: 25,
        borderWidth: 1,
        borderColor: "transparent",
        padding: 15,
      };

      textType = "m3";
      break;
    case "ghostSecondary":
      typeStyling = {
        padding: 15,
        // paddingLeft: 25,
        // paddingRight: 25,
        borderWidth: 1,
        borderColor: theme.inkA[10],
      };

      textType = "m14";
      break;
    case "icon":
      typeStyling = { padding: 0, flex: 0 };
      break;
    case "text":
      typeStyling = {
        flex: "0",
      };

      break;
    case "link":
      typeStyling = {
        flex: "0",
        borderBottomWidth: 1,
        borderColor: theme.inkA[55],
        paddingBottom: 2,
      };

      break;

    default:
      break;
  }
  if (type == "icon" || type == "text" || type == "link") {
    return (
      <Pressable
        onPress={props.onPress}
        style={[typeStyling, props.style]}
        hitSlop={10}
        disabled={props.disabled}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
      >
        {isPressed && (
          <View
            style={[
              styles.pressOverlay,
              { borderRadius: 25, width: "100%", height: "100%" },
            ]}
            pointerEvents="none"
          />
        )}
        {icon}
        {type == "icon" ? null : (
          <AppText
            type={type == "text" ? "m4" : "m6"}
            text={props.label ?? ""}
            style={{ color: props.textColor }}
          ></AppText>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.mainButton, typeStyling, props.style]}
      disabled={props.disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      {isPressed && (
        <View
          style={[
            styles.pressOverlay,
            {
              backgroundColor: isDarkBackground
                ? t.whiteA[30] // light tint on dark buttons
                : t.inkA[20], // dark tint on light/transparent buttons
            },
          ]}
          pointerEvents="none"
        />
      )}
      <AppText
        type={textType}
        style={[styles.label]}
        text={props.label ?? ""}
      ></AppText>
    </Pressable>
  );
};

export default AppButton;

const s = (t: Theme) =>
  StyleSheet.create({
    mainButton: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      flexDirection: "row",
      gap: 9,
      height: 52,
    },
    label: {
      textAlign: "center",
    },
    pressOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: t.inkA[20],
    },
  });
