import React from "react";
import { StyleSheet, TextInput } from "react-native";

const Input: React.FC<{
  onChangeText: ((text: string) => void) | undefined;
  value: string | undefined;
  placeholder?: string;
}> = (props) => {
  return (
    <TextInput
      onChangeText={props.onChangeText}
      value={props.value}
      placeholder={props.placeholder}
      placeholderTextColor="grey"
      style={styles.input}
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 50,
    borderColor: "black",
    borderWidth: 1.1,
    borderRadius: 8,
    color: "black",
    padding: 8,
    fontFamily: "Lora-Regular",
  },
});
