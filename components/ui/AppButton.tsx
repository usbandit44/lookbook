import { TextToken } from "@/constants/themes";
import { useTheme } from "@/hooks/ThemeProvider";
import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import AppText from "./AppText";

type ButtonType = "primary" | "secondary" | "ghost" | "text" | "icon" | "link";

const AppButton: React.FC<{
  label?: string;
  onPress?: () => void;
  type?: ButtonType;
  style?: ViewStyle;
  icon?: React.ReactNode | null;
  textColor?: string;
}> = ({ type = "primary", icon = null, ...props }) => {
  const { theme } = useTheme();

  let typeStyling: any = {};
  let textType: TextToken = "m3";

  switch (type) {
    case "primary":
      typeStyling = {
        backgroundColor: theme.ink,
        // paddingLeft: 25,
        // paddingRight: 25,
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
    case "ghost":
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
      >
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
    >
      <AppText
        type={textType}
        style={[styles.label]}
        text={props.label ?? ""}
      ></AppText>
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
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
});
