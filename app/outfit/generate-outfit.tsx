import GenerateOutfitForm from "@/features/create-outfit/components/GenerateOutfitForm";
import React from "react";
import { StyleSheet, View } from "react-native";

const GenerateOutfit = () => {
  return (
    <View style={styles.container}>
      <GenerateOutfitForm />
    </View>
  );
};

export default GenerateOutfit;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
