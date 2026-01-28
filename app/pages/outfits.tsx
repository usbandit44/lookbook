import ItemPreview from "@/components/ItemPreview";
import { outfits } from "@/db/schemas/outfits";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const OutfitsPage = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  //const [itemsData, setItemsData] = useState<ItemsType[]>([]);

  const { data: itemsData } = useLiveQuery(drizzleDb.select().from(outfits));

  // setItemsData(data);
  useEffect(() => {
    // const fetchItems = async () => {
    //   await drizzleDb.delete(outfits);
    // };
    // fetchItems();
    console.log(itemsData);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={itemsData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.itemsGrid}
        renderItem={({ item }) => (
          // <View>
          //   <Image
          //     source={{ uri: item.imgUrl ?? undefined }}
          //     contentFit="contain"
          //     style={{ width: 500, aspectRatio: 1 }}
          //   />
          // </View>
          <ItemPreview
            id={item.id}
            imgUri={item.imgUrl ?? ""}
            name={item.name ?? ""}
            size={""}
            type={"outfit"}
          />
        )}
      />
    </View>
  );
};

export default OutfitsPage;

const styles = StyleSheet.create({
  itemsGrid: {
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
  },
});
