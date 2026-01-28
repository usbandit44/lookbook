import AppButton from "@/components/ui/AppButton";
import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import Snackbar from "@/components/ui/Snackbar";
import { Colors } from "@/constants/constants";
import icons from "@/constants/icons";
import { ItemsType } from "@/db/schemas/items";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  clearAllItems,
  clearCurrentOutfit,
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
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Icon } from "react-native-elements";
import { captureRef } from "react-native-view-shot";
import Movable from "./Movable";

const BASE_SIZE = 100;

function arraysEqualUnordered(arr1: number[], arr2: number[]) {
  const sorted1 = [...arr1].sort((a, b) => a - b);
  const sorted2 = [...arr2].sort((a, b) => a - b);
  console.log(JSON.stringify(sorted1) === JSON.stringify(sorted2));
  return JSON.stringify(sorted1) === JSON.stringify(sorted2);
}

const OutfitEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const viewRef = useRef<View>(null);

  const outfitRepo = new AppOutfitRepo();
  const [saved, setSaved] = useState(false);
  const [outfitName, setOutfitName] = useState("");

  const repo = new AppItemRepo();
  const items = useAppSelector(selectOutfit);
  const currentOutfit = useAppSelector(selectCurrentOutfitId);

  const [outfit, setOutfit] = useState<ItemsType[]>([]);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  const [snackbarVisiblity, setSnackbarVisiblity] = useState(false);
  const [savedOutfitId, setSavedOutfitId] = useState<number>(-1);

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const saveOutfit = async () => {
    const imgUri = await captureRef(viewRef, {
      format: "jpg",
      quality: 0.9,
    });

    // Your exact FileSystem pattern
    const fileName = `screenshot_${Date.now()}.jpg`;
    const dest = (FileSystem.documentDirectory ?? "") + fileName;

    // Copy screenshot to your destination
    await FileSystem.copyAsync({ from: imgUri, to: dest });

    const createdOutfitId = await outfitRepo.addOutfit({
      items: items,
      name: outfitName,
      imgUrl: dest,
    });
    //dispatch(setCurrentOutfit(createdOutfitId));
    setSavedOutfitId(createdOutfitId);
  };

  const updateOutfit = async () => {
    const imgUri = await captureRef(viewRef, {
      format: "jpg",
      quality: 0.9,
    });

    // Your exact FileSystem pattern
    const fileName = `screenshot_${Date.now()}.jpg`;
    const dest = (FileSystem.documentDirectory ?? "") + fileName;

    // Copy screenshot to your destination
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

  const saveButton = () => {
    if (currentOutfit.id != -1) {
      return (
        <AppButton
          type="text"
          onPress={() => {
            setDeleteModalVisible(!deleteModalVisible);
          }}
        >
          {/* <Icon name="done" type="material" size={26}></Icon> */}
          <AppText style={{ color: Colors.light.destructive }}>Delete</AppText>
        </AppButton>
      );
    } else {
      return (
        <AppButton
          onPress={async () => {
            if (saved) {
              // outfitRepo.deleteOutfit(savedOutfitId);
              // console.log("deleted");
              // setSavedOutfitId(-1);
              // dispatch(setCurrentOutfit(-1));
              setSaved(!saved);
            } else {
              setSaved(!saved);
            }
          }}
          type="icon"
        >
          {saved ? (
            <Icon name="bookmark" type="material" size={30}></Icon>
          ) : (
            <Icon name="bookmark-border" type="material" size={30}></Icon>
          )}
        </AppButton>
      );
    }
  };

  useEffect(() => {
    if (currentOutfit.id != -1) {
      setOutfitName(currentOutfit.name);
    } else {
      async function getItemCount() {
        const count = await outfitRepo.countNumberOfOutfit();
        setOutfitName("Outfit #" + (Number(count) + 1));
      }
      getItemCount();
    }
  }, []);
  // Fetch outfit items
  useEffect(() => {
    const fetchItems = async () => {
      const results = await Promise.all(items.map((id) => repo.getItem(id)));
      setOutfit(results);
    };
    fetchItems();
  }, [items]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <AppButton
          type="icon"
          onPress={async () => {
            if (currentOutfit.id != -1) {
              const oldOutfit = await outfitRepo.getOutfit(currentOutfit.id);
              if (
                !arraysEqualUnordered(oldOutfit.items, items) ||
                oldOutfit.name != outfitName
              ) {
                setModalVisible(!modalVisible);
              } else {
                if (oldOutfit.updateImgUrl) {
                  const imgUri = await captureRef(viewRef, {
                    format: "jpg",
                    quality: 0.9,
                  });

                  // Your exact FileSystem pattern
                  const fileName = `screenshot_${Date.now()}.jpg`;
                  const dest = (FileSystem.documentDirectory ?? "") + fileName;

                  // Copy screenshot to your destination
                  await FileSystem.copyAsync({ from: imgUri, to: dest });
                  outfitRepo.updateOutfitImgUrl(currentOutfit.id, dest);
                  outfitRepo.updateOutfitUpdateImgUrl(currentOutfit.id, true);
                }

                dispatch(clearAllItems());
                dispatch(clearCurrentOutfit());
                router.navigate("/pages");
              }
            } else {
              if (saved) {
                saveOutfit();
              }
              dispatch(clearAllItems());
              dispatch(clearCurrentOutfit());
              router.navigate("/pages");
            }
          }}
        >
          <Icon name="arrow-back-ios" type="material" size={24}></Icon>
        </AppButton>

        <TextInput
          onChangeText={setOutfitName}
          value={outfitName}
          placeholderTextColor="black"
          style={styles.name}
        />

        {saveButton()}
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
        {/* Only render Movable after parent size is known */}
        {parentSize.width > 0 &&
          parentSize.height > 0 &&
          outfit.map((item) => (
            <Movable
              key={item.id}
              parentW={parentSize.width}
              parentH={parentSize.height}
              initialX={Math.random() * (parentSize.width - BASE_SIZE)}
              initialY={Math.random() * (parentSize.height - BASE_SIZE)}
            >
              <Image
                source={{ uri: item.imgUrl ?? "" }}
                contentFit="contain"
                style={{ width: "100%", height: "100%", borderRadius: 8 }}
              />
              <AppText>{item.name}</AppText>
            </Movable>
          ))}
      </View>
      {/* <Snackbar
        visibility={snackbarVisiblity}
        setVisibility={setSnackbarVisiblity}
        type="success"
        hidePosition={-700}
        showPosition={-100}
      >
        Outfit saved!
      </Snackbar> */}
      <View style={styles.footerContainer}>
        <View style={styles.navButtonContainer}>
          <Pressable
            onPress={() => {
              router.navigate("/outfit/add-item");
            }}
            style={styles.navButton}
          >
            <Icon name="shirt-outline" type="ionicon" size={35}></Icon>
          </Pressable>
          <AppText type="p3SemiBold">Add Item</AppText>
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
          <AppText type="p3SemiBold">Create Outfit</AppText>
        </View>
      </View>
      <Snackbar
        visibility={snackbarVisiblity}
        setVisibility={setSnackbarVisiblity}
        type="success"
      >
        Outfit saved!
      </Snackbar>

      <AppModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <AppText>Do you want to save your edits</AppText>
        <AppButton
          fullWidth={true}
          onPress={async () => {
            updateOutfit();
            setSnackbarVisiblity(!snackbarVisiblity);
            setModalVisible(!modalVisible);
            setTimeout(() => setSnackbarVisiblity(false), 3000);
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
            router.navigate("/pages");
          }}
        >
          <AppText style={{ color: "white" }}>Yes</AppText>
        </AppButton>
        <AppButton
          fullWidth={true}
          onPress={() => {
            setDeleteModalVisible(!deleteModalVisible);
          }}
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
