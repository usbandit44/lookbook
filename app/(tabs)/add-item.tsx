import { itemTypes } from "@/constants/constants";
import { selectNewItemImg } from "@/features/camera/redux/cameraSlice";
import { useAppSelector } from "@/hooks/redux-hooks";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

const AddItemPage = () => {
  const [selectedItem, setSelectedItem] = React.useState("");

  const router = useRouter();
  const imgUri = useAppSelector(selectNewItemImg);

  const itemTypesSelect = itemTypes.map((item, i) => {
    return { key: i.toString(), value: item };
  });

  const renderPicture = () => {
    return (
      <View>
        <Image
          source={{ uri: imgUri }}
          contentFit="contain"
          style={{ width: 500, aspectRatio: 1 }}
        />
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <Text>Asxs</Text>
      {imgUri == "" ? null : renderPicture()}
      <Button
        onPress={() => router.navigate("/(tabs)/playground")}
        title="Add Imag"
      ></Button>
      <SelectList
        setSelected={(val: React.SetStateAction<string>) =>
          setSelectedItem(val)
        }
        data={itemTypesSelect}
        save="value"
        search={false}
      />
    </View>
  );
};

export default AddItemPage;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#de6868ff" },
});
