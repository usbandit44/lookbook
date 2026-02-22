import AppText from "@/components/ui/AppText";
import icons from "@/constants/icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { Icon } from "react-native-elements";
import { CopilotStep, walkthroughable, useCopilot } from "react-native-copilot";

const BottomNav = () => {
  const CopilotView = walkthroughable(View);
  const CopilotPressable = walkthroughable(Pressable);
  const { currentStep } = useCopilot();
  const prevStep = useRef<string | null>(null);

  const { width } = useWindowDimensions();
  const router = useRouter();
  const [active, setActive] = useState(false);
  const navHeight = useRef(new Animated.Value(80)).current;
  //   const navCorner = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(navHeight, {
      toValue: active ? 160 : 80,
      duration: 300,
      useNativeDriver: false, // Required for height
    }).start();
    // Animated.timing(navCorner, {
    //   toValue: active ? 50 : 0,
    //   duration: 250,
    //   useNativeDriver: false, // Required for height
    // }).start();
  }, [active]);

  // Counter-scale for children to stay normal size

  useEffect(() => {
    if (!currentStep) return;

    const previous = prevStep.current;
    const current = currentStep.name;

    if (previous === "openBottomNav" && current === "filter") {
      setActive(true);
    }

    prevStep.current = current;
  }, [currentStep]);
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: navHeight,
        },
      ]}
    >
      {active ? (
        <View
          style={{
            position: "static",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 60,
          }}
        >
          
          <Pressable
            onPress={() => {
              setActive(false);
            }}
            style={{
              position: "absolute",
              top: 15,
              left: 15,
            }}
          >
            <Icon name="close" type="material"></Icon>
          </Pressable>
          <View style={styles.navButtonContainer}>
            <CopilotStep
              text="Tap here to add items or create outfits"
              order={5}
              name="addItems"
            >
            <CopilotPressable
              onPress={() => {
                setActive(false);
                router.navigate("/add-item");
              }}
              style={styles.navButton}
            >
              <Icon name="shirt-outline" type="ionicon" size={35}></Icon>
            </CopilotPressable>
            </CopilotStep>
            <AppText type="p3SemiBold">Add Item</AppText>
          </View>
          <View style={styles.navButtonContainer}>
            <CopilotStep
              text="Tap here to add items or create outfits"
              order={6}
              name="createOutfit"
            >
            <CopilotPressable
              onPress={() => {
                router.navigate("/outfit/create-outfit");
              }}
              style={styles.navButton}
            >
              <Image
                source={icons.createOutfitIcon}
                style={{ width: 45, height: 45, resizeMode: "contain" }}
              />
            </CopilotPressable>
            </CopilotStep>
            <AppText type="p3SemiBold">Create Outfit</AppText>
          </View>
        </View>
      ) : (
        <CopilotStep
          text="Tap here to add items or create outfits"
           order={3}
          name="openBottomNav"
        >
        <CopilotPressable
          onPress={() => {
            setActive(true);
          }}
        >
          <Icon
            name="add-circle-outline"
            type="material"
            color="black"
            size={30}
          />
        </CopilotPressable>
        </CopilotStep>
      )}
    </Animated.View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: "black",
    borderWidth: 1,

    overflow: "hidden",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  navButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  navButton: {
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
  },
});
