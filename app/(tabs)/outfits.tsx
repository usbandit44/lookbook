import TopBar from "@/components/ui/TopBar";
import { Colors } from "@/constants/constants";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Outfits = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <TopBar />
      <Text>Outfits</Text>
    </SafeAreaView>
  );
};

export default Outfits;
