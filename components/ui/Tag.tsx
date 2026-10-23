import { useTheme } from "@/hooks/ThemeProvider";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppText from "./AppText";

const Tag: React.FC<{
  label: string;
  onClear?: () => void;
}> = (props) => {
  const { theme } = useTheme();
  const backgroundColor = theme.ink;
  const labelColor = theme.onInk;
  const clearColor = theme.whiteA[65];
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <AppText type="m3" text={props.label}></AppText>
      {props.onClear ? (
        <Pressable onPress={props.onClear} hitSlop={20}>
          <Text style={[styles.clear, { color: clearColor }]}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
  //   return <Text style={[styles., props.style]}>{props.children}</Text>;
};

export default Tag;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 10, // tighter on the ✕ side
    borderRadius: 0,
  },

  clear: {
    fontFamily: "Archivo-SemiBold",
    fontSize: 10,
  },
});
