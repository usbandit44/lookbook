import { Theme } from "@/functions/themeBuilder";
import { useTheme } from "@/hooks/ThemeProvider";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppIcon } from "./AppIcon";
import AppText from "./AppText";

const Tag: React.FC<{
  label: string;
  onClear?: () => void;
}> = (props) => {
  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);
  const backgroundColor = theme.accent;
  const labelColor = theme.onAccent;
  const clearColor = theme.inkA[65];
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <AppText type="m3" text={props.label}></AppText>
      {props.onClear ? (
        <Pressable onPress={props.onClear} hitSlop={20}>
          <AppIcon name={"close"} size={15}></AppIcon>
        </Pressable>
      ) : null}
    </View>
  );
  //   return <Text style={[styles., props.style]}>{props.children}</Text>;
};

export default Tag;

const s = (t: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 12,
      paddingRight: 10, // tighter on the ✕ side
      borderRadius: t.shape.radius.chip,
    },

    clear: {
      fontFamily: "Archivo-SemiBold",
      fontSize: 10,
    },
  });
