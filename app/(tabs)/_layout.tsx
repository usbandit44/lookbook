import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        headerShown: true,
        headerStyle: Platform.select({ ios: styles.iosHeader }),
        headerTitle: "",
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            // position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="add-item"
        options={{
          title: "Add Item",
        }}
      />
      <Tabs.Screen
        name="playground"
        options={{
          title: "Play",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iosHeader: { height: 60, backgroundColor: "rgba(0, 0, 0, 0)" },
});
