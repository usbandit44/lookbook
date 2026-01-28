import AppText from "@/components/ui/AppText";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { setCurrentItem } from "@/redux/slices/itemSlice";
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
  size: string;
  id: number;
  type: "outfit" | "item";
}> = (props) => {
  const { width } = useWindowDimensions();

  const dispatch = useAppDispatch();
  const outfitRepo = new AppOutfitRepo();
  const itemRepo = new AppItemRepo();
  console.log("Hello" + props.imgUri);
  return (
    <Pressable
      style={{
        ...styles.container,
        width: width * 0.45,
      }}
      onPress={async () => {
        if (props.type == "outfit") {
          const outfit = await outfitRepo.getOutfit(props.id);
          dispatch(setCurrentOutfit({ id: outfit.id, name: outfit.name }));
          dispatch(setItems(outfit.items));
          router.navigate("/outfit/create-outfit");
        }
        if (props.type == "item") {
          // const item = await itemRepo.getItem(props.id);
          console.log(props.id);
          dispatch(setCurrentItem(props.id));
          router.navigate("/add-item");
        }
      }}
    >
      <Image
        source={{ uri: props.imgUri }}
        contentFit="cover"
        style={styles.img}
      />
      <AppText>{props.name}</AppText>
      <AppText>{props.size}</AppText>
    </Pressable>
  );
};

export default ItemPreview;

const styles = StyleSheet.create({
  container: { gap: 5 },
  img: {
    aspectRatio: 4 / 5,
    width: "100%",
    borderRadius: 10,
  },
});
