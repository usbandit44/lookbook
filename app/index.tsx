import { Link } from "expo-router";
import React, { Component } from "react";
import { Text, View } from "react-native";

export class LoginPage extends Component {
  render() {
    return (
      <View>
        <Text>LoginPage</Text>
        <Link href="/(tabs)/home">View App</Link>
      </View>
    );
  }
}

export default LoginPage;
