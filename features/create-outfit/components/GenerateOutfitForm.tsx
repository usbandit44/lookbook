import AppButton from "@/components/ui/AppButton";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/constants/constants";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { addNewItem, clearAllItems } from "@/redux/slices/outfitSlice";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { CheckBox, Icon } from "react-native-elements";
export enum itemTypes {
  Tops = "Tops",
  Bottoms = "Bottoms",
  Outerwear = "Outerwear",
  Shoes = "Shoes",
  Belt = "Belts",
  Headwear = "Headwear",
  Accessories = "Accessories",
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
  const [headwearSelected, setHeadwearSelected] = useState(false);
  const [accessoriesSelected, setAccessoriesSelected] = useState(false);
  const [beltSelected, setBeltSelected] = useState(false);

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
    await RandomItem(headwearSelected, () => repo.getAllHeadwearIds());
    await RandomItem(accessoriesSelected, () => repo.getAllAccessoriesIds());
    await RandomItem(beltSelected, () => repo.getAllBeltIds());
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <AppButton
          onPress={() => {
            router.navigate("/outfit/create-outfit");
          }}
          type="icon"
        >
          <Icon name="arrow-back-ios" type="material" size={24}></Icon>
        </AppButton>
        <AppText type="p2">Generate Outfit</AppText>
        <AppButton
          onPress={() => {
            setTopSelected(false);
            setBottomSelected(false);
            setOuterwearSelected(false);
            setShoesSelected(false);
            setHeadwearSelected(false);
            setAccessoriesSelected(false);
            setBeltSelected(false);
          }}
          type="text"
        >
          <AppText type="p3Bold" style={{ color: Colors.light.destructive }}>
            Reset
          </AppText>
        </AppButton>
      </View>
      <View style={styles.formContainer}>
        <View>
          <Pressable
            style={styles.option}
            onPress={() => setTopSelected(!topSelected)}
          >
            <AppText style={styles.optionText}>Tops</AppText>
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
            <AppText style={styles.optionText}>Bottoms</AppText>
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
            <AppText style={styles.optionText}>Outerwear</AppText>
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
            <AppText style={styles.optionText}>Shoes</AppText>
            <CheckBox
              checked={shoesSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => setShoesSelected(!shoesSelected)}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => setBeltSelected(!beltSelected)}
          >
            <AppText style={styles.optionText}>Belt</AppText>
            <CheckBox
              checked={beltSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => setBeltSelected(!beltSelected)}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => setHeadwearSelected(!headwearSelected)}
          >
            <AppText style={styles.optionText}>Headwear</AppText>
            <CheckBox
              checked={headwearSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => setHeadwearSelected(!headwearSelected)}
            />
          </Pressable>

          <Pressable
            style={styles.option}
            onPress={() => setAccessoriesSelected(!accessoriesSelected)}
          >
            <AppText style={styles.optionText}>Accessories</AppText>
            <CheckBox
              checked={accessoriesSelected}
              checkedIcon={<Icon name="check-box" type="material" size={24} />}
              onPress={() => setAccessoriesSelected(!accessoriesSelected)}
            />
          </Pressable>
        </View>
        <View style={{ width: "100%", paddingLeft: 25, paddingRight: 25 }}>
          <AppButton
            onPress={() => {
              GenerateOutfit();
              router.navigate("/outfit/create-outfit");
            }}
            fullWidth={true}
          >
            <AppText style={{ color: "white" }}>Generate</AppText>
          </AppButton>
        </View>
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
  optionText: {
    fontFamily: "Nunito-VariableFont_wght",
    fontWeight: "light",
    fontSize: 16,
  },
});
