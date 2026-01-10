import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import TopBar from "@/components/ui/TopBar";

const Outfits = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
     <TopBar />
      <Text>Outfits</Text>
    </SafeAreaView>
  );
};

export default Outfits;
