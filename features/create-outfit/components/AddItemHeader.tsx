import AppButton from "@/components/ui/AppButton";
import { AppIcon } from "@/components/ui/AppIcon";
import { OutfitPositions } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useTheme } from "@/hooks/ThemeProvider";
import {
  clearAllItems,
  getItemsPositions,
  selectOutfit,
  setOutfitItems,
} from "@/redux/slices/outfitSlice";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const AddItemHeader = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectOutfit);
  const positions = useAppSelector(getItemsPositions);
  const [oldItems, setOldItems] = useState<number[]>([]);
  const [oldPosition, setOldPosition] = useState<OutfitPositions>({});
  useEffect(() => {
    setOldItems(items);
    setOldPosition(positions);
  }, []);
  useEffect;
  return (
    <View style={styles.container}>
      <AppButton
        onPress={() => {
          dispatch(clearAllItems());
          dispatch(setOutfitItems({ items: oldItems, positions: oldPosition }));
          router.back();
        }}
        type="icon"
        icon={<AppIcon name={"arrowLeft"} size={24}></AppIcon>}
      ></AppButton>

      <AppButton
        onPress={() => {
          if (items != oldItems) {
            dispatch(clearAllItems());
            dispatch(
              setOutfitItems({ items: oldItems, positions: oldPosition }),
            );
          }
        }}
        type="text"
        textColor={theme.danger}
        label="Reset"
      ></AppButton>
    </View>
  );
};

export default AddItemHeader;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
