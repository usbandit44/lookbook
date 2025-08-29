//This is an example so you understand what is needed
import React from "react";
import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";

const Button: React.FC<{
  children: React.ReactNode;
  type: "primary" | "secondary" | "text" | "icon";
  onPressFunction?: (event: GestureResponderEvent) => void;

  style?: {};
}> = (props) => {
  const { children, type, onPressFunction, style } = props;
  switch (type) {
    case "primary":
      return (
        <Pressable
          style={[styles.primaryButton, style]}
          onPress={onPressFunction}
        >
          <h2 style={styles.primaryText}>{children}</h2>
        </Pressable>
      );
    case "secondary":
      return (
        <Pressable
          style={[styles.secondaryButton, style]}
          onPress={onPressFunction}
        >
          <h2 style={styles.secondaryText}>{children}</h2>
        </Pressable>
      );
    case "text":
      return (
        <Pressable style={[style, styles.textButton]} onPress={onPressFunction}>
          <p>{children}</p>
        </Pressable>
      );
    case "icon":
      return (
        <Pressable style={[style, styles.iconButton]} onPress={onPressFunction}>
          {children}
        </Pressable>
      );
  }
};

const styles = StyleSheet.create({
  primaryButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  secondaryButton: {
    justifyContent: "center",
    alignItems: "center",
    borderBlockColor: "black",
    borderWidth: 1.5,
    padding: -1.5,
  },
  textButton: {
    borderBottomColor: "black",
    borderBottomWidth: 1.5,
    padding: -1.5,
  },
  iconButton: {},
  primaryText: {
    color: "white",
    paddingVertical: 7,
    paddingHorizontal: 20,
  },
  secondaryText: {
    color: "black",
    paddingVertical: 7,
    paddingHorizontal: 20,
  },
});

export default Button;
