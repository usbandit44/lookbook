import { itemTypes } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { selectNewItemImg, updateNewItemImg } from "@/redux/slices/cameraSlice";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Icon } from "react-native-elements";

const AddItemForm = () => {
  const repo = new AppItemRepo();

  const [selectedItem, setSelectedItem] = React.useState("");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const imgUri = useAppSelector(selectNewItemImg);

  const itemsArray = Object.entries(itemTypes).map(([key, label]) => ({
    label: String(label),
    value: String(key), // unique internal value (enum key)
  }));

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(itemsArray);

  const insertItem = async (item: { type: string; imgUrl: string }) => {
    try {
      await repo.addItem(item);
    } catch (err) {
      console.log(err);
    }
  };

  const createItem = async () => {
    const fileName = `photo_${Date.now()}.jpg`; // Unique filename
    const dest = (FileSystem.documentDirectory ?? "") + fileName;
    try {
      await FileSystem.copyAsync({ from: imgUri, to: dest });
      const newItem = { type: selectedItem, imgUrl: dest };
      insertItem(newItem);
      console.log("add to sql");
      setValue(null);
      dispatch(updateNewItemImg(""));
    } catch (error) {
      console.error("Failed to copy photo:", error);
    }
  };

  const renderPicture = () => {
    return (
      <View>
        <Icon
          reverse
          name="add-photo-alternate"
          type="material"
          color="#517fa4"
        />
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
      <View style={styles.imgHolder}>
        {imgUri ? (
          <Image
            source={{ uri: imgUri }}
            contentFit="contain"
            style={{ width: 500, aspectRatio: 1 }}
          />
        ) : (
          <Pressable
            onPress={() => router.navigate("/(tabs)/playground")}
            style={styles.cameraButton}
          >
            <Icon
              name="add-photo-alternate"
              type="material"
              color="#3c3636ff"
              size={50}
              onPress={() => router.navigate("/(tabs)/playground")}
            />
          </Pressable>
        )}
      </View>

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
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
  container: { flex: 1, backgroundColor: "#de6868ff", padding: 10 },
  imgHolder: {
    flex: 0.6,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
