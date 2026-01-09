import FormErrorAlert from "@/components/ui/FormErrorAlert";
import Snackbar from "@/components/ui/Snackbar";
import { Colors, itemTypes } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { selectNewItemImg, updateNewItemImg } from "@/redux/slices/cameraSlice";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Button, Pressable, StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Icon } from "react-native-elements";

type FormValues = {
  img: string;
  type: string;
};

const AddItemForm = () => {
  useFocusEffect(
    useCallback(() => {
      return () => {
        setShowImgError(false);
        setShowTypeError(false);
      };
    }, [])
  );

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

  const [showImgError, setShowImgError] = useState(false);
  const [showTypeError, setShowTypeError] = useState(false);

  const [visablity, setVisablity] = useState(false);

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
    let quit = false;
    if (imgUri === "" || value == null) {
      if (imgUri === "") setShowImgError(true);
      if (value == null) setShowTypeError(true);
      return;
    }
    try {
      await FileSystem.copyAsync({ from: imgUri, to: dest });
      const newItem = { type: selectedItem, imgUrl: dest };
      insertItem(newItem);
      console.log("add to sql");
      setValue(null);
      dispatch(updateNewItemImg(""));
      setVisablity(true);
    } catch (error) {
      console.log(imgUri);
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
      <View style={styles.form}>
        {imgUri ? (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imgUri }}
              contentFit="cover"
              style={{ aspectRatio: 1, width: "100%", borderRadius: 2 }}
            />
            <Pressable
              onPress={() => dispatch(updateNewItemImg(""))}
              style={styles.clearIcon}
              hitSlop={10}
            >
              <Icon
                reverse
                name="close"
                type="material"
                color="black"
                size={15}
              />
            </Pressable>
          </View>
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
            />
          </Pressable>
        )}
        <FormErrorAlert show={showImgError}>Add a Image</FormErrorAlert>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          style={{ backgroundColor: Colors.light.background }}
        />
        <FormErrorAlert show={showTypeError}>Select a type</FormErrorAlert>
      </View>

      <Button
        title="Add Item"
        onPress={() => {
          createItem();
          setVisablity(true);
        }}
      />
      <Snackbar
        visibility={visablity}
        setVisibility={setVisablity}
        type="success"
      >
        Item successfully added
      </Snackbar>
    </View>
  );
};

export default AddItemForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
    justifyContent: "center",
    gap: 100,
  },
  form: {
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  clearIcon: {
    position: "absolute",
    top: -15,
    right: -15,
    backgroundColor: Colors.light.background,
    borderRadius: 50,
    padding: 1,
    zIndex: 2,
  },
  cameraButton: {
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    aspectRatio: 1,
  },
});
