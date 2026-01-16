import MovableItem from "@/features/create-outfit/components/Movable";
import React from "react";
import { StyleSheet, View } from "react-native";

const playground = () => {
  return (
    <>
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
