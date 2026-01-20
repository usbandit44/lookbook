import AppButton from "@/components/ui/AppButton";
import { Colors } from "@/constants/constants";
import { items } from "@/db/schemas/items";
import AddItemHeader from "@/features/create-outfit/components/AddItemHeader";
import SelectableItem from "@/features/create-outfit/components/SelectableItem";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CheckBox, Icon } from "react-native-elements";

const AddItem = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  //const [itemsData, setItemsData] = useState<ItemsType[]>([]);

  const { data: itemsData } = useLiveQuery(drizzleDb.select().from(items));
  const [filter, setFilter] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<
    | {
        id: number;
        name: string;
        type: string;
        size: string | null;
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
  const [eyewearSelected, setEyewearSelected] = useState(false);
  const [headwearSelected, setHeadwearSelected] = useState(false);
  const [necklacesSelected, setNecklacesSelected] = useState(false);
  const [wristWearSelected, setWristWearSelected] = useState(false);

  useEffect(() => {
    console.log();
    if (filter.length == 0) {
      console.log("here");
      setFilteredData(itemsData);
    } else {
      console.log("here2");
      setFilteredData(itemsData.filter((item) => filter.includes(item.type)));
    }
  }, [applyFilter, itemsData]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <AddItemHeader />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.itemsGrid}
        ListHeaderComponent={
          <View style={{ paddingTop: 15, paddingLeft: 15 }}>
            <AppButton
              onPress={() => setModalVisible(true)}
              containWidth={true}
            >
              <Icon
                name="filter-menu-outline"
                type="material-community"
                color="white"
                size={20}
              />
              <Text style={{ color: "white" }}>Filter</Text>
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Pressable
          style={styles.centeredView}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Text>Filter</Text>
            <ScrollView>
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
                <Text>Tops</Text>
                <CheckBox
                  checked={topSelected}
                  checkedIcon={
                    <Icon name="check-box" type="material" size={24} />
                  }
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
                <Text>Bottoms</Text>
                <CheckBox
                  checked={bottomSelected}
                  checkedIcon={
                    <Icon name="check-box" type="material" size={24} />
                  }
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
                <Text>Outerwear</Text>
                <CheckBox
                  checked={outerwearSelected}
                  checkedIcon={
                    <Icon name="check-box" type="material" size={24} />
                  }
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
                <Text>Shoes</Text>
                <CheckBox
                  checked={shoesSelected}
                  checkedIcon={
                    <Icon name="check-box" type="material" size={24} />
                  }
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
                  if (eyewearSelected) {
                    setFilter(filter.filter((type) => type !== "Eyewear"));
                  } else {
                    setFilter([...filter, "Eyewear"]);
                  }
                  setEyewearSelected(!eyewearSelected);
                }}
              >
                <Text>Eyewear</Text>
                <CheckBox
                  checked={eyewearSelected}
                  checkedIcon={
                    <Icon name="check-box" type="material" size={24} />
                  }
                  onPress={() => {
                    if (eyewearSelected) {
                      setFilter(filter.filter((type) => type !== "Eyewear"));
                    } else {
                      setFilter([...filter, "Eyewear"]);
                    }
                    setEyewearSelected(!eyewearSelected);
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
                <Text>Headwear</Text>
                <CheckBox
                  checked={headwearSelected}
                  checkedIcon={
                    <Icon name="check-box" type="material" size={24} />
                  }
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
                  if (necklacesSelected) {
                    setFilter(filter.filter((type) => type !== "Necklaces"));
                  } else {
                    setFilter([...filter, "Necklaces"]);
                  }
                  setNecklacesSelected(!necklacesSelected);
                }}
              >
                <Text>Necklaces</Text>
                <CheckBox
                  checked={necklacesSelected}
                  checkedIcon={
                    <Icon name="check-box" type="material" size={24} />
                  }
                  onPress={() => {
                    if (necklacesSelected) {
                      setFilter(filter.filter((type) => type !== "Necklaces"));
                    } else {
                      setFilter([...filter, "Necklaces"]);
                    }
                    setNecklacesSelected(!necklacesSelected);
                  }}
                />
              </Pressable>

              <Pressable
                style={styles.option}
                onPress={() => {
                  if (wristWearSelected) {
                    setFilter(filter.filter((type) => type !== "Wrist Wear"));
                  } else {
                    setFilter([...filter, "Wrist Wear"]);
                  }
                  setWristWearSelected(!wristWearSelected);
                }}
              >
                <Text>Wrist Wear</Text>
                <CheckBox
                  checked={wristWearSelected}
                  checkedIcon={
                    <Icon name="check-box" type="material" size={24} />
                  }
                  onPress={() => {
                    if (wristWearSelected) {
                      setFilter(filter.filter((type) => type !== "Wrist Wear"));
                    } else {
                      setFilter([...filter, "Wrist Wear"]);
                    }
                    setWristWearSelected(!wristWearSelected);
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
              <Text style={{ color: "white" }}>Apply</Text>
            </AppButton>
            <AppButton
              onPress={() => {
                setTopSelected(false);
                setBottomSelected(false);
                setOuterwearSelected(false);
                setShoesSelected(false);
                setEyewearSelected(false);
                setHeadwearSelected(false);
                setNecklacesSelected(false);
                setWristWearSelected(false);
                setFilter([]);
                setApplyFilter(applyFilter + 1);
              }}
              type="text"
            >
              <Text>Reset</Text>
            </AppButton>
          </View>
        </Pressable>
      </Modal>
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
  },
});
