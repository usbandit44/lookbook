import React from "react";
import { StyleSheet, Text } from "react-native";

const FormErrorAlert: React.FC<{
  children: string;
  show: boolean;
}> = (props) => {
  return props.show ? (
    <Text style={styles.errorText}>{props.children}</Text>
  ) : null;
};

export default FormErrorAlert;

const styles = StyleSheet.create({
  errorText: { color: "red" },
});
