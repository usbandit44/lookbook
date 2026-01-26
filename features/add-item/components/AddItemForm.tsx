import AppButton from "@/components/ui/AppButton";
import FormElement from "@/components/ui/FormElement";
import Input from "@/components/ui/Input";
import Snackbar from "@/components/ui/Snackbar";
import { Colors, itemTypes } from "@/constants/constants";
import { ItemsType } from "@/db/schemas/items";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { selectNewItemImg, updateNewItemImg } from "@/redux/slices/cameraSlice";
import { clearCurrentItem, selectCurrentItem } from "@/redux/slices/itemSlice";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Icon } from "react-native-elements";

type FormValues = {
  img: string;
  type: string;
};

const AddItemForm = () => {
  const repo = new AppItemRepo();

  const currentItemId = useAppSelector(selectCurrentItem);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setShowImgError(false);
        setShowTypeError(false);
        setshowNameError(false);
        // setshowSizeError(false);
      };
    }, []),
  );
  const [visablity, setVisablity] = useState(false);
  const [updateVisablity, setUpdateVisablity] = useState(false);
  let imgUri = useAppSelector(selectNewItemImg);
  const [currentItem, setCurrentItem] = useState<ItemsType | null>(null);
  let gap = { gap: 180 };
  if (currentItemId != -1) {
    gap = { gap: 150 };
  }
  useEffect(() => {
    if (currentItemId != -1) {
      async function getCurrentItem() {
        const item = await repo.getItem(currentItemId);
        setCurrentItem(item);

        console.log(item.name);
        setName(item.name);
        dispatch(updateNewItemImg(item.imgUrl));
        setSize(item.size ?? "");
        setType(item.type);
      }
      getCurrentItem();
    } else {
      async function getItemCount() {
        const count = await repo.countNumberOfItem();
        setName("Item #" + (Number(count) + 1));
      }
      getItemCount();
    }
  }, [visablity]);

  const [selectedItem, setSelectedItem] = React.useState("");
  const dispatch = useAppDispatch();

  const router = useRouter();

  const itemsArray = Object.entries(itemTypes).map(([key, label]) => ({
    label: String(label),
    value: String(key), // unique internal value (enum key)
  }));

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [items, setItems] = useState(itemsArray);

  const [showImgError, setShowImgError] = useState(false);
  const [showTypeError, setShowTypeError] = useState(false);
  const [showNameError, setshowNameError] = useState(false);
  // const [showSizeError, setshowSizeError] = useState(false);

  const [name, setName] = useState("");
  const [size, setSize] = useState("");

  const insertItem = async (item: {
    name: string;
    type: string;
    size: string;
    imgUrl: string;
  }) => {
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
    if (imgUri === "" || type == null || name == "") {
      if (imgUri === "") setShowImgError(true);
      if (type == null) setShowTypeError(true);
      if (name == "") setshowNameError(true);
      // if (size == "") setshowSizeError(true);
      return;
    }
    try {
      await FileSystem.copyAsync({ from: imgUri, to: dest });
      const newItem = {
        name: name,
        type: type,
        size: size.charAt(0).toUpperCase() + size.slice(1),
        imgUrl: dest,
      };
      insertItem(newItem);
      setType(null);
      dispatch(updateNewItemImg(""));
      setVisablity(!visablity);
      setTimeout(() => setVisablity(false), 3000);
    } catch (error) {
      console.log(imgUri);
      console.error("Failed to copy photo:", error);
    }
  };

  const updateItem = () => {
    if (imgUri === "" || type == null || name == "") {
      if (imgUri === "") setShowImgError(true);
      if (type == null) setShowTypeError(true);
      if (name == "") setshowNameError(true);
      // if (size == "") setshowSizeError(true);
      return;
    }
    if (
      currentItem?.imgUrl != imgUri ||
      currentItem?.name != name ||
      currentItem?.size != size ||
      currentItem.type != type
    ) {
      const newItem: ItemsType = {
        id: currentItemId,
        name: name,
        type: type,
        size: size,
        imgUrl: imgUri,
      };
      repo.updateItem(newItem);
      setUpdateVisablity(!updateVisablity);
      setTimeout(() => setVisablity(false), 3000);
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
    <View style={[styles.container, gap]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={styles.form}>
          <FormElement showError={showImgError} errorMsg="Add a Image">
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
                onPress={() => router.navigate("/camera-screen")}
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
          </FormElement>
          <FormElement showError={showNameError} errorMsg="Enter a name">
            <Input onChangeText={setName} value={name} />
          </FormElement>

          <Input onChangeText={setSize} value={size} placeholder="Size" />

          <FormElement showError={showTypeError} errorMsg="Select a type">
            <DropDownPicker
              open={open}
              value={type}
              items={items}
              setOpen={setOpen}
              setValue={setType}
              setItems={setItems}
              style={{ backgroundColor: Colors.light.background }}
              placeholder="Select Type"
            />
          </FormElement>
        </View>
      </KeyboardAvoidingView>
      <View style={{ zIndex: -10, gap: 15, paddingBottom: 15 }}>
        {currentItemId == -1 ? (
          <AppButton
            onPress={() => {
              createItem();
              // setVisablity(true);
            }}
          >
            <Text style={{ color: "white" }}>Create Item</Text>
          </AppButton>
        ) : (
          <AppButton
            onPress={() => {
              updateItem();
            }}
          >
            <Text style={{ color: "white" }}>Update Item</Text>
          </AppButton>
        )}

        <AppButton
          type="secondary"
          onPress={() => {
            router.navigate("/pages");
            dispatch(clearCurrentItem());
            dispatch(updateNewItemImg(""));
          }}
        >
          <Text>Cancel</Text>
        </AppButton>
        {currentItemId != -1 ? (
          <AppButton
            type="text"
            onPress={() => {
              router.navigate("/pages");
              repo.deleteItem(currentItemId);
              dispatch(clearCurrentItem());
              dispatch(updateNewItemImg(""));
            }}
          >
            <Text style={{ color: "red" }}>Delete</Text>
          </AppButton>
        ) : null}
      </View>

      <Snackbar
        visibility={visablity}
        setVisibility={setVisablity}
        type="success"
      >
        Item successfully added
      </Snackbar>
      <Snackbar
        visibility={updateVisablity}
        setVisibility={setUpdateVisablity}
        type="success"
      >
        Item successfully updated
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
    justifyContent: "flex-end",
    paddingTop: 50,
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
