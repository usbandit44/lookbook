import Skeleton from "@/components/ui/Skeleton";
import { normalizeImageUri } from "@/functions/imageHandling";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
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
import { CheckBox, Icon } from "react-native-elements";

const SelectableItem: React.FC<{
  id: number;
  imgUri: string;
  name: string;
  size: string;
}> = (props) => {
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
      <Image
        source={{ uri: imageUri }}
        contentFit="contain"
        style={styles.img}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={styles.container}>
          {/* <Text>{props.name}</Text>
          <Text>{props.size}</Text> */}
        </View>
        <CheckBox
          checked={selected}
          checkedIcon={<Icon name="check-box" type="material" size={24}></Icon>}
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
        />
      </View>
      <Skeleton width={"100%"} height={"100%"} showing={isLoading} />
    </Pressable>
  );
};
export default SelectableItem;

const styles = StyleSheet.create({
  container: { gap: 0 },
  img: {
    aspectRatio: 4 / 5,
    width: "100%",
    borderRadius: 10,
  },
});
