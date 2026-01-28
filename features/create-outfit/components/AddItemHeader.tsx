import AppButton from "@/components/ui/AppButton";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/constants/constants";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { clearAllItems } from "@/redux/slices/outfitSlice";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";

const AddItemHeader = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  return (
    <View style={styles.container}>
      <AppButton
        onPress={() => {
          router.navigate("/outfit/create-outfit");
        }}
        type="icon"
      >
        <Icon name="arrow-back-ios" type="material" size={20}></Icon>
      </AppButton>
      <AppText type="p2">Add Item</AppText>
      <AppButton
        onPress={() => {
          dispatch(clearAllItems());
        }}
        type="text"
        style
      >
        <AppText type="p3Bold" style={{ color: Colors.light.destructive }}>
          Reset
        </AppText>
      </AppButton>
    </View>
  );
};

export default AddItemHeader;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 30,
    paddingBottom: 30,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 25,
  },
});
