import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions } from "react-native";

const ItemPreview: React.FC<{
  imgUri: string;
  name: string;
  size: string;
}> = (props) => {
  const { width } = useWindowDimensions();
  return (
    <Pressable
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
      <Text>{props.name}</Text>
      <Text>{props.size}</Text>
    </Pressable>
  );
};

export default ItemPreview;

const styles = StyleSheet.create({
  container: { gap: 5 },
  img: {
    aspectRatio: 4 / 5,
    width: "100%",
    backgroundColor: "grey",
    borderRadius: 10,
  },
});
