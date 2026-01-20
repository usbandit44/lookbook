import { ItemsType } from "@/db/schemas/items";
import {
  clearAllItems,
  selectCurrentOutfitId,
  selectOutfit,
} from "@/features/create-outfit/redux/slices/outfitSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
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

  const [visablity, setVisablity] = useState(false);
  const [savedOutfitId, setSavedOutfitId] = useState<number>(-1);

  useEffect(() => {
    async function getItemCount() {
      const count = await outfitRepo.countNumberOfOutfit();
      setOutfitName("Outfit #" + (Number(count) + 1));
    }
    getItemCount();
  }, [visablity]);

  const saveOutfit = async () => {
    const idArray = items.map((id) => id.toString());

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
      items: idArray,
      name: outfitName,
      imgUrl: dest,
    });
    //dispatch(setCurrentOutfit(createdOutfitId));
    setSavedOutfitId(createdOutfitId);
  };

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
        <Pressable
          onPress={() => {
            if (saved) {
              saveOutfit();
            }
            dispatch(clearAllItems());
            router.navigate("/pages");
          }}
        >
          <Icon name="arrow-back-ios" type="material" size={24}></Icon>
        </Pressable>
        <TextInput
          onChangeText={setOutfitName}
          value={outfitName}
          placeholderTextColor="black"
          style={styles.name}
        />
        <Pressable
          onPress={() => {
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
        >
          {saved ? (
            <Icon name="bookmark" type="material" size={30}></Icon>
          ) : (
            <Icon name="bookmark-border" type="material" size={30}></Icon>
          )}
        </Pressable>
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
            </Movable>
          ))}
      </View>
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
  },
});
