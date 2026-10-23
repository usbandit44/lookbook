import CreatePresetForm from "@/features/presets/screens/CreatePresetForm";
import React from "react";
import { StyleSheet, View } from "react-native";

const CreatePreset = () => {
  return (
    <View style={{ flex: 1 }}>
      <CreatePresetForm />
    </View>
  );
};

export default CreatePreset;

const styles = StyleSheet.create({});
