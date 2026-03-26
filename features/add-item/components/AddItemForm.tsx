import AppButton from "@/components/ui/AppButton";
import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import FormElement from "@/components/ui/FormElement";
import Input from "@/components/ui/Input";
import { Colors, itemColors, itemTypes } from "@/constants/constants";
import { ItemsType } from "@/db/schemas/items";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useBackgroundRemover } from "@/hooks/useBackgroundRemover";
import { useSnackbar } from "@/hooks/useSnackBar";
import { useWardrobeImagePicker } from "@/hooks/useWardrobeImagePicker";
import { selectNewItemImg, updateNewItemImg } from "@/redux/slices/cameraSlice";
import { clearCurrentItem, selectCurrentItem } from "@/redux/slices/itemSlice";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import AppOutfitRepo from "@/repo/outfit_repo/AppOutfitRepo";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Icon } from "react-native-elements";

type FormValues = {
  img: string;
  type: string;
};

const AddItemForm = () => {
  const snackbarSettingsContext = useSnackbar();
  if (!snackbarSettingsContext) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  const { setSettings, showSnackbar, hideSnackbar, settings } =
    snackbarSettingsContext;
  const { state, process } = useBackgroundRemover();

  const itemRepo = new AppItemRepo();
  const outfitRepo = new AppOutfitRepo();

  const currentItemId = useAppSelector(selectCurrentItem);

  const { pickImage } = useWardrobeImagePicker();

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      dispatch(updateNewItemImg(uri));
      setBackgroudRemoved(false);
      await process(uri); // auto remove background
    }
  };

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

  const [deleteModal, setDeleteModal] = useState(false);

  let imgUri = useAppSelector(selectNewItemImg);
  const [currentItem, setCurrentItem] = useState<ItemsType | null>(null);
  let gap = { gap: 180 };
  if (currentItemId != -1) {
    gap = { gap: 150 };
  }

  useEffect(() => {
    if (state.status === "done") {
      dispatch(updateNewItemImg(state.resultUri));
      setBackgroudRemoved(true);
    }
  }, [state]);

  useEffect(() => {
    if (currentItemId != -1) {
      async function getCurrentItem() {
        const item = await itemRepo.getItem(currentItemId);
        setCurrentItem(item);
        setName(item.name);

        dispatch(updateNewItemImg(item.imgUrl));
        setBackgroudRemoved(item.backgroundRemoved);

        setColor(item.color ?? "");
        setType(item.type);
      }
      getCurrentItem();
    } else {
      async function getItemCount() {
        const count = await itemRepo.countNumberOfItem();
        setDefaultName("Item #" + (Number(count) + 1));
      }
      getItemCount();
    }
  }, [currentItemId, settings]);

  const [selectedItem, setSelectedItem] = React.useState("");
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openColorDropdown, setOpenColorDropdown] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [items, setItems] = useState(
    Object.entries(itemTypes).map(([key, label]) => ({
      label: String(label),
      value: String(key), // unique internal value (enum key)
    })),
  );
  const [colorValues, setColorValues] = useState(
    itemColors.map((color) => ({
      label: color,
      value: color,
    })),
  );
  const [backgroundRemoved, setBackgroudRemoved] = useState(false);

  const [showImgError, setShowImgError] = useState(false);
  const [showTypeError, setShowTypeError] = useState(false);
  const [showNameError, setshowNameError] = useState(false);
  // const [showSizeError, setshowSizeError] = useState(false);

  const [name, setName] = useState("");
  const [defaultName, setDefaultName] = useState("");
  const [color, setColor] = useState("");

  const insertItem = async (item: {
    name: string;
    type: string;
    color: string;
    imgUrl: string;
    backgroundRemoved: boolean;
  }) => {
    try {
      await itemRepo.addItem(item);
    } catch (err) {
      console.log(err);
    }
  };

  const createItem = async () => {
    const fileName = `photo_${Date.now()}.jpg`; // Unique filename
    const dest = (FileSystem.documentDirectory ?? "") + fileName;
    let quit = false;
    if (imgUri === "" || type == null) {
      if (imgUri === "") setShowImgError(true);
      if (type == null) setShowTypeError(true);

      // if (size == "") setshowSizeError(true);
      return;
    }
    try {
      await FileSystem.copyAsync({ from: imgUri, to: dest });
      const finalName = name === "" ? defaultName : name;
      console.log(name);
      const newItem = {
        name: finalName,
        type: type,
        color: color,
        imgUrl: dest,
        backgroundRemoved: backgroundRemoved,
      };
      insertItem(newItem);
      setType(null);
      setColor("");
      setName("");
      dispatch(updateNewItemImg(""));
      //setVisablity(!visablity);
      showSnackbar("Item successfully added", "success");

      setTimeout(() => hideSnackbar(), 3000);
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
      return false;
    }
    if (
      currentItem?.imgUrl != imgUri ||
      currentItem?.name != name ||
      currentItem?.color != color ||
      currentItem.type != type
    ) {
      const newItem: ItemsType = {
        id: currentItemId,
        name: name,
        type: type,
        color: color,
        imgUrl: imgUri,
        backgroundRemoved: backgroundRemoved,
      };
      itemRepo.updateItem(newItem);
      //setUpdateVisablity(!updateVisablity);

      showSnackbar("Item successfully updated", "success");
      setTimeout(() => router.navigate("/pages"), 300);
      //router.navigate("/pages");
      setTimeout(() => hideSnackbar(), 3000);
      //setTimeout(() => setVisablity(false), 3000);
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
                  onPress={() => {
                    dispatch(updateNewItemImg(""));
                    setBackgroudRemoved(false);
                  }}
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
                onPress={() => {
                  //router.navigate("/camera-screen");
                  Alert.alert(
                    "Add Photo",
                    "Choose how you'd like to add your item",
                    [
                      {
                        text: "Library",
                        onPress: () => handlePickImage(),
                        style: "cancel",
                      },
                      {
                        text: "Camera",
                        onPress: () => router.navigate("/camera-screen"),
                      },
                    ],
                  );
                }}
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
            <Input
              onChangeText={setName}
              value={name}
              placeholder={defaultName}
            />
          </FormElement>

          <DropDownPicker
            open={openColorDropdown}
            value={color}
            items={colorValues}
            setOpen={setOpenColorDropdown}
            setValue={setColor}
            setItems={setColorValues}
            style={{
              backgroundColor: "transparent",
            }}
            textStyle={{ fontFamily: "Lora-Regular" }}
            placeholder="Select Color"
          />

          <FormElement showError={showTypeError} errorMsg="Select a type">
            <DropDownPicker
              open={open}
              value={type}
              items={items}
              setOpen={setOpen}
              setValue={setType}
              setItems={setItems}
              style={{
                backgroundColor: "transparent",
              }}
              textStyle={{ fontFamily: "Lora-Regular" }}
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
            }}
          >
            <AppText style={{ color: "white" }}>Create Item</AppText>
          </AppButton>
        ) : (
          <AppButton
            onPress={() => {
              if (updateItem()) {
                router.navigate("/pages");
              }
            }}
          >
            <AppText style={{ color: "white" }}>Update Item</AppText>
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
          <AppText>Cancel</AppText>
        </AppButton>
        {currentItemId != -1 ? (
          <AppButton
            type="text"
            onPress={() => {
              setDeleteModal(!deleteModal);
            }}
          >
            <AppText style={{ color: Colors.light.destructive }}>
              Delete
            </AppText>
          </AppButton>
        ) : null}
      </View>

      <AppModal modalVisible={deleteModal} setModalVisible={setDeleteModal}>
        <AppText>Do you delete this item</AppText>
        <AppButton
          fullWidth={true}
          onPress={async () => {
            router.navigate("/pages");
            itemRepo.deleteItem(currentItemId);
            outfitRepo.removeItemFromAllOutfits(currentItemId);
            dispatch(clearCurrentItem());
            dispatch(updateNewItemImg(""));
          }}
        >
          <AppText style={{ color: "white" }}>Delete</AppText>
        </AppButton>
        <AppButton
          fullWidth={true}
          onPress={() => {
            setDeleteModal(!deleteModal);
          }}
          type="secondary"
        >
          <AppText>Cancel</AppText>
        </AppButton>
      </AppModal>
    </View>
  );
};

export default AddItemForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    gap: 5,
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
