import { itemTypes } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { selectNewItemImg } from "@/redux/slices/cameraSlice";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

const AddItemForm = () => {
  const [selectedItem, setSelectedItem] = React.useState("");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const imgUri = useAppSelector(selectNewItemImg);

  const itemTypesSelect = Object.keys(itemTypes);

  const createItem = async () => {
    const fileName = `photo_${Date.now()}.jpg`; // Unique filename
    const dest = (FileSystem.documentDirectory ?? "") + fileName;
    try {
      await FileSystem.copyAsync({ from: imgUri, to: dest });
      // add file to sqlite
    } catch (error) {
      console.error("Failed to copy photo:", error);
    }
  };

  const renderPicture = () => {
    return (
      <View>
        <Image
          source={{ uri: imgUri }}
          contentFit="contain"
          style={{ width: 500, aspectRatio: 1 }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Asxs</Text>
      {imgUri == "" ? null : renderPicture()}
      <Button
        onPress={() => router.navigate("/(tabs)/playground")}
        title="Add Imag"
      ></Button>
      <SelectList
        setSelected={(val: React.SetStateAction<string>) =>
          setSelectedItem(val)
        }
        data={itemTypesSelect}
        save="value"
        search={false}
      />
      <Button title="Add Item" onPress={() => {}} />
    </View>
  );
};

export default AddItemForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#de6868ff" },
});
