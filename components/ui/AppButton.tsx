import { shadowStyle, TextToken, Theme } from "@/functions/themeBuilder";
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
  children?: React.ReactNode;
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
        backgroundColor: theme.accent,
        // paddingLeft: 25,
        // paddingRight: 25,
        borderWidth: theme.shape.borderWidth,
        borderColor: theme.accent,
        padding: 15,
      };

      textType = "m3";
      break;
    case "secondary":
      typeStyling = {
        padding: 15,
        // paddingLeft: 25,
        // paddingRight: 25,
        borderWidth: theme.shape.borderWidth,
        borderColor: theme.inkA[20],
        backgroundColor: theme.surface,
      };
      textType = "m13";

      break;
    case "ghostPrimary":
      typeStyling = {
        backgroundColor: theme.surface, // opaque, so the shadow comes out clean
        borderWidth: 0, // otherwise the border ring shows the base colour
        padding: 15,
      };
      textType = "m3";
      break;
    case "ghostSecondary":
      typeStyling = {
        padding: 15,
        // paddingLeft: 25,
        // paddingRight: 25,
        borderWidth: theme.shape.borderWidth,
        borderColor: theme.inkA[30],
        backgroundColor: theme.surface,
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
              {
                borderRadius: theme.shape.radius.control,
                width: "100%",
                height: "100%",
              },
            ]}
            pointerEvents="none"
          />
        )}
        {icon}
        {type == "icon" ? null : (
          <AppText
            type={type == "text" ? "m4" : "m6"}
            text={props.label ?? ""}
            style={props.textColor ? { color: props.textColor } : {}}
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
      {type === "ghostPrimary" && (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: theme.accentA[70],
              borderRadius: theme.shape.radius.control,
            },
          ]}
        />
      )}
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
      {props.children}
      <AppText
        type={textType}
        style={[
          styles.label,
          props.textColor ? { color: props.textColor } : {},
        ]}
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
      borderRadius: t.shape.radius.control,
      ...shadowStyle(t.shape.shadow.control),
    },
    label: {
      textAlign: "center",
    },
    pressOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: t.inkA[20],
      borderRadius: t.shape.radius.control,
    },
  });
