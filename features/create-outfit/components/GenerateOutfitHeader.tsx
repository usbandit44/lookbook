import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";

const GenerateOutfitHeader = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          router.navigate("/outfit/create-outfit");
        }}
        hitSlop={10}
      >
        <Icon name="arrow-back-ios" type="material" size={24}></Icon>
      </Pressable>
      <Text>Generate Outfit</Text>
      <Pressable onPress={() => {}} hitSlop={10}>
        <Text>Reset</Text>
      </Pressable>
    </View>
  );
};

export default GenerateOutfitHeader;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 30,
    paddingBottom: 30,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 25,
  },
});
