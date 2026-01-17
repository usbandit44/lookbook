import { Colors } from "@/constants/constants";
import { items } from "@/db/schemas/items";
import AddItemHeader from "@/features/create-outfit/components/AddItemHeader";
import SelectableItem from "@/features/create-outfit/components/SelectableItem";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

const AddItem = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  //const [itemsData, setItemsData] = useState<ItemsType[]>([]);

  const { data: itemsData } = useLiveQuery(drizzleDb.select().from(items));

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <AddItemHeader />

      <FlatList
        data={itemsData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.itemsGrid}
        renderItem={({ item }) => (
          <SelectableItem
            id={item.id}
            imgUri={item.imgUrl ?? ""}
            name={item.name ?? ""}
            size={item.size ?? ""}
          />
        )}
      />
    </View>
  );
};

export default AddItem;

const styles = StyleSheet.create({
  itemsGrid: {
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
  },
});
