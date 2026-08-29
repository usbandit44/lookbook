import ItemPreview from "@/components/ItemPreview";
import AppButton from "@/components/ui/AppButton";
import { AppIcon } from "@/components/ui/AppIcon";
import AppText from "@/components/ui/AppText";
import SearchBar from "@/components/ui/SearchBar";
import { outfits } from "@/db/schemas/outfits";
import { useScrollToTopListener } from "@/features/navigation/hooks/scrollEvents";
import { normalizeSearchTerm } from "@/functions/normalizeSearchTerm";
import { useDrizzle } from "@/hooks/DrizzleContext";
import { useTheme } from "@/hooks/ThemeProvider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import Fuse from "fuse.js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const OutfitsPage = () => {
  const drizzleDb = useDrizzle();
  //const [itemsData, setItemsData] = useState<ItemsType[]>([]);

  const { data: itemsData } = useLiveQuery(drizzleDb.select().from(outfits));

  const { theme } = useTheme();

  const flatListRef = useRef<FlatList<any>>(null);

  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");

  useScrollToTopListener("outfits", () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  });

  const [showSearch, setShowSearch] = useState(true);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      const topRowsVisible = viewableItems.some(
        (vi) => vi.index !== null && vi.index < 1,
      );
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowSearch(topRowsVisible);
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // const scrollToTop = () => {
  //   if (flatListRef.current) {
  //     flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  //   }
  // };

  // setItemsData(data);
  useEffect(() => {
    // const fetchItems = async () => {
    //   await drizzleDb.delete(outfits);
    // };
    // fetchItems();
  }, []);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredData = useMemo(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return itemsData.length % 2 === 1
        ? [
            ...itemsData,
            { id: -1, name: "", type: "", color: null, imgUrl: "" },
          ]
        : itemsData;
    }

    const tagFilters = debouncedSearch.split(" ").filter((t) => t !== "");

    let filtered = itemsData;
    if (filter != "All") {
      filtered = filtered.filter((item) => item.favorited == true);
    }

    if (tagFilters.length > 0) {
      filtered = itemsData.filter((outfit) => {
        return tagFilters.every((tag) => {
          const normalized = normalizeSearchTerm(tag) ?? tag;
          const fuse = new Fuse([outfit.name], { threshold: 0.2 });
          return fuse.search(normalized).length > 0;
        });
      });
    }

    const sorted = [...filtered].sort(
      (a, b) => Number(b.favorited) - Number(a.favorited),
    );

    const formattedData =
      sorted.length % 2 === 1
        ? [...sorted, { id: -1, name: "", type: "", color: null, imgUrl: "" }]
        : sorted;

    //setFilteredData(formattedData);
    return formattedData;
  }, [debouncedSearch, itemsData, filter]);

  // const formattedData =
  //   itemsData.length % 2 === 1
  //     ? [...itemsData, { id: -1, empty: true }]
  //     : itemsData;
  return (
    <View style={{ flex: 1 }}>
      {showSearch ? (
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search by outfit name"
          ></SearchBar>
          <ScrollView
            bounces={true}
            horizontal={true}
            style={{ width: "100%", gap: 50 }}
            contentContainerStyle={{ gap: 8 }}
            showsHorizontalScrollIndicator={false}
          >
            {["All", "Favorites"].map((filt, index) => {
              const selected = filter == filt;

              return (
                <AppButton
                  onPress={() => {
                    if (!selected) {
                      setFilter(filt);
                    }
                  }}
                  type={selected ? "primary" : "secondary"}
                  key={index}
                  style={{ flex: 0, height: "auto" }}
                  label={filt}
                ></AppButton>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <Pressable
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: theme.surfaceSunken,
              borderWidth: 1,
              borderColor: theme.inkA[12],
              height: 42,
              paddingHorizontal: 10,
            }}
            onPress={() => {
              flatListRef.current?.scrollToOffset({
                animated: true,
                offset: 0,
              });
            }}
          >
            <AppIcon name="search" />

            <AppText
              text={"Search and Filter"}
              type={"p4"}
              style={{ flex: 1, color: theme.inkA[38] }}
            />
            <AppIcon name="chevronDown" size={15} />
          </Pressable>
        </View>
      )}
      <FlatList
        initialNumToRender={6} // render first 3 rows only
        maxToRenderPerBatch={6} // render 3 more rows per batch
        windowSize={5}
        contentContainerStyle={styles.listContent}
        onViewableItemsChanged={onViewableItemsChanged} // ← missing
        viewabilityConfig={viewabilityConfig} // ← missing
        ref={flatListRef}
        data={filteredData}
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
            color={""}
            type={"outfit"}
            favourite={item.favorited}
          />
        )}
      />
    </View>
  );
};

export default OutfitsPage;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 90,
  },
  itemsGrid: {
    justifyContent: "space-between",
    paddingTop: 15,
  },
  header: {
    // paddingHorizontal: 15,
    paddingTop: 15,
    alignSelf: "flex-start",
    width: "100%",
    gap: 15,
  },
});
