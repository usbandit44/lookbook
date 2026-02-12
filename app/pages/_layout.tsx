import BottomNav from "@/features/navigation/components/BottomNav";
import TopBar from "@/features/navigation/components/TopBar";
import { Slot } from "expo-router";
import { View } from "react-native";
import { CopilotProvider } from "react-native-copilot";
import { text } from 'drizzle-orm/sqlite-core';

export default function Layout() {
  return (
    <CopilotProvider
      labels={{
        finish: "Got it!",
        next: "Next",
        previous: "Back",
      }}
      tooltipStyle={{
        borderRadius: 16,
        padding: 16,
      }}
      backdropColor="rgba(0,0,0,0.4)"
      stopOnOutsideClick={true}
      stepNumberComponent={() => null}
      animated
      overlay="svg"
      textStyle={{
        fontSize: 16,
        color: "white",
      }}
    >
      <View style={{ flex: 1 }}>
        <TopBar />
        <Slot />

        <BottomNav />
      </View>
    </CopilotProvider>
  );
}
