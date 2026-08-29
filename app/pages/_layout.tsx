import BottomNav from "@/features/navigation/components/BottomNav";
import TopBar from "@/features/navigation/components/TopBar";
import { Slot } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <View style={{ flex: 1, padding: 15 }}>
      <TopBar />
      <Slot />

      <BottomNav />
    </View>
  );
}
