import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

const ItemPreview: React.FC<{
  imgUri: string;
}> = (props) => {
  const { width } = useWindowDimensions();
  return (
    <View style={{ ...styles.container, width: width * 0.4 }}>
      <Image
        source={{ uri: props.imgUri }}
        contentFit="contain"
        style={{ aspectRatio: 1 }}
      />
      <Text>ItemPreview</Text>
    </View>
  );
};

export default ItemPreview;

const styles = StyleSheet.create({
  container: {},
});
