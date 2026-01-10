import { items } from "@/db/schemas/items";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Image } from "expo-image";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  //const [itemsData, setItemsData] = useState<ItemsType[]>([]);

  const { data: itemsData } = useLiveQuery(drizzleDb.select().from(items));

  // setItemsData(data);
  // useEffect(() => {
  //   const fetchItems = async () => {
  //     const { data } = useLiveQuery(drizzleDb.select().from(items));

  //     setItemsData(data);
  //   };
  //   fetchItems();
  // }, []);

  const renderPicture = (imgUri: string) => {
    return (
      <View>
        <Image
          source={{ uri: imgUri }}
          contentFit="contain"
          style={{ width: 500, aspectRatio: 1 }}
        />
      </View>
      <SafeAreaView>
        <Text>home</Text>
      </SafeAreaView>
    );
  };

  return (
    <View>
      <Text>home</Text>
      <FlatList
        data={itemsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: item.imgUrl ?? undefined }}
              contentFit="contain"
              style={{ width: 500, aspectRatio: 1 }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
