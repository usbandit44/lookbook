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
const GenerateOutfitForm = () => {
  const [topSelected, setTopSelected] = useState(false);
  const [bottomSelected, setBottomSelected] = useState(false);
  const [outerwearSelected, setOuterwearSelected] = useState(false);
  const [shoesSelected, setShoesSelected] = useState(false);
  const [eyewearSelected, setEyewearSelected] = useState(false);
  const [headwearSelected, setHeadwearSelected] = useState(false);
  const [necklacesSelected, setNecklacesSelected] = useState(false);
  const [wristWearSelected, setWristWearSelected] = useState(false);

  return (
    <View style={styles.container}>
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
      <Pressable>
        <Text>Generate</Text>
      </Pressable>
    </View>
  );
};

export default GenerateOutfitForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 50,
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
