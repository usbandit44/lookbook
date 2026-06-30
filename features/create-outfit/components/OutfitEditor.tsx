import AppButton from "@/components/ui/AppButton";
import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import icons from "@/constants/icons";
import { ItemsType } from "@/db/schemas/items";
import { normalizeImageUri } from "@/functions/normalizeImageUri";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useSnackbar } from "@/hooks/useSnackBar";
import {
  clearAllItems,
  clearCurrentOutfit,
  removeItem,
  selectCurrentOutfitId,
  selectOutfit,
  setItems,
} from "@/redux/slices/outfitSlice";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import AppOutfitRepo from "@/repo/outfit_repo/AppOutfitRepo";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { InteractionManager, Pressable, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { captureRef } from "react-native-view-shot";
import Movable from "./Movable";

const BASE_SIZE = 100;

function arraysEqualUnordered(arr1: number[], arr2: number[]) {
  const sorted1 = [...arr1].sort((a, b) => a - b);
  const sorted2 = [...arr2].sort((a, b) => a - b);
  return JSON.stringify(sorted1) === JSON.stringify(sorted2);
}

const OutfitEditor: React.FC = () => {
  const snackbarSettingsContext = useSnackbar();
  if (!snackbarSettingsContext) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  const { showSnackbar, hideSnackbar, settings } = snackbarSettingsContext;

  const dispatch = useAppDispatch();
  const viewRef = useRef<View>(null);

  const outfitRepo = new AppOutfitRepo();
  const [saved, setSaved] = useState(false);
  const [outfitName, setOutfitName] = useState("");
  const [defaultName, setDefaultName] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);

  const repo = new AppItemRepo();
  const items = useAppSelector(selectOutfit);
  const currentOutfit = useAppSelector(selectCurrentOutfitId);

  const [outfit, setOutfit] = useState<ItemsType[]>([]);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [savedOutfitId, setSavedOutfitId] = useState<number>(-1);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [editing, setEditing] = useState(false);

  const [oldOutfit, setOldOutfit] = useState<{
    id: number;
    name: string;
    items: number[];
    imgUrl: string;
    updateImgUrl: boolean;
  }>({
    id: 0,
    name: "",
    items: [],
    imgUrl: "",
    updateImgUrl: false,
  });

  // ── Screenshot helper — hides UI, captures, restores ─────────────────────
  // const captureOutfit = async (): Promise<string> => {
  //   setIsCapturing(true);

  //   // Wait for React to fully flush the render before capturing
  //   await new Promise<void>((resolve) => {
  //     InteractionManager.runAfterInteractions(() => {
  //       setTimeout(resolve, 100);
  //     });
  //   });

  //   const imgUri = await captureRef(viewRef, {
  //     format: "jpg",
  //     quality: 0.9,
  //   });

  //   setIsCapturing(false);
  //   return imgUri;
  // };
  const captureOutfit = async (): Promise<string> => {
    const view = viewRef.current; // 👈 store it FIRST

    if (!view) {
      throw new Error("viewRef is null");
    }

    setIsCapturing(true);

    await new Promise<void>((resolve) => {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(resolve, 100);
      });
    });

    const imgUri = await captureRef(view, {
      // 👈 use stored view
      format: "jpg",
      quality: 0.9,
    });

    setIsCapturing(false);
    return imgUri;
  };
  // ─────────────────────────────────────────────────────────────────────────

  // const saveOutfit = async () => {
  //   const imgUri = await captureOutfit();
  //   const fileName = `screenshot_${Date.now()}.jpg`;
  //   const dest = (FileSystem.documentDirectory ?? "") + fileName;
  //   await FileSystem.copyAsync({ from: imgUri, to: dest });

  //   const createdOutfitId = await outfitRepo.addOutfit({
  //     items: items,
  //     name: outfitName,
  //     imgUrl: dest,
  //   });
  //   console.log(createdOutfitId);
  //   setSavedOutfitId(createdOutfitId);
  // };

  const saveOutfit = async () => {
    try {
      console.log("1 - starting save");

      const imgUri = await captureOutfit();
      console.log("2 - captured image:", imgUri);

      const fileName = `screenshot_${Date.now()}.jpg`;
      const dest = (FileSystem.documentDirectory ?? "") + fileName;

      await FileSystem.copyAsync({ from: imgUri, to: dest });
      console.log("3 - copied file");

      const finalName = outfitName === "" ? defaultName : outfitName;

      const createdOutfitId = await outfitRepo.addOutfit({
        items: items,
        name: finalName,
        imgUrl: dest,
      });

      console.log("4 - created outfit:", createdOutfitId);

      setSavedOutfitId(createdOutfitId);
    } catch (err) {
      console.error("❌ SAVE FAILED:", err);
    }
  };

  const updateOutfit = async () => {
    const imgUri = await captureOutfit();
    const fileName = `screenshot_${Date.now()}.jpg`;
    const dest = (FileSystem.documentDirectory ?? "") + fileName;
    await FileSystem.copyAsync({ from: imgUri, to: dest });

    const newOutfit = {
      id: currentOutfit.id,
      name: outfitName,
      imgUrl: dest,
      items: items,
      updateImgUrl: false,
    };
    outfitRepo.updateOutfit(newOutfit);
  };

  const deleteOutfit = () => {
    outfitRepo.deleteOutfit(currentOutfit.id);
  };

  const undoOutfitChanges = async () => {
    const oldOutfit = await outfitRepo.getOutfit(currentOutfit.id);
    setOutfitName(oldOutfit.name);
    dispatch(setItems(oldOutfit.items));
  };

  const leftButton = () => {
    return editing ? (
      <AppButton
        type="icon"
        onPress={() => {
          undoOutfitChanges();
        }}
      >
        <Icon name="close" type="material" size={24} />
      </AppButton>
    ) : (
      <AppButton
        type="icon"
        onPress={async () => {
          if (currentOutfit.id != -1) {
            if (
              !arraysEqualUnordered(oldOutfit.items, items) ||
              oldOutfit.name != outfitName
            ) {
              setModalVisible(!modalVisible);
            } else {
              if (oldOutfit.updateImgUrl) {
                const imgUri = await captureOutfit();
                const fileName = `screenshot_${Date.now()}.jpg`;
                const dest = (FileSystem.documentDirectory ?? "") + fileName;
                await FileSystem.copyAsync({ from: imgUri, to: dest });
                outfitRepo.updateOutfitImgUrl(currentOutfit.id, dest);
                outfitRepo.updateOutfitUpdateImgUrl(currentOutfit.id, false);
              }
              dispatch(clearAllItems());
              dispatch(clearCurrentOutfit());
              router.navigate("/pages/outfits");
            }
          } else {
            // if (saved) {
            //   console.log(saved);
            //   await saveOutfit();
            // }
            dispatch(clearAllItems());
            dispatch(clearCurrentOutfit());
            router.navigate("/pages/outfits");
          }
        }}
      >
        <Icon name="arrow-back-ios" type="material" size={24} />
      </AppButton>
    );
  };

  const rightButton = () => {
    if (currentOutfit.id != -1) {
      return (
        // <AppButton
        //   type="text"
        //   onPress={() => setDeleteModalVisible(!deleteModalVisible)}
        // >
        //   <AppText style={{ color: Colors.light.destructive }}>Delete</AppText>
        // </AppButton>
        editing ? (
          <AppButton type="icon">
            <Icon
              name="check"
              type="material"
              size={24}
              onPress={async () => {
                await updateOutfit();
                showSnackbar("Outfit saved!", "success");
                // setTimeout(() => router.navigate("/pages/outfits"), 300);
                setTimeout(() => hideSnackbar(), 3000);
              }}
            />
          </AppButton>
        ) : (
          <AppButton type="icon">
            <Icon name="more-vert" type="material" size={24} />
          </AppButton>
        )
      );
    } else {
      return (
        // <AppButton onPress={() => setSaved(!saved)} type="icon">
        //   {saved ? (
        //     <Icon name="bookmark" type="material" size={30} />
        //   ) : (
        //     <Icon name="bookmark-border" type="material" size={30} />
        //   )}
        // </AppButton>
        <AppButton
          type="text"
          onPress={async () => {
            await saveOutfit();
            dispatch(clearAllItems());
            dispatch(clearCurrentOutfit());

            showSnackbar("Outfit added!", "success");

            setTimeout(() => router.navigate("/pages/outfits"), 300);
            setTimeout(() => hideSnackbar(), 3000);
          }}
        >
          <AppText>Save</AppText>
        </AppButton>
      );
    }
  };

  useEffect(() => {
    if (currentOutfit.id != -1) {
      setOutfitName(currentOutfit.name);
      async function setup() {
        const pastOutfit = await outfitRepo.getOutfit(currentOutfit.id);
        const results = await Promise.all(items.map((id) => repo.getItem(id)));
        if (!arraysEqualUnordered(pastOutfit.items, items)) {
          setEditing(true);
        } else {
          setEditing(false);
        }
        setOutfit(results);
        setOldOutfit(pastOutfit);
      }
      setup();
    } else {
      async function getItemCount() {
        const count = await outfitRepo.countNumberOfOutfit();
        setDefaultName("Outfit #" + (Number(count) + 1));
      }
      getItemCount();
    }
  }, [items, settings]);

  // useEffect(() => {
  //   const fetchItems = async () => {
  //     const results = await Promise.all(items.map((id) => repo.getItem(id)));
  //     if (!arraysEqualUnordered(oldOutfit.items, items)) {
  //       console.log("hello");
  //       setEditing(true);
  //     }
  //     setOutfit(results);
  //   };
  //   fetchItems();
  // }, [items]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        {leftButton()}

        {/* <TextInput
          onChangeText={setOutfitName}
          value={outfitName}
          placeholderTextColor="grey"
          placeholder={defaultName}
          style={styles.name}
        /> */}

        {rightButton()}
      </View>

      <View
        style={styles.editor}
        onLayout={(e) =>
          setParentSize({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          })
        }
        ref={viewRef}
      >
        {parentSize.width > 0 &&
          parentSize.height > 0 &&
          outfit.map((item) => (
            <Movable
              key={item.id}
              parentW={parentSize.width}
              parentH={parentSize.height}
              initialX={Math.random() * (parentSize.width - BASE_SIZE)}
              initialY={Math.random() * (parentSize.height - BASE_SIZE)}
              onClear={() => dispatch(removeItem(item.id))}
              isCapturing={isCapturing}
            >
              <Image
                source={{ uri: normalizeImageUri(item.imgUrl ?? "") }}
                contentFit="contain"
                style={{ width: "100%", height: "100%", borderRadius: 8 }}
              />
            </Movable>
          ))}
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.navButtonContainer}>
          <Pressable
            onPress={() => router.navigate("/outfit/add-item")}
            style={styles.navButton}
          >
            <Icon name="shirt-outline" type="ionicon" size={35} />
          </Pressable>
          <AppText type="p3SemiBold">Add Item</AppText>
        </View>
        <View style={styles.navButtonContainer}>
          <Pressable
            onPress={() => router.navigate("/outfit/generate-outfit")}
            style={styles.navButton}
          >
            <Image
              source={icons.generateOutfitIcon}
              style={{ width: 45, height: 45, resizeMode: "contain" }}
            />
          </Pressable>
          <AppText type="p3SemiBold">Generate Outfit</AppText>
        </View>
      </View>

      <AppModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <AppText>Do you want to save your edits?</AppText>
        <AppButton
          fullWidth={true}
          onPress={async () => {
            await updateOutfit();
            showSnackbar("Outfit saved!", "success");
            setModalVisible(!modalVisible);
            setTimeout(() => router.navigate("/pages/outfits"), 300);
            setTimeout(() => hideSnackbar(), 3000);
          }}
        >
          <AppText style={{ color: "white" }}>Save</AppText>
        </AppButton>
        <AppButton
          fullWidth={true}
          onPress={() => {
            undoOutfitChanges();
            setModalVisible(!modalVisible);
          }}
        >
          <AppText style={{ color: "white" }}>Undo</AppText>
        </AppButton>
      </AppModal>

      <AppModal
        modalVisible={deleteModalVisible}
        setModalVisible={setDeleteModalVisible}
      >
        <AppText>Do you want to delete this outfit?</AppText>
        <AppButton
          fullWidth={true}
          onPress={async () => {
            deleteOutfit();
            setDeleteModalVisible(!deleteModalVisible);
            dispatch(clearAllItems());
            dispatch(clearCurrentOutfit());
            router.navigate("/pages/outfits");
          }}
        >
          <AppText style={{ color: "white" }}>Yes</AppText>
        </AppButton>
        <AppButton
          fullWidth={true}
          onPress={() => setDeleteModalVisible(!deleteModalVisible)}
        >
          <AppText style={{ color: "white" }}>Cancel</AppText>
        </AppButton>
      </AppModal>
    </View>
  );
};

export default OutfitEditor;

const styles = StyleSheet.create({
  editor: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
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
    fontFamily: "Lora-SemiBold",
    letterSpacing: 1,
  },
  footerContainer: {
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
