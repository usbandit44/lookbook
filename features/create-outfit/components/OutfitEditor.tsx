import { ItemsType } from "@/db/schemas/items";
import { selectOutfit } from "@/features/create-outfit/redux/slices/outfitSlice";
import { useAppSelector } from "@/hooks/redux-hooks";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Movable from "./Movable";

const BASE_SIZE = 100;

const OutfitEditor: React.FC = () => {
  const repo = new AppItemRepo();
  const items = useAppSelector(selectOutfit);

  const [outfit, setOutfit] = useState<ItemsType[]>([]);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  // Fetch outfit items
  useEffect(() => {
    const fetchItems = async () => {
      const results = await Promise.all(items.map((id) => repo.getItem(id)));
      setOutfit(results);
    };
    fetchItems();
  }, [items]);

  return (
    <View
      style={styles.container}
      onLayout={(e) =>
        setParentSize({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })
      }
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
  );
};

export default OutfitEditor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
