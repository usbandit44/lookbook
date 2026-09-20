import { AppIcon } from "@/components/ui/AppIcon";
import AppText from "@/components/ui/AppText";
import Skeleton from "@/components/ui/Skeleton";
import Swatch from "@/components/ui/Swatch";
import { Theme } from "@/constants/themes";
import { normalizeImageUri } from "@/functions/imageHandling";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useTheme } from "@/hooks/ThemeProvider";
import {
  addNewItem,
  itemInOutfit,
  removeItem,
  removeItemPosition,
  setItemPosition,
} from "@/redux/slices/outfitSlice";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";

const SelectableItem: React.FC<{
  id: number;
  imgUri: string;
  type: string;
  color: string;
}> = (props) => {
  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);
  const { width } = useWindowDimensions();

  const included = useAppSelector(itemInOutfit(props.id));
  const [selected, setSelected] = useState(included);
  const imageUri = normalizeImageUri(props.imgUri);

  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setSelected(included);
  }, [included]);
  const dispatch = useAppDispatch();
  if (props.id < 0) {
    return null;
  }
  return (
    <Pressable
      onPress={() => {
        if (selected) {
          dispatch(removeItem(props.id));
          dispatch(removeItemPosition({ id: props.id }));
        } else {
          dispatch(addNewItem(props.id));
          dispatch(
            setItemPosition({
              id: props.id,
              position: { x: 0, y: 0, scale: 1 },
            }),
          );
        }
        setSelected(!selected);
      }}
      style={{
        ...styles.container,
        width: width * 0.45,
      }}
    >
      <View>
        {selected ? (
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              margin: 5,
              padding: 5,
              borderRadius: 25,
              backgroundColor: theme.ink,
              zIndex: 100,
            }}
          >
            <AppIcon name={"check"} color={theme.onInk} size={15}></AppIcon>
          </View>
        ) : null}
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "100%",
            height: "100%",
            backgroundColor: theme.surfaceSunken,
            borderWidth: selected ? 1 : 0.5,
            borderColor: selected ? theme.ink : theme.inkA[9],
          }}
        ></View>
        <Image
          source={{ uri: imageUri }}
          contentFit="contain"
          cachePolicy="memory-disk"
          style={styles.img}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />
      </View>
      <View style={styles.caption}>
        {props.color ? (
          <Swatch color={props.color} width={12} height={12}></Swatch>
        ) : null}

        <AppText type="m10" text={props.color + " / " + props.type}></AppText>
      </View>
      <Skeleton width={"100%"} height={"100%"} showing={isLoading} />
    </Pressable>
  );
};
export default SelectableItem;

const s = (t: Theme) =>
  StyleSheet.create({
    container: { gap: 0 },
    img: {
      aspectRatio: 4 / 5,
      width: "100%",
      borderRadius: 10,
    },
    caption: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 7,
    },
  });
