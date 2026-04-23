import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import AppText from "./AppText";

const Tag: React.FC<{
  children: string;
  onClear?: () => void;
  style?: {};
}> = (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <AppText style={styles.text}>{props.children}</AppText>
      {props.onClear ? (
        <Pressable onPress={props.onClear} hitSlop={20}>
          <Icon name="clear" type="material" color="white" size={15} />
        </Pressable>
      ) : null}
    </View>
  );
  //   return <Text style={[styles., props.style]}>{props.children}</Text>;
};

export default Tag;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#090a0a",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 0,
    flexDirection: "row",
    gap: 8,
    height: 40,
  },
  text: { fontSize: 14, color: "white" },
});
