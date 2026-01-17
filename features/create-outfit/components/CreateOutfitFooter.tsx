import icons from "@/constants/icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
const CreateOutfitFooter = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.navButtonContainer}>
        <Pressable
          onPress={() => {
            router.navigate("/outfit/add-item");
          }}
          style={styles.navButton}
        >
          <Icon name="shirt-outline" type="ionicon" size={35}></Icon>
        </Pressable>
        <Text>Add Item</Text>
      </View>
      <View style={styles.navButtonContainer}>
        <Pressable
          onPress={() => {
            router.navigate("/outfit/generate-outfit");
          }}
          style={styles.navButton}
        >
          <Image
            source={icons.createOutfitIcon}
            style={{ width: 45, height: 45, resizeMode: "contain" }}
          />
        </Pressable>
        <Text>Create Outfit</Text>
      </View>
    </View>
  );
};

export default CreateOutfitFooter;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 75,
    padding: 30,
  },
  navButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  navButton: {
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
  },
});
