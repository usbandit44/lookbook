import {
  addNewItem,
  clearAllItems,
} from "@/features/create-outfit/redux/slices/outfitSlice";
import { useAppDispatch } from "@/hooks/redux-hooks";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CheckBox, Icon } from "react-native-elements";
export enum itemTypes {
  Tops = "Tops",
  Bottoms = "Bottoms",
  Outerwear = "Outerwear",
  Shoes = "Shoes",
  Eyewear = "Eyewear",
  Headwear = "Headwear",
  Necklaces = "Necklaces",
  WristWear = "Wrist Wear",
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * (max - 0)) + 0;
};

const GenerateOutfitForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [topSelected, setTopSelected] = useState(false);
  const [bottomSelected, setBottomSelected] = useState(false);
  const [outerwearSelected, setOuterwearSelected] = useState(false);
  const [shoesSelected, setShoesSelected] = useState(false);
  const [eyewearSelected, setEyewearSelected] = useState(false);
  const [headwearSelected, setHeadwearSelected] = useState(false);
  const [necklacesSelected, setNecklacesSelected] = useState(false);
  const [wristWearSelected, setWristWearSelected] = useState(false);

  const repo = new AppItemRepo();

  async function RandomItem(enabled: boolean, getter: () => Promise<number[]>) {
    if (!enabled) return;

    const list = await getter();
    if (!list.length) return;

    const randomIndex = getRandomInt(list.length);
    dispatch(addNewItem(list[randomIndex]));
    console.log(); // or set state instead
  }
  async function GenerateOutfit() {
    dispatch(clearAllItems());
    await RandomItem(topSelected, () => repo.getAllTopIds());
    await RandomItem(bottomSelected, () => repo.getAllBottomIds());
    await RandomItem(outerwearSelected, () => repo.getAllOuterwearIds());
    await RandomItem(shoesSelected, () => repo.getAllShoeIds());
    await RandomItem(eyewearSelected, () => repo.getAllEyewearIds());
    await RandomItem(headwearSelected, () => repo.getAllHeadwearIds());
    await RandomItem(necklacesSelected, () => repo.getAllNecklaceIds());
    await RandomItem(wristWearSelected, () => repo.getAllWristwearIds());
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => {
            router.navigate("/outfit/create-outfit");
          }}
          hitSlop={10}
        >
          <Icon name="arrow-back-ios" type="material" size={24}></Icon>
        </Pressable>
        <Text>Generate Outfit</Text>
        <Pressable
          onPress={() => {
            setTopSelected(false);
            setBottomSelected(false);
            setOuterwearSelected(false);
            setShoesSelected(false);
            setEyewearSelected(false);
            setHeadwearSelected(false);
            setNecklacesSelected(false);
            setWristWearSelected(false);
          }}
          hitSlop={10}
        >
          <Text>Reset</Text>
        </Pressable>
      </View>
      <View style={styles.formContainer}>
        <View>
          <Pressable
            style={styles.option}
            onPress={() => setTopSelected(!topSelected)}
          >
            <Text>Tops</Text>
            <CheckBox
              checked={topSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => setTopSelected(!topSelected)}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => setBottomSelected(!bottomSelected)}
          >
            <Text>Bottoms</Text>
            <CheckBox
              checked={bottomSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => setBottomSelected(!bottomSelected)}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => setOuterwearSelected(!outerwearSelected)}
          >
            <Text>Outerwear</Text>
            <CheckBox
              checked={outerwearSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => setOuterwearSelected(!outerwearSelected)}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => setShoesSelected(!shoesSelected)}
          >
            <Text>Shoes</Text>
            <CheckBox
              checked={shoesSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => setShoesSelected(!shoesSelected)}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => setEyewearSelected(!eyewearSelected)}
          >
            <Text>Eyewear</Text>
            <CheckBox
              checked={eyewearSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => setEyewearSelected(!eyewearSelected)}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => setHeadwearSelected(!headwearSelected)}
          >
            <Text>Headwear</Text>
            <CheckBox
              checked={headwearSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => setHeadwearSelected(!headwearSelected)}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => setNecklacesSelected(!necklacesSelected)}
          >
            <Text>Necklaces</Text>
            <CheckBox
              checked={necklacesSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => setNecklacesSelected(!necklacesSelected)}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => setWristWearSelected(!wristWearSelected)}
          >
            <Text>Wrist Wear</Text>
            <CheckBox
              checked={wristWearSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => setWristWearSelected(!wristWearSelected)}
            />
          </Pressable>
        </View>
        <Pressable
          onPress={() => {
            GenerateOutfit();
            router.navigate("/outfit/create-outfit");
          }}
        >
          <Text>Generate</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default GenerateOutfitForm;

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 50,
  },
  headerContainer: {
    width: "100%",
    paddingTop: 30,
    paddingBottom: 30,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 25,
  },
  option: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 30,
    paddingRight: 30,
    borderTopWidth: 0.5,
    borderColor: "#979C9E",
  },
});
