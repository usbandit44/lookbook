import { itemTypes } from "@/constants/constants";
import { items } from "@/db/schemas/items";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { selectNewItemImg } from "@/redux/slices/cameraSlice";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

const AddItemForm = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const [selectedItem, setSelectedItem] = React.useState("");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const imgUri = useAppSelector(selectNewItemImg);

  const itemTypesSelect = Object.keys(itemTypes);

  const insertItem = async (item: { type: string; imgUrl: string }) => {
    return drizzleDb.insert(items).values(item);
  };

  const createItem = async () => {
    const fileName = `photo_${Date.now()}.jpg`; // Unique filename
    const dest = (FileSystem.documentDirectory ?? "") + fileName;
    try {
      await FileSystem.copyAsync({ from: imgUri, to: dest });
      const newItem = { type: selectedItem, imgUrl: dest };
      insertItem(newItem);
      console.log("add to sql");
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
      <Button
        title="Add Item"
        onPress={() => {
          createItem();
        }}
      />
    </View>
  );
};

export default AddItemForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#de6868ff" },
});
