import ItemPreview from "@/components/ItemPreview";
import AppButton from "@/components/ui/AppButton";
import { outfits } from "@/db/schemas/outfits";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";

const OutfitsPage = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  //const [itemsData, setItemsData] = useState<ItemsType[]>([]);

  const { data: itemsData } = useLiveQuery(drizzleDb.select().from(outfits));

  const [showScroolButton, setShowScrollButton] = useState(false);
  const scrollButtonOpacity = useRef(new Animated.Value(0)).current;

  const flatListRef = useRef<FlatList<any>>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      const topRowsVisible = viewableItems.some(
        (vi) => vi.index !== null && vi.index < 4, // 2 rows × 2 columns
      );

      setShowScrollButton(!topRowsVisible);
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  useEffect(() => {
    Animated.timing(scrollButtonOpacity, {
      toValue: showScroolButton ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [showScroolButton]);

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };

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
      <Animated.View
        style={{
          opacity: scrollButtonOpacity,
          position: "absolute",
          bottom: 20,
          alignSelf: "flex-end",
          paddingRight: 15,
        }}
        pointerEvents={showScroolButton ? "auto" : "none"}
      >
        <AppButton
          onPress={scrollToTop}
          style={{
            borderRadius: 100,
            aspectRatio: 1,
            padding: 10,
            backgroundColor: "black",
          }}
          type={"custom"}
        >
          <Icon
            name="keyboard-arrow-up"
            type="material"
            size={24}
            color={"white"}
          />
        </AppButton>
      </Animated.View>
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
