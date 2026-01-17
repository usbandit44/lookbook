import {
  addNewItem,
  itemInOutfit,
  removeItem,
} from "@/features/create-outfit/redux/slices/outfitSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
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

  React.useEffect(() => {
    setSelected(included);
  }, [included]);
  const dispatch = useAppDispatch();
  return (
    <Pressable
      onPress={() => {
        if (selected) {
          dispatch(removeItem(props.id));
        } else {
          dispatch(addNewItem(props.id));
        }
        setSelected(!selected);
      }}
      style={{
        ...styles.container,
        width: width * 0.45,
      }}
    >
      <Image
        source={{ uri: props.imgUri }}
        contentFit="cover"
        style={styles.img}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={styles.container}>
          <Text>{props.name}</Text>
          <Text>{props.size}</Text>
        </View>
        <CheckBox
          checked={selected}
          checkedIcon={<Icon name="check-box" type="material" size={24}></Icon>}
          onPress={() => {
            if (selected) {
              dispatch(removeItem(props.id));
            } else {
              dispatch(addNewItem(props.id));
            }
            setSelected(!selected);
          }}
        />
      </View>
    </Pressable>
  );
};
export default SelectableItem;

const styles = StyleSheet.create({
  container: { gap: 5 },
  img: {
    aspectRatio: 4 / 5,
    width: "100%",
    backgroundColor: "grey",
    borderRadius: 10,
  },
});
