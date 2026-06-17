import { normalizeImageUri } from "@/functions/normalizeImageUri";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { addItem, setCurrentItemId } from "@/redux/slices/itemSlice";
import { setCurrentOutfit, setItems } from "@/redux/slices/outfitSlice";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import AppOutfitRepo from "@/repo/outfit_repo/AppOutfitRepo";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";

const ItemPreview: React.FC<{
  imgUri: string;
  name: string;
  color: string;
  id: number;
  type: "outfit" | "item";
}> = (props) => {
  const { width, height } = useWindowDimensions();

  const itemWidth = width * 0.45;
  const itemHeight = props.type === "outfit" ? height * 0.35 : itemWidth * 1.2;

  const dispatch = useAppDispatch();
  const outfitRepo = new AppOutfitRepo();
  const itemRepo = new AppItemRepo();
  const imageUri = normalizeImageUri(props.imgUri);

  return (
    <Pressable
      style={[styles.container, { width: itemWidth }]}
      onPress={async () => {
        if (props.id == -1) return;
        if (props.type == "outfit") {
          const outfit = await outfitRepo.getOutfit(props.id);
          dispatch(setCurrentOutfit({ id: outfit.id, name: outfit.name }));
          dispatch(setItems(outfit.items));
          router.navigate("/outfit/create-outfit");
        }
        if (props.type == "item") {
          const queriedItem = await itemRepo.getItem(props.id);

          dispatch(setCurrentItemId(props.id));
          dispatch(
            addItem({
              name: queriedItem.name,
              type: queriedItem.type,
              color: queriedItem.color ?? "",
              tags: queriedItem.tags,
              imgUrl: queriedItem.imgUrl,
              backgroundRemoved: queriedItem.backgroundRemoved,
            }),
          );

          router.navigate("/add-item");
        }
      }}
    >
      <Image
        source={{ uri: imageUri }}
        contentFit={props.type == "outfit" ? "cover" : "contain"}
        style={[styles.img, { height: itemHeight }]}
      />
    </Pressable>
  );
};

export default ItemPreview;

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  img: {
    width: "100%",
    borderRadius: 10,
  },
});
