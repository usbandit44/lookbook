import CreateOutfitFooter from "@/features/create-outfit/components/CreateOutfitFooter";
import CreateOutfitHeader from "@/features/create-outfit/components/CreateOutfitHeader";
import OutfitEditor from "@/features/create-outfit/components/OutfitEditor";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const CreateOutfit = () => {
  const [outfitName, setOutfitName] = useState("Outfit #1");
  return (
    <View style={{ flex: 1 }}>
      <CreateOutfitHeader onChangeText={setOutfitName} value={outfitName} />

      <OutfitEditor />
      <CreateOutfitFooter />
    </View>
  );
};

export default CreateOutfit;

const styles = StyleSheet.create({});
