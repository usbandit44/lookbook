import React from "react";
import { StyleSheet, Text } from "react-native";

type TextType = "p1" | "p2" | "p3" | "p3Bold" | "p3SemiBold";

const AppText: React.FC<{
  children: string;
  type?: TextType;
  style?: {};
}> = ({ type = "p3", ...props }) => {
  let styling = {};
  switch (type) {
    case "p1":
      styling = styles.p1;
      break;
    case "p2":
      styling = styles.p2;
      break;
    case "p3":
      styling = styles.p3;
      break;
    case "p3SemiBold":
      styling = styles.p3SemiBold;
      break;
    case "p3Bold":
      styling = styles.p3Bold;
      break;

    default:
      styling = styles.p3;
      break;
  }
  return <Text style={[styling, props.style]}>{props.children}</Text>;
};

export default AppText;

const styles = StyleSheet.create({
  p1: {},
  p2: { fontFamily: "InriaSerif-Bold", fontSize: 22 },
  p3: { fontFamily: "Lora-Regular", letterSpacing: 0.5 },
  p3SemiBold: { fontFamily: "Lora-SemiBold" },
  p3Bold: { fontFamily: "Lora-Bold" },
});
