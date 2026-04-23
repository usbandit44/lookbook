import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Icon } from "react-native-elements";

const SearchBar: React.FC<{
  value: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}> = (props) => {
  const [showClear, setShowClear] = useState(false);
  return (
    <View style={styles.searchbar}>
      {showClear ? null : (
        <Icon name="search" type="material" color="#888" size={20} />
      )}

      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor="black"
        style={styles.input}
        onFocus={() => {
          setShowClear(true);
        }}
        onBlur={() => {
          setShowClear(false);
        }}
      ></TextInput>
      <Pressable
        onPress={() => {
          props.onChangeText("");
        }}
        hitSlop={20}
      >
        <Icon name="close" type="material" color="#888" size={20} />
      </Pressable>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchbar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,

    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  input: { flex: 1 },
});
