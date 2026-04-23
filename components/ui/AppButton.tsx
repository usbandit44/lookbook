import React from "react";
import { Pressable, StyleSheet } from "react-native";

type ButtonType = "primary" | "secondary" | "icon" | "text" | "custom";

const AppButton: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  /** when true → full width (100%), when false/undefined → hug content */
  fullWidth?: boolean;
  type?: ButtonType;
  style?: {};
}> = ({ type = "primary", fullWidth = false, ...props }) => {
  const widthStyle = fullWidth ? { alignSelf: "stretch" } : {};

  let typeStyling: any = {};

  switch (type) {
    case "primary":
      typeStyling = {
        backgroundColor: "#090a0a",
        padding: 15,
        paddingLeft: 25,
        paddingRight: 25,
      };
      break;
    case "secondary":
      typeStyling = {
        padding: 14,
        paddingLeft: 24,
        paddingRight: 24,
        borderWidth: 1,
      };
      break;
    case "icon":
      typeStyling = { padding: 10 };
      break;
    case "text":
      //typeStyling = { padding: 10 };
      break;
    case "custom":
      break;
    default:
      break;
  }

  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.mainButton, widthStyle, typeStyling, props.style]}
      hitSlop={type === "text" ? 10 : undefined}
    >
      {props.children}
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  mainButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
  },
});
