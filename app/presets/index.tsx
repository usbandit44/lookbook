import PresetMenu from "@/features/presets/screens/PresetMenu";
import React from "react";
import { StyleSheet, View } from "react-native";

const PresetHome = () => {
  return (
    <View style={{ flex: 1 }}>
      <PresetMenu />
    </View>
  );
};

export default PresetHome;

const styles = StyleSheet.create({});
