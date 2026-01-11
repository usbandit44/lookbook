import { Colors } from "@/constants/constants";
import { items } from "@/db/schemas/items";
import ItemPreview from "@/features/items-page/components/ItemPreview";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Image } from "expo-image";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const Home = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  //const [itemsData, setItemsData] = useState<ItemsType[]>([]);

  const { data: itemsData } = useLiveQuery(drizzleDb.select().from(items));

  // setItemsData(data);
  useEffect(() => {
    const fetchItems = async () => {
      await drizzleDb.delete(items);
    };
    fetchItems();
  }, []);

  const renderPicture = (imgUri: string) => {
    return (
      <View>
        <Image
          source={{ uri: imgUri }}
          contentFit="contain"
          style={{ width: 500, aspectRatio: 1 }}
        />
      </View>
      // <SafeAreaView>
      //   <Text>home</Text>
      // </SafeAreaView>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <Text>home</Text>
      <FlatList
        data={itemsData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          // <View>
          //   <Image
          //     source={{ uri: item.imgUrl ?? undefined }}
          //     contentFit="contain"
          //     style={{ width: 500, aspectRatio: 1 }}
          //   />
          // </View>
          <ItemPreview imgUri={item.imgUrl ?? ""} />
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
