import { Colors } from "@/constants/constants";
import { Link } from "expo-router";
import React, { Component } from "react";
import { Text, View } from "react-native";

export class LoginPage extends Component {
  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: Colors.light.background, gap: 20 }}
      >
        <Text>LoginPage</Text>
        <Link href="/pages">View App</Link>
        <Link href="/playground">Playground</Link>
      </View>
    );
  }
}

export default LoginPage;
