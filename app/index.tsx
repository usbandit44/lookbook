import { Colors } from "@/constants/constants";
import { Link } from "expo-router";
import React, { Component } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export class LoginPage extends Component {
  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.light.background }}
      >
        <Text>LoginPage</Text>
        <Link href="/pages">View App</Link>
      </SafeAreaView>
    );
  }
}

export default LoginPage;
