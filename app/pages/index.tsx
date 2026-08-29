import ItemPreview from "@/components/ItemPreview";
import AppButton from "@/components/ui/AppButton";
import { AppIcon } from "@/components/ui/AppIcon";
import AppText from "@/components/ui/AppText";
import Searchbar from "@/components/ui/SearchBar";
import { itemTypesArray } from "@/constants/constants";
import { items } from "@/db/schemas/items";
import { useScrollToTopListener } from "@/features/navigation/hooks/scrollEvents";
import { normalizeSearchTerm } from "@/functions/normalizeSearchTerm";
import { scheduleNotification } from "@/functions/notifications";
import { useDrizzle } from "@/hooks/DrizzleContext";
import { useTheme } from "@/hooks/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as Notifications from "expo-notifications";
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

const Home = () => {
  const { theme } = useTheme();

  const notifications = [
    {
      weekday: 2,
      hour: 8,
      minute: 0,
      title: "Start Your Week Right!",
      body: "Kick off your week strong! Open the app to plan your outfit.",
    },
    {
      weekday: 6,
      hour: 20,
      minute: 0,
      title: "Friday Night! 🎉",
      body: "Friday night’s here! Make sure you outfit is as good as your plans.",
    },
    {
      weekday: 7,
      hour: 9,
      minute: 0,
      title: "Weekend Vibes 🌴",
      body: "Your weekend starts now! Check Lookbook for outfit ideas.",
    },
  ];

  useEffect(() => {
    async function initNotifications() {
      const alreadyScheduled = await AsyncStorage.getItem(
        "notifications_scheduled",
      );
      if (alreadyScheduled) return;

      notifications.forEach((n) => {
        scheduleNotification(n.title, n.body, {
          type: "weekly",
          weekday: n.weekday,
          hour: n.hour,
          minute: n.minute,
          repeats: true,
        } as Notifications.WeeklyTriggerInput);
      });

      await AsyncStorage.setItem("notifications_scheduled", "true");
    }

    initNotifications();
  }, []);

  const drizzleDb = useDrizzle();

  const { data: liveItems } = useLiveQuery(drizzleDb.select().from(items));

  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");

  const flatListRef = useRef<FlatList<any>>(null);

  useScrollToTopListener("items", () => {
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
  const isFirstRender = useRef(true);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredData = useMemo(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return liveItems.length % 2 === 1
        ? [
            ...liveItems,
            { id: -1, name: "", type: "", color: null, imgUrl: "" },
          ]
        : liveItems;
    }

    const tagFilters = debouncedSearch.split(" ").filter((t) => t !== "");

    let filtered = liveItems;
    if (filter != "All") {
      if (filter == "Favorites") {
        filtered = filtered.filter((item) => item.favorited == true);
      } else {
        filtered = filtered.filter((item) => item.tags.includes(filter));
      }
    }

    if (tagFilters.length > 0) {
      filtered = liveItems.filter((item) => {
        return tagFilters.every((tag) => {
          const normalized = normalizeSearchTerm(tag) ?? tag;
          const fuse = new Fuse(item.tags, { threshold: 0.2 });
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

    return formattedData;
  }, [debouncedSearch, liveItems, filter]);

  return (
    <View style={styles.container}>
      {showSearch ? (
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <Searchbar
            value={search}
            onChangeText={setSearch}
            placeholder="Search by tag, color, type"
          ></Searchbar>
          <ScrollView
            bounces={true}
            horizontal={true}
            style={{ width: "100%", gap: 50 }}
            contentContainerStyle={{ gap: 8 }}
            showsHorizontalScrollIndicator={false}
          >
            {["All", "Favorites", ...itemTypesArray].map((filt, index) => {
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
        style={styles.list}
        contentContainerStyle={styles.listContent}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={21}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ref={flatListRef}
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ItemPreview
            imgUri={item.imgUrl ?? ""}
            name={""}
            color={item.color}
            itemType={item.type}
            type="item"
            id={item.id}
            favourite={item.favorited}
          />
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 90,
  },
  header: {
    // paddingHorizontal: 15,
    paddingTop: 15,
    alignSelf: "flex-start",
    width: "100%",
    gap: 15,
  },
  row: {
    justifyContent: "space-between",
    // paddingHorizontal: 15,
    paddingTop: 15,
  },
  scrollTopBtn: {
    position: "absolute",
    bottom: 20,
    alignSelf: "flex-end",
    paddingRight: 15,
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
});
