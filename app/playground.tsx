import MovableItem from "@/features/create-outfit/components/Movable";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";

const playground = () => {
  const router = useRouter();
  return (
    <>
      <Pressable
        onPress={() => {
          router.back();
        }}
      >
        <Icon name="arrow-back-ios" type="material" size={24}></Icon>
      </Pressable>
      <View
        style={{ height: 50, width: "100%", backgroundColor: "green" }}
      ></View>
      <View style={{ flex: 1 }}>
        <MovableItem />
      </View>
      <View
        style={{ height: 50, width: "100%", backgroundColor: "green" }}
      ></View>
    </>
  );
};

export default playground;

const styles = StyleSheet.create({});
