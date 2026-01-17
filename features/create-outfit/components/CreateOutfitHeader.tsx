import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Icon } from "react-native-elements";

const CreateOutfitHeader: React.FC<{
  onChangeText: ((text: string) => void) | undefined;
  value: string | undefined;
}> = (props) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          router.back();
        }}
      >
        <Icon name="arrow-back-ios" type="material" size={24}></Icon>
      </Pressable>
      <TextInput
        onChangeText={props.onChangeText}
        value={props.value}
        placeholderTextColor="black"
        style={styles.name}
      />
      <Pressable>
        <Icon name="bookmark-border" type="material" size={30}></Icon>
      </Pressable>
    </View>
  );
};

export default CreateOutfitHeader;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 30,
    paddingBottom: 30,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 25,
  },
  name: {
    flex: 1,
    height: 50,
    borderColor: "black",
    borderWidth: 1.1,
    borderRadius: 8,
    color: "black",
    padding: 8,
    textAlign: "center",
    fontSize: 25,
  },
});
