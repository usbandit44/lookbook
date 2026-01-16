import AddItemForm from "@/features/add-item/components/AddItemForm";
import { useAppSelector } from "@/hooks/redux-hooks";
import { selectNewItemImg } from "@/redux/slices/cameraSlice";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const AddItemPage = () => {
  const [selectedItem, setSelectedItem] = React.useState("");

  const router = useRouter();
  const imgUri = useAppSelector(selectNewItemImg);

  return <AddItemForm />;
};

export default AddItemPage;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  iosHeader: { height: 60, backgroundColor: "rgba(0, 0, 0, 0)" },
});
