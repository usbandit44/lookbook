import AppButton from "@/components/ui/AppButton";
import AppText from "@/components/ui/AppText";
import Searchbar from "@/components/ui/SearchBar";
import { items } from "@/db/schemas/items";
import AddItemHeader from "@/features/create-outfit/components/AddItemHeader";
import SelectableItem from "@/features/create-outfit/components/SelectableItem";
import { normalizeSearchTerm } from "@/functions/normalizeSearchTerm";
import { useDrizzle } from "@/hooks/DrizzleContext";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import Fuse from "fuse.js";
import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";

const AddItem = () => {
  const router = useRouter();
  const drizzleDb = useDrizzle();
  //const [itemsData, setItemsData] = useState<ItemsType[]>([]);

  const { data: itemsData } = useLiveQuery(drizzleDb.select().from(items));

  const [filteredData, setFilteredData] = useState<
    | {
        id: number;
        name: string;
        type: string;
        color: string | null;
        imgUrl: string;
      }[]
    | null
  >(null);

  const [search, setSearch] = useState<string>("");

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setFilteredData(
        itemsData.length % 2 === 1
          ? [
              ...itemsData,
              { id: -1, name: "", type: "", color: null, imgUrl: "" },
            ]
          : itemsData,
      );
      return;
    }

    const timer = setTimeout(() => {
      const tagFilters = search.split(" ").filter((t) => t !== "");
      let filtered = itemsData;

      if (tagFilters.length > 0) {
        filtered = itemsData.filter((item) => {
          return tagFilters.every((tag) => {
            const normalized = normalizeSearchTerm(tag) ?? tag;
            const fuse = new Fuse(item.tags, { threshold: 0.2 });
            return fuse.search(normalized).length > 0;
          });
        });
      }

      const formattedData =
        filtered.length % 2 === 1
          ? [
              ...filtered,
              { id: -1, name: "", type: "", color: null, imgUrl: "" },
            ]
          : filtered;

      setFilteredData(formattedData);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, itemsData]);

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

  return (
    <View style={{ flex: 1 }}>
      <AddItemHeader />

      <FlatList
        initialNumToRender={6} // render first 3 rows only
        maxToRenderPerBatch={6} // render 3 more rows per batch
        windowSize={5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ref={flatListRef}
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.itemsGrid}
        ListHeaderComponent={
          <View style={styles.header}>
            <Searchbar
              value={search}
              onChangeText={setSearch}
              placeholder="Search your clothes"
            ></Searchbar>
          </View>
        }
        renderItem={({ item }) => (
          <SelectableItem
            id={item.id}
            imgUri={item.imgUrl ?? ""}
            name={item.name ?? ""}
            size={item.size ?? ""}
          />
        )}
      />
      <View style={styles.footerContainer}>
        <AppButton
          fullWidth={true}
          onPress={() => router.navigate("/outfit/create-outfit")}
        >
          <AppText style={{ color: "white" }}>Save</AppText>
        </AppButton>
      </View>

      <Animated.View
        style={{
          opacity: scrollButtonOpacity,
          position: "absolute",
          bottom: 110,
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

export default AddItem;

const styles = StyleSheet.create({
  itemsGrid: {
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 50,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 35,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 500,
    gap: 15,
  },
  filterButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  option: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderColor: "#979C9E",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  optionSelected: {
    backgroundColor: "#f2f2f2", // 👈 subtle highlight
  },

  checkboxContainer: {
    padding: 0,
    margin: 0,
  },
  footerContainer: {
    width: "100%",

    padding: 25,
    borderTopColor: "black",
    borderWidth: 0.5,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignSelf: "flex-start",
    width: "100%",
  },
});
