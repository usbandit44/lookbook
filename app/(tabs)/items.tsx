import TopBar from "@/components/ui/TopBar";
import { Colors } from "@/constants/constants";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Items = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <TopBar />
      <Text>Items</Text>
    </SafeAreaView>
  );
};

export default Items;
