import { SwipeTabs } from "@/components/ui/SwipeTabs";
import BottomNav from "@/features/navigation/components/BottomNav";
import TopBar from "@/features/navigation/components/TopBar";
import { View } from "react-native";

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      {/* <Slot /> */}
      <SwipeTabs
        tabBar={() => null} // hide the built-in bar, keep your BottomNav
        screenOptions={{
          swipeEnabled: true,
          lazy: true,
          sceneStyle: { backgroundColor: "transparent" },
        }}
      >
        {/* The order here is the swipe order. Use your route file names. */}
        <SwipeTabs.Screen name="index" />
        <SwipeTabs.Screen name="outfits" />
      </SwipeTabs>
      <BottomNav />
    </View>
  );
}
