import AddItemForm from "@/features/add-item/screen/AddItemForm";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const AddItemPage = () => {
  const [selectedItem, setSelectedItem] = React.useState("");

  const router = useRouter();
  // const imgUri = useAppSelector(selectNewItemImg);

  return <AddItemForm />;
};

export default AddItemPage;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
