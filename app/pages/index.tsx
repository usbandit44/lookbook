import ItemPreview from "@/components/ItemPreview";
import AppButton from "@/components/ui/AppButton";
import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import { Colors, itemColors } from "@/constants/constants";
import { items } from "@/db/schemas/items";
import { scheduleNotification } from "@/functions/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as Notifications from "expo-notifications";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { CheckBox, Icon } from "react-native-elements";

const FILTER_OPTIONS = [
  "Tops",
  "Bottoms",
  "Outerwear",
  "Shoes",
  "Belt",
  "Headwear",
  "Accessories",
];

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

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const { data: liveItems } = useLiveQuery(drizzleDb.select().from(items));
  const [itemsData, setItemsData] = useState<
    {
      id: number;
      name: string;
      type: string;
      color: string | null;
      imgUrl: string;
    }[]
  >([]);

  useEffect(() => {
    if (liveItems && JSON.stringify(liveItems) !== JSON.stringify(itemsData)) {
      setItemsData(liveItems);
    }
  }, [liveItems]);

  const [filterColor, setFilterColor] = useState(false);
  const [filter, setFilter] = useState<string[]>([]);
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
  const [applyFilter, setApplyFilter] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const [showScroolButton, setShowScrollButton] = useState(false);

  // page toggle
  const [showColorPage, setShowColorPage] = useState(false);
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

  const toggleFilter = (type: string) => {
    setFilter((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type],
    );
  };

  useEffect(() => {
    if (filter.length == 0) {
      const formattedData =
        itemsData.length % 2 === 1
          ? [
              ...itemsData,
              { id: -1, name: "", type: "", color: null, imgUrl: "" },
            ]
          : itemsData;
      setFilteredData(formattedData);
    } else {
      const filtered = itemsData.filter(
        (item) =>
          filter.includes(item.type) && filter.includes(item.color ?? ""),
      );
      const formattedData =
        filtered.length % 2 === 1
          ? [
              ...filtered,
              { id: -1, name: "", type: "", color: null, imgUrl: "" },
            ]
          : filtered;
      setFilteredData(formattedData);
    }
  }, [applyFilter, itemsData]);

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
            <AppButton onPress={() => setModalVisible(true)}>
              <Icon
                name="filter-menu-outline"
                type="material-community"
                color="white"
                size={20}
              />
              <AppText style={{ color: "white", letterSpacing: 1 }}>
                Filter
              </AppText>
            </AppButton>
          </View>
        }
        renderItem={({ item }) => (
          <ItemPreview
            imgUri={item.imgUrl ?? ""}
            name={item.name ?? ""}
            color={item.color ?? ""}
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

      <AppModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        style={{ height: 500 }}
      >
        {!showColorPage ? (
          <>
            <AppText>Filter</AppText>

            <ScrollView style={{ flex: 1 }}>
              {FILTER_OPTIONS.map((type) => {
                const selected = filter.includes(type);

                return (
                  <Pressable
                    key={type}
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => toggleFilter(type)}
                  >
                    <AppText>{type}</AppText>

                    <CheckBox
                      checked={selected}
                      onPress={() => toggleFilter(type)}
                      checkedIcon={
                        <Icon name="check-box" type="material" size={24} />
                      }
                      uncheckedIcon={
                        <Icon
                          name="check-box-outline-blank"
                          type="material"
                          size={24}
                        />
                      }
                      containerStyle={styles.checkboxContainer}
                    />
                  </Pressable>
                );
              })}

              {/* 👉 Navigate to Color Page */}
              <Pressable
                style={[
                  styles.option,
                  { paddingVertical: 12, paddingRight: 20 },
                ]}
                onPress={() => setShowColorPage(true)}
              >
                <AppText>Colors</AppText>
                <Icon name="arrow-forward-ios" type="material" size={20} />
              </Pressable>
            </ScrollView>

            {/* Apply */}
            <AppButton
              onPress={() => {
                setApplyFilter((prev) => prev + 1);
                setModalVisible(false);
              }}
            >
              <AppText style={{ color: "white" }}>Apply</AppText>
            </AppButton>

            {/* Reset */}
            <AppButton
              onPress={() => {
                setFilter([]);
                setApplyFilter((prev) => prev + 1);
              }}
              type="text"
            >
              <AppText style={{ color: Colors.light.destructive }}>
                Reset
              </AppText>
            </AppButton>
          </>
        ) : (
          /* ───────── PAGE 2: COLOR FILTER ───────── */
          <>
            {/* Header */}
            <View
              style={{
                paddingLeft: 15,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Pressable
                onPress={() => setShowColorPage(false)}
                hitSlop={10}
                style={{ position: "absolute", left: 0, top: 0 }}
              >
                <Icon name="arrow-back-ios" type="material" size={20} />
              </Pressable>
              <AppText>Colors</AppText>
              <View style={{ width: 20 }} />
            </View>

            <ScrollView style={{ flex: 1 }}>
              {itemColors.map((color) => {
                const selected = filter.includes(color);

                return (
                  <Pressable
                    key={color}
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => toggleFilter(color)}
                  >
                    <AppText>{color}</AppText>

                    <CheckBox
                      checked={selected}
                      onPress={() => toggleFilter(color)}
                      checkedIcon={
                        <Icon name="check-box" type="material" size={24} />
                      }
                      uncheckedIcon={
                        <Icon
                          name="check-box-outline-blank"
                          type="material"
                          size={24}
                        />
                      }
                      containerStyle={styles.checkboxContainer}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          </>
        )}
      </AppModal>
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
    paddingTop: 15,
    paddingLeft: 15,
    alignSelf: "flex-start",
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
