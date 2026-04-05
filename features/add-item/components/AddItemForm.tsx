import AppButton from "@/components/ui/AppButton";
import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import FormElement from "@/components/ui/FormElement";
import Input from "@/components/ui/Input";
import { Colors, itemColors, itemTypes } from "@/constants/constants";
import { ItemsType } from "@/db/schemas/items";
import { normalizeImageUri } from "@/functions/normalizeImageUri";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useBackgroundRemover } from "@/hooks/useBackgroundRemover";
import { useSnackbar } from "@/hooks/useSnackBar";
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

/** Cache/temp paths (e.g. background-remover output) are deleted by the OS; only documentDirectory is stable. */
async function ensurePersistedItemImageUri(uri: string): Promise<string> {
  const doc = FileSystem.documentDirectory;
  if (!doc) throw new Error("documentDirectory unavailable");

  if (uri.startsWith(doc)) {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) return uri;
  }

  const ext = uri.toLowerCase().endsWith(".png") ? "png" : "jpg";
  const dest = `${doc}photo_${Date.now()}.${ext}`;
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
}

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
    if (currentItemId != -1) {
      async function getCurrentItem() {
        const item = await itemRepo.getItem(currentItemId);
        const normalizedImgUrl = normalizeImageUri(item.imgUrl);
        setCurrentItem(item);
        setName(item.name);
        if (imgUri == "") {
          dispatch(updateNewItemImg(normalizedImgUrl));
        }

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
  //const [backgroundRemoved, setBackgroudRemoved] = useState(false);

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
    // Preserve the actual image type we were given (e.g. background remover outputs PNG).
    const isPng = (imgUri ?? "").toLowerCase().endsWith(".png");
    const fileExt = isPng ? "png" : "jpg";
    const fileName = `photo_${Date.now()}.${fileExt}`; // Unique filename
    const dest = (FileSystem.documentDirectory ?? "") + fileName;
    let quit = false;
    if (imgUri === "" || type == null) {
      if (imgUri === "") setShowImgError(true);
      if (type == null) setShowTypeError(true);

      // if (size == "") setshowSizeError(true);
      return false;
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
        backgroundRemoved: true,
      };
      await insertItem(newItem);
      setType(null);
      setColor("");
      setName("");
      dispatch(updateNewItemImg(""));
      //setVisablity(!visablity);
      showSnackbar("Item successfully added", "success");

      setTimeout(() => hideSnackbar(), 3000);
      return true;
    } catch (error) {
      console.log(imgUri);
      console.error("Failed to copy photo:", error);
      return false;
    }
  };

  const updateItem = async (): Promise<boolean> => {
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
      try {
        const persistedUri = await ensurePersistedItemImageUri(imgUri);
        const newItem: ItemsType = {
          id: currentItemId,
          name: name,
          type: type,
          color: color,
          imgUrl: persistedUri,
          backgroundRemoved: true,
        };
        await itemRepo.updateItem(newItem);
        //setUpdateVisablity(!updateVisablity);
        dispatch(updateNewItemImg(""));
        dispatch(clearCurrentItem());
        showSnackbar("Item successfully updated", "success");

        setTimeout(() => hideSnackbar(), 3000);
        return true;
      } catch (e) {
        console.error("Failed to persist item image:", e);
        showSnackbar("Could not save image. Try again.", "error");
        return false;
      }
    }
    return false;
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
      <AppButton
        onPress={() => {
          router.navigate("/pages");
          dispatch(clearCurrentItem());
          dispatch(updateNewItemImg(""));
        }}
        style={{
          padding: 15,
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "transparent",
          zIndex: 100,
        }}
      >
        <Icon
          name="arrow-back-ios-new"
          type="material"
          color="black"
          size={24}
        />
      </AppButton>
      {currentItemId == -1 ? null : (
        <AppButton
          type="text"
          onPress={() => {
            setDeleteModal(!deleteModal);
          }}
          style={{
            padding: 15,
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "transparent",
            zIndex: 100,
          }}
        >
          <AppText style={{ color: Colors.light.destructive }}>Delete</AppText>
        </AppButton>
      )}

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
                <AppButton
                  type="text"
                  onPress={() => {
                    router.navigate("/camera-screen");
                    //dispatch(updateNewItemImg(""));
                  }}
                >
                  <AppText type="p3">Retake Image</AppText>
                </AppButton>
              </View>
            ) : (
              <Pressable style={styles.cameraButton}>
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
            dropDownDirection="BOTTOM"
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
              dropDownDirection="BOTTOM"
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
            onPress={async () => {
              const completed = await createItem();
              if (completed) {
                router.navigate("/pages");
              }
            }}
          >
            <AppText style={{ color: "white" }}>Done</AppText>
          </AppButton>
        ) : (
          <AppButton
            onPress={async () => {
              const ok = await updateItem();
              if (ok) router.navigate("/pages");
            }}
          >
            <AppText style={{ color: "white" }}>Update Item</AppText>
          </AppButton>
        )}

        {currentItemId != -1 ? (
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
        ) : (
          <AppButton
            type="secondary"
            onPress={async () => {
              const completed = await createItem();
              if (completed) {
                router.navigate("/camera-screen");
              }
            }}
          >
            <AppText>Add Another Item</AppText>
          </AppButton>
        )}
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
