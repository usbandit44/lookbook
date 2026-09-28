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
import { useRouter } from "expo-router";
import Fuse from "fuse.js";
import { usePostHog } from "posthog-react-native";
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

  const posthog = usePostHog();

  // Only counts are sent — never the raw search text.
  useEffect(() => {
    const termCount = debouncedSearch.split(" ").filter((t) => t !== "").length;
    if (termCount === 0) return;
    posthog.capture("search_performed", {
      surface: "outfits",
      term_count: termCount,
      result_count: filteredData.filter((item) => item.id !== -1).length,
    });
  }, [debouncedSearch]);

  // const formattedData =
  //   itemsData.length % 2 === 1
  //     ? [...itemsData, { id: -1, empty: true }]
  //     : itemsData;

  const router = useRouter();
  const filterScrollRef = useRef<ScrollView>(null);
  const emptyState = () => {
    if (itemsData.length > 0) {
      return (
        <View style={{ flex: 1, alignItems: "center" }}>
          <View
            style={{
              paddingTop: 80,
              alignItems: "center",
              maxWidth: 280,
              gap: 15,
            }}
          >
            <AppIcon
              name={"search"}
              size={44}
              strokeWidth={0.8}
              color={theme.inkA[40]}
            ></AppIcon>
            <AppText text={"No Matches"} type={"m1"}></AppText>
            <AppText
              text={
                "None of your outfits fit that filter. Try something different."
              }
              type={"p5"}
              style={{ textAlign: "center" }}
            ></AppText>
            <AppButton
              label="Clear Filters"
              type="primary"
              style={{ flex: 0, alignSelf: "center" }}
              onPress={() => {
                setFilter("All");
                setSearch("");
                filterScrollRef.current?.scrollTo({ x: 0, animated: true });
              }}
            ></AppButton>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, alignItems: "center" }}>
          <View
            style={{
              paddingTop: 80,
              alignItems: "center",
              maxWidth: 280,
              gap: 15,
            }}
          >
            <AppIcon
              name={"createOutfit"}
              size={44}
              strokeWidth={0.8}
              color={theme.inkA[40]}
            ></AppIcon>
            <AppText text={"No Outfits Yet"} type={"m1"}></AppText>
            <AppText
              text={
                "Combine pieces from your wardrobe into a look, or generate one from a preset."
              }
              type={"p5"}
              style={{ textAlign: "center" }}
            ></AppText>
            <AppButton
              label="Create First Outfit"
              type="primary"
              style={{ flex: 0, alignSelf: "center" }}
              onPress={() => {
                router.navigate("/presets");
              }}
            ></AppButton>
          </View>
        </View>
      );
    }
  };
  return (
    <View style={{ flex: 1, paddingHorizontal: 15 }}>
      {showSearch ? (
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search by outfit name"
          ></SearchBar>
          <ScrollView
            ref={filterScrollRef}
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
                      posthog.capture("filter_selected", {
                        surface: "outfits",
                        filter: filt,
                      });
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
      {filteredData.length > 0 ? (
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
          showsVerticalScrollIndicator={false}
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
      ) : (
        emptyState()
      )}
    </View>
  );
};

export default OutfitsPage;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
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
