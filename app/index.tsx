import IconButton from "@/components/ui/IconButton";
import MainButton from "@/components/ui/MainButton";
import { Background } from "@react-navigation/elements";
import { Link } from "expo-router";
import React, { Component } from "react";
import { Text, View } from "react-native";
import icons from "../constants/icons";
import { Image } from "react-native";
import TopBar from "@/components/ui/TopBar";

export class LoginPage extends Component {
  render() {
    return (
      <View>
        <TopBar />
        <MainButton
        title="Submit"
        onPress={() => alert('Submitted!')}
        />
        <IconButton
        onPress={() => alert('Icon Pressed!')}
        backgroundColor="#ADD8E6"
        icon={<Image source={icons.logo} style={{ width: 180, height: 180 }} />}
        style={{ height: 180, width: 180 }}
        />
        <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
        </Text>
        <Text>LoginPage</Text>
        <Link href="/(tabs)/home">View App</Link>
      </View>
    );
  }
}

export default LoginPage;
