import IconButton from "@/components/ui/IconButton";
import MainButton from "@/components/ui/MainButton";
import { Background } from "@react-navigation/elements";
import { Link } from "expo-router";
import React, { Component } from "react";
import { Text, View } from "react-native";
import icons from "../constants/icons";
import { Image } from "react-native";
import TopBar from "@/components/ui/TopBar";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export class LoginPage extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
        <TopBar />
        <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
        </Text>
        <Text>LoginPage</Text>
        <Link href="/(tabs)/home">View App</Link>
      </SafeAreaView>
    );
  }
}

export default LoginPage;
