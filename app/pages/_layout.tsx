import BottomNav from "@/features/navigation/components/BottomNav";
import TopBar from "@/features/navigation/components/TopBar";
import { Slot } from "expo-router";
import { View } from "react-native";
import { text } from 'drizzle-orm/sqlite-core';

export default function Layout() {
  return (
      <View style={{ flex: 1 }}>
        <TopBar />
        <Slot />

        <BottomNav />
      </View>
  );
}
