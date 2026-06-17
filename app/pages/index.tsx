import ItemPreview from "@/components/ItemPreview";
import AppButton from "@/components/ui/AppButton";
import Searchbar from "@/components/ui/SearchBar";
import { items } from "@/db/schemas/items";
import { normalizeSearchTerm } from "@/functions/normalizeSearchTerm";
import { scheduleNotification } from "@/functions/notifications";
import { useDrizzle } from "@/hooks/DrizzleContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as Notifications from "expo-notifications";
import Fuse from "fuse.js";
import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";

const Home = () => {
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
  const [itemsData, setItemsData] = useState<
    {
      id: number;
      name: string;
      type: string;
      color: string | null;
      tags: string[];
      imgUrl: string;
    }[]
  >([]);

  useEffect(() => {
    if (liveItems && JSON.stringify(liveItems) !== JSON.stringify(itemsData)) {
      setItemsData(liveItems);
    }
  }, [liveItems]);

  const [search, setSearch] = useState<string>("");

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

  const [showScroolButton, setShowScrollButton] = useState(false);

  const scrollButtonOpacity = useRef(new Animated.Value(0)).current;

  const flatListRef = useRef<FlatList<any>>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      const topRowsVisible = viewableItems.some(
        (vi) => vi.index !== null && vi.index < 4,
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

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ref={flatListRef}
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* <AppButton onPress={() => setModalVisible(true)}>
              <Icon
                name="filter-menu-outline"
                type="material-community"
                color="white"
                size={20}
              />
              <AppText style={{ color: "white", letterSpacing: 1 }}>
                Filter
              </AppText>
            </AppButton> */}
            <Searchbar
              value={search}
              onChangeText={setSearch}
              placeholder="Search your clothes"
            ></Searchbar>
          </View>
        }
        renderItem={({ item }) => (
          <ItemPreview
            imgUri={item.imgUrl ?? ""}
            name={""}
            color={""}
            type="item"
            id={item.id}
          />
        )}
      />

      <Animated.View
        style={[styles.scrollTopBtn, { opacity: scrollButtonOpacity }]}
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

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 10,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignSelf: "flex-start",
    width: "100%",
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 15,
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
