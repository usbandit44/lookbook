import { TextToken } from "@/functions/themeBuilder";
import { useTheme } from "@/hooks/ThemeProvider";
import React from "react";
import { Text } from "react-native";

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
