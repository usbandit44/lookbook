import { TextToken } from "@/constants/themes";
import { useTheme } from "@/hooks/ThemeProvider";
import React from "react";
import { StyleSheet, Text } from "react-native";

type TextType = "p1" | "p2" | "p3" | "p3Bold" | "p3SemiBold";

const AppText: React.FC<{
  text: string;
  type: TextToken;
  style?: {};
  numberOfLines?: number;
  ellipsizeMode?: "clip" | "head" | "middle" | "tail" | undefined;
}> = ({ ...props }) => {
  const { theme } = useTheme();

  return (
    <Text
      style={[theme.text[props.type], props.style]}
      numberOfLines={props.numberOfLines}
      ellipsizeMode={props.ellipsizeMode}
    >
      {props.text}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  p1: {},
  p2: { fontFamily: "InriaSerif-Bold", fontSize: 22 },
  p3: { fontFamily: "Lora-Regular", letterSpacing: 0.5 },
  p3SemiBold: { fontFamily: "Lora-SemiBold" },
  p3Bold: { fontFamily: "Lora-Bold" },
});
