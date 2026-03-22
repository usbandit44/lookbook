import ItemPreview from "@/components/ItemPreview";
import AppButton from "@/components/ui/AppButton";
import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/constants/constants";
import { items } from "@/db/schemas/items";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, Pressable, StyleSheet, View } from "react-native";
import { CheckBox, Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

const Home = () => {
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

  const [topSelected, setTopSelected] = useState(false);
  const [bottomSelected, setBottomSelected] = useState(false);
  const [outerwearSelected, setOuterwearSelected] = useState(false);
  const [shoesSelected, setShoesSelected] = useState(false);
  const [headwearSelected, setHeadwearSelected] = useState(false);
  const [beltSelected, setBeltSelected] = useState(false);
  const [accessoriesSelected, setAccessoriesSelected] = useState(false);
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

  useEffect(() => {
    if (filter.length == 0) {
      setFilteredData(itemsData);
    } else {
      setFilteredData(
        itemsData.filter(
          (item) =>
            filter.includes(item.type) || filter.includes(item.color ?? ""),
        ),
      );
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
        <AppText>Filter</AppText>
        <ScrollView style={{ flex: 1 }}>
          <Pressable
            style={styles.option}
            onPress={() => {
              if (topSelected) {
                setFilter(filter.filter((type) => type !== "Tops"));
              } else {
                setFilter([...filter, "Tops"]);
              }
              setTopSelected(!topSelected);
            }}
          >
            <AppText>Tops</AppText>
            <CheckBox
              checked={topSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => {
                if (topSelected) {
                  setFilter(filter.filter((type) => type !== "Tops"));
                } else {
                  setFilter([...filter, "Tops"]);
                }
                setTopSelected(!topSelected);
              }}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => {
              if (bottomSelected) {
                setFilter(filter.filter((type) => type !== "Bottoms"));
              } else {
                setFilter([...filter, "Bottoms"]);
              }
              setBottomSelected(!bottomSelected);
            }}
          >
            <AppText>Bottoms</AppText>
            <CheckBox
              checked={bottomSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => {
                if (bottomSelected) {
                  setFilter(filter.filter((type) => type !== "Bottoms"));
                } else {
                  setFilter([...filter, "Bottoms"]);
                }
                setBottomSelected(!bottomSelected);
              }}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => {
              if (outerwearSelected) {
                setFilter(filter.filter((type) => type !== "Outerwear"));
              } else {
                setFilter([...filter, "Outerwear"]);
              }
              setOuterwearSelected(!outerwearSelected);
            }}
          >
            <AppText>Outerwear</AppText>
            <CheckBox
              checked={outerwearSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => {
                if (outerwearSelected) {
                  setFilter(filter.filter((type) => type !== "Outerwear"));
                } else {
                  setFilter([...filter, "Outerwear"]);
                }
                setOuterwearSelected(!outerwearSelected);
              }}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => {
              if (shoesSelected) {
                setFilter(filter.filter((type) => type !== "Shoes"));
              } else {
                setFilter([...filter, "Shoes"]);
              }
              setShoesSelected(!shoesSelected);
            }}
          >
            <AppText>Shoes</AppText>
            <CheckBox
              checked={shoesSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => {
                if (shoesSelected) {
                  setFilter(filter.filter((type) => type !== "Shoes"));
                } else {
                  setFilter([...filter, "Shoes"]);
                }
                setShoesSelected(!shoesSelected);
              }}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => {
              if (beltSelected) {
                setFilter(filter.filter((type) => type !== "Belt"));
              } else {
                setFilter([...filter, "Belt"]);
              }
              setBeltSelected(!beltSelected);
            }}
          >
            <AppText>Belt</AppText>
            <CheckBox
              checked={beltSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => {
                if (beltSelected) {
                  setFilter(filter.filter((type) => type !== "Belt"));
                } else {
                  setFilter([...filter, "Belt"]);
                }
                setBeltSelected(!beltSelected);
              }}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => {
              if (headwearSelected) {
                setFilter(filter.filter((type) => type !== "Headwear"));
              } else {
                setFilter([...filter, "Headwear"]);
              }
              setHeadwearSelected(!headwearSelected);
            }}
          >
            <AppText>Headwear</AppText>
            <CheckBox
              checked={headwearSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => {
                if (headwearSelected) {
                  setFilter(filter.filter((type) => type !== "Headwear"));
                } else {
                  setFilter([...filter, "Headwear"]);
                }
                setHeadwearSelected(!headwearSelected);
              }}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => {
              if (accessoriesSelected) {
                setFilter(filter.filter((type) => type !== "Accessories"));
              } else {
                setFilter([...filter, "Accessories"]);
              }
              setAccessoriesSelected(!accessoriesSelected);
            }}
          >
            <AppText>Accessories</AppText>
            <CheckBox
              checked={accessoriesSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => {
                if (accessoriesSelected) {
                  setFilter(filter.filter((type) => type !== "Accessories"));
                } else {
                  setFilter([...filter, "Accessories"]);
                }
                setAccessoriesSelected(!accessoriesSelected);
              }}
            />
          </Pressable>
        </ScrollView>

        <AppButton
          onPress={() => {
            setApplyFilter(applyFilter + 1);
            setModalVisible(!modalVisible);
          }}
        >
          <AppText style={{ color: "white" }}>Apply</AppText>
        </AppButton>
        <AppButton
          onPress={() => {
            setTopSelected(false);
            setBottomSelected(false);
            setOuterwearSelected(false);
            setShoesSelected(false);
            setHeadwearSelected(false);
            setAccessoriesSelected(false);
            setBeltSelected(false);
            setFilter([]);
            setApplyFilter(applyFilter + 1);
          }}
          type="text"
        >
          <AppText style={{ color: Colors.light.destructive }}>Reset</AppText>
        </AppButton>
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
  },
});
