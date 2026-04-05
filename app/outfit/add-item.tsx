import AppButton from "@/components/ui/AppButton";
import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import { Colors, itemColors, itemTypesArray } from "@/constants/constants";
import { items } from "@/db/schemas/items";
import AddItemHeader from "@/features/create-outfit/components/AddItemHeader";
import SelectableItem from "@/features/create-outfit/components/SelectableItem";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
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

const AddItem = () => {
  const router = useRouter();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  //const [itemsData, setItemsData] = useState<ItemsType[]>([]);

  const { data: itemsData } = useLiveQuery(drizzleDb.select().from(items));
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [colorFilter, setColorFilter] = useState<string[]>([]);
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

  const [showColorPage, setShowColorPage] = useState(false);

  const toggleType = (type: string) => {
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleColor = (color: string) => {
    setColorFilter((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  useEffect(() => {
    let filtered = itemsData.filter((item) => {
      const typeMatch =
        typeFilter.length === 0 || typeFilter.includes(item.type);

      const colorMatch =
        colorFilter.length === 0 || colorFilter.includes(item.color ?? "");

      return typeMatch && colorMatch;
    });

    const formattedData =
      filtered.length % 2 === 1
        ? [...filtered, { id: -1, name: "", type: "", color: null, imgUrl: "" }]
        : filtered;

    setFilteredData(formattedData);
  }, [applyFilter, itemsData]);

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
          <View
            style={{ paddingTop: 15, paddingLeft: 15, alignSelf: "flex-start" }}
          >
            <AppButton onPress={() => setModalVisible(true)}>
              <Icon
                name="filter-menu-outline"
                type="material-community"
                color="white"
                size={20}
              />
              <AppText style={{ color: "white" }}>Filter</AppText>
            </AppButton>
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
          // style={{
          //   position: "absolute",
          //   bottom: 20,
          //   alignSelf: "center",
          // }}
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
      <AppModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        style={{ height: 500 }}
      >
        {!showColorPage ? (
          <>
            <AppText>Filter</AppText>

            <ScrollView style={{ flex: 1 }}>
              {itemTypesArray.map((type) => {
                const selected = typeFilter.includes(type);

                return (
                  <Pressable
                    key={type}
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => toggleType(type)}
                  >
                    <AppText>{type}</AppText>

                    <CheckBox
                      checked={selected}
                      onPress={() => toggleType(type)}
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
                setTypeFilter([]);
                setColorFilter([]);
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
                const selected = colorFilter.includes(color);

                return (
                  <Pressable
                    key={color}
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => toggleColor(color)}
                  >
                    <AppText>{color}</AppText>

                    <CheckBox
                      checked={selected}
                      onPress={() => toggleColor(color)}
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
});
