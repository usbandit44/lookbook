import { clearAllItems } from "@/features/create-outfit/redux/slices/outfitSlice";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";

const AddItemHeader = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          router.back();
        }}
        hitSlop={10}
      >
        <Icon name="arrow-back-ios" type="material" size={24}></Icon>
      </Pressable>
      <Text>Add Item</Text>
      <Pressable
        onPress={() => {
          dispatch(clearAllItems());
        }}
        hitSlop={10}
      >
        <Text>Reset</Text>
      </Pressable>
    </View>
  );
};

export default AddItemHeader;

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
