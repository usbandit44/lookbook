import { Colors } from "@/constants/constants";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

export default function MainButton({
  title = "Button",
  onPress = () => {},
  backgroundColor = Colors.light.text,
  textColor = Colors.light.background,
  style = {},
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: backgroundColor,
          paddingVertical: 12,
          paddingHorizontal: 24,
          width: "75%",
          height: 48,
          borderRadius: 8,
          alignItems: "center",
          marginLeft: "auto",
          marginRight: "auto",
        },
        style,
      ]}
    >
      <Text
        style={{
          color: textColor,
          fontFamily: "lora-SemiBold",
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
