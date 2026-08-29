import AppText from "@/components/ui/AppText";
import Skeleton from "@/components/ui/Skeleton";
import Swatch from "@/components/ui/Swatch";
import { OutfitPositions } from "@/constants/constants";
import { Theme } from "@/constants/themes";
import { normalizeImageUri } from "@/functions/imageHandling";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { useTheme } from "@/hooks/ThemeProvider";
import { useAppModal } from "@/hooks/useAppModal";
import { addItem, setCurrentItemId } from "@/redux/slices/itemSlice";
import {
  setCurrentOutfit,
  setItemPosition,
  setItems,
  setOutfitPosition,
} from "@/redux/slices/outfitSlice";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import AppOutfitRepo from "@/repo/outfit_repo/AppOutfitRepo";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { AppIcon } from "./ui/AppIcon";

// const ItemPreview: React.FC<{
//   imgUri: string;
//   name: string;
//   color: string;
//   id: number;
//   type: "outfit" | "item";
// }> = (props) => {
//   const { width, height } = useWindowDimensions();

//   const itemWidth = width * 0.45;
//   const itemHeight = props.type === "outfit" ? height * 0.35 : itemWidth * 1.2;

//   const dispatch = useAppDispatch();
//   const outfitRepo = new AppOutfitRepo();
//   const itemRepo = new AppItemRepo();
//   const imageUri = normalizeImageUri(props.imgUri);

//   return (
//     <Pressable
//       style={[styles.container, { width: itemWidth }]}
//       onPress={async () => {
//         if (props.id == -1) return;
//         if (props.type == "outfit") {
//           const outfit = await outfitRepo.getOutfit(props.id);
//           dispatch(setCurrentOutfit({ id: outfit.id, name: outfit.name }));
//           dispatch(setItems(outfit.items));
//           router.navigate("/outfit/create-outfit");
//         }
//         if (props.type == "item") {
//           const queriedItem = await itemRepo.getItem(props.id);

//           dispatch(setCurrentItemId(props.id));
//           dispatch(
//             addItem({
//               name: queriedItem.name,
//               type: queriedItem.type,
//               color: queriedItem.color ?? "",
//               tags: queriedItem.tags,
//               imgUrl: queriedItem.imgUrl,
//               backgroundRemoved: queriedItem.backgroundRemoved,
//             }),
//           );

//           router.navigate("/add-item");
//         }
//       }}
//     >
//       <Image
//         source={{ uri: imageUri }}
//         contentFit={props.type == "outfit" ? "cover" : "contain"}
//         style={[styles.img, { height: itemHeight }]}
//       />
//     </Pressable>
//   );
// };

const ItemPreview: React.FC<{
  imgUri: string;
  name: string;
  favourite: boolean;
  color?: string;
  itemType?: string;
  id: number;
  type: "outfit" | "item";
}> = (props) => {
  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);

  const { width, height } = useWindowDimensions();

  const itemWidth = width * 0.45;
  const itemHeight = props.type === "outfit" ? height * 0.35 : itemWidth * 1.2;

  const dispatch = useAppDispatch();
  const outfitRepo = new AppOutfitRepo();
  const itemRepo = new AppItemRepo();
  const imageUri = normalizeImageUri(props.imgUri);
  const { show, hide } = useAppModal();

  const [isPressed, setIsPressed] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  if (props.id == -1) {
    return null;
  }
  const modalContent = () =>
    props.type == "item" ? (
      <View>
        <View style={styles.modalTitleRow}>
          <AppText
            text={props.color + " / " + props.itemType}
            type={"m22"}
            style={{ fontSize: 12 }}
          ></AppText>
        </View>
        <Pressable
          style={styles.modalRow}
          onPress={() => {
            hide();
            itemRepo.updateFavorited(props.id, !props.favourite);
          }}
        >
          <AppIcon name={props.favourite ? "star" : "starOutline"}></AppIcon>
          <AppText
            text={
              props.favourite ? "Remove from Favorites" : "Add to Favorites"
            }
            type={"p3"}
            style={{ fontSize: 15 }}
          ></AppText>
        </Pressable>
        <Pressable
          style={styles.modalRow}
          onPress={() => {
            hide();
            itemRepo.deleteItem(props.id);
          }}
        >
          <AppIcon name="trash" color={theme.danger}></AppIcon>
          <AppText
            text={"Delete"}
            type={"p3"}
            style={{ fontSize: 15 }}
          ></AppText>
        </Pressable>
      </View>
    ) : (
      <View>
        <View style={styles.modalTitleRow}>
          <AppText
            text={props.name}
            type={"m22"}
            style={{ fontSize: 12 }}
          ></AppText>
        </View>
        <Pressable
          style={styles.modalRow}
          onPress={() => {
            hide();
            console.log(props.favourite);
            outfitRepo.updateOutfitFavorited(props.id, !props.favourite);
          }}
        >
          <AppIcon name={props.favourite ? "star" : "starOutline"}></AppIcon>
          <AppText
            text={
              props.favourite ? "Remove from Favorites" : "Add to Favorites"
            }
            type={"p3"}
            style={{ fontSize: 15 }}
          ></AppText>
        </Pressable>
        <Pressable
          style={styles.modalRow}
          onPress={() => {
            hide();
            outfitRepo.deleteOutfit(props.id);
          }}
        >
          <AppIcon name="trash" color={theme.danger}></AppIcon>
          <AppText
            text={"Delete"}
            type={"p3"}
            style={{ fontSize: 15 }}
          ></AppText>
        </Pressable>
      </View>
    );
  return (
    <Pressable
      style={[
        styles.container,
        {
          width: itemWidth,
        },
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onLongPress={() => {
        setIsPressed(false);
        show(modalContent());
      }}
      onPress={async () => {
        if (props.id == -1) return;
        if (props.type == "outfit") {
          const outfit = await outfitRepo.getOutfit(props.id);

          if (Object.keys(outfit.positions).length === 0) {
            const positions: OutfitPositions = {};
            outfit.items.forEach((item) => {
              positions[item] = { x: 0, y: 0, scale: 1 };
              dispatch(
                setItemPosition({
                  id: item,
                  position: { x: 0, y: 0, scale: 1 },
                }),
              );
            });
            outfitRepo.updatePositions(outfit.id, positions);
          } else {
            console.log(outfit.positions);
            dispatch(setOutfitPosition({ positions: outfit.positions }));
          }
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
              favorited: queriedItem.favorited ?? false,
              imgUrl: queriedItem.imgUrl,
              backgroundRemoved: queriedItem.backgroundRemoved,
            }),
          );
          router.navigate("/add-item");
        }
      }}
    >
      {({ pressed }) => (
        <>
          <Skeleton width={itemWidth} height={itemHeight} showing={isLoading} />
          <View
            style={{
              backgroundColor: theme.surfaceSunken,
              borderWidth: 0.5,
              borderColor: theme.inkA[9],
            }}
          >
            {props.favourite ? (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  margin: 5,
                  padding: 5,
                  borderRadius: 25,
                  backgroundColor: theme.surface,
                  zIndex: 100,
                }}
              >
                <AppIcon name={"star"} size={15}></AppIcon>
              </View>
            ) : null}

            <Image
              source={{ uri: imageUri }}
              contentFit={props.type == "outfit" ? "cover" : "contain"}
              style={[styles.img, { height: itemHeight }]}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
            {isPressed && (
              <View style={styles.pressOverlay} pointerEvents="none" />
            )}
          </View>

          <View style={styles.caption}>
            {props.color ? (
              <Swatch color={props.color} width={12} height={12}></Swatch>
            ) : null}

            {props.type == "item" ? (
              <AppText
                type="m10"
                text={props.color + " / " + props.itemType}
              ></AppText>
            ) : (
              <AppText type="m10" text={props.name}></AppText>
            )}
          </View>
        </>
      )}
    </Pressable>
  );
};

const s = (t: Theme) =>
  StyleSheet.create({
    container: {
      gap: 5,
    },
    img: {
      width: "100%",
    },
    skeleton: {
      borderRadius: 10,
      position: "absolute",
      // backgroundColor: "#E0E0E0",
    },
    caption: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 7,
    },
    pressOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: t.inkA[20],
    },
    modalTitleRow: {
      paddingHorizontal: 20,
      paddingTop: 15,
      paddingBottom: 13,
      borderBottomWidth: 1,
      borderBottomColor: t.inkA[10],
    },
    modalRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 13,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: t.inkA[8], // last row: borderBottomWidth 0
    },
  });

export default React.memo(ItemPreview);

// const styles = StyleSheet.create({
//   container: {
//     gap: 5,
//   },
//   img: {
//     width: "100%",
//     borderRadius: 10,
//   },
// });
