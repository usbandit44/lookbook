import AppButton from "@/components/ui/AppButton";
import { AppIcon } from "@/components/ui/AppIcon";
import AppText from "@/components/ui/AppText";
import { Theme } from "@/constants/themes";
import { emitScrollToTop } from "@/features/navigation/hooks/scrollEvents";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { useTheme } from "@/hooks/ThemeProvider";
import { clearCurrentItemId } from "@/redux/slices/itemSlice";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Line } from "react-native-svg";

const ADD_MENU_HEIGHT = 320;

export type NavTab = "items" | "outfits";

const BottomNav = () => {
  const pathname = usePathname();

  const isOutfits = pathname.includes("outfits");

  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);

  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [active, setActive] = useState(false);
  const navTranslate = useRef(new Animated.Value(ADD_MENU_HEIGHT)).current;
  const insets = useSafeAreaInsets();
  const GLASS = 0.46;
  const [page, setPage] = useState<NavTab>(isOutfits ? "outfits" : "items");
  const renderTab = useCallback(
    (key: NavTab, label: string, on: boolean) => (
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: on }}
        accessibilityLabel={label}
        onPress={
          key == "items"
            ? () => {
                if (page === "items") {
                  emitScrollToTop("items");
                } else {
                  router.navigate("/pages");
                  setPage("items");
                }
              }
            : () => {
                if (page === "outfits") {
                  emitScrollToTop("outfits");
                } else {
                  router.navigate("/pages/outfits");
                  setPage("outfits");
                }
              }
        }
        style={({ pressed }) => [
          styles.tab,
          on && styles.tabActive,
          pressed && !on && styles.tabPressed,
        ]}
      >
        {key === "items" ? (
          <AppIcon color={on ? t.ink : t.inkA[45]} name={"shirt"} />
        ) : (
          <AppIcon color={on ? t.ink : t.inkA[45]} name={"hanger"} />
        )}
        <Text style={[styles.tabLabel, on && styles.tabLabelActive]}>
          {label}
        </Text>
      </Pressable>
    ),
    [styles, t],
  );

  useEffect(() => {
    Animated.timing(navTranslate, {
      toValue: active ? 0 : ADD_MENU_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start();
    // Animated.timing(navCorner, {
    //   toValue: active ? 50 : 0,
    //   duration: 250,
    //   useNativeDriver: false, // Required for height
    // }).start();
  }, [active]);

  // Counter-scale for children to stay normal size
  if (true) {
    return (
      <>
        <Pressable
          style={[
            styles.optionsScreen,
            { backgroundColor: active ? theme.inkA[40] : "transparent" },
          ]}
          onPress={() => setActive(false)}
          pointerEvents={active ? "auto" : "none"}
        ></Pressable>
        <View style={[styles.wrap]} pointerEvents="box-none">
          <BlurView intensity={30} tint="light" style={styles.bar}>
            <View
              style={[
                styles.tint,
                { backgroundColor: `rgba(255,255,255,${GLASS})` },
              ]}
              pointerEvents="none"
            />
            {renderTab("items", "ITEMS", page == "items")}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add to Lookbook"
              onPress={() => {
                setActive(true);
              }}
              style={({ pressed }) => [
                styles.add,
                pressed && styles.addPressed,
              ]}
            >
              <Svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                stroke={t.onInk}
                strokeWidth={2}
                strokeLinecap="round"
              >
                <Line x1={12} y1={4.5} x2={12} y2={19.5} />
                <Line x1={4.5} y1={12} x2={19.5} y2={12} />
              </Svg>
            </Pressable>
            {renderTab("outfits", "OUTFITS", page == "outfits")}
          </BlurView>
        </View>
        <Animated.View
          style={[
            styles.addMenu,
            {
              transform: [{ translateY: navTranslate }],
            },
          ]}
        >
          <View style={styles.header}>
            <AppText text="Add to Lookbook" type={"m22"}></AppText>
            <AppButton
              type="text"
              label="Close"
              onPress={() => setActive(false)}
            ></AppButton>
          </View>
          <>
            <Pressable
              style={[
                styles.addMenuOption,
                { borderBottomColor: theme.inkA[14], borderBottomWidth: 1 },
              ]}
              onPress={() => {
                setActive(false);
                dispatch(clearCurrentItemId());
                router.navigate("/camera-screen");
              }}
            >
              <AppIcon name={"shirt"} size={50} strokeWidth={0.85} />
              <View style={styles.addMenuOptionText}>
                <AppText text={"Add Item"} type={"p3"} />
                <AppText
                  text={
                    "Photograph a garment, background removed automatically"
                  }
                  type={"p5"}
                />
              </View>
              <AppIcon name="arrowRight" size={30} />
            </Pressable>
            <Pressable
              style={[styles.addMenuOption]}
              onPress={() => {
                router.navigate("/outfit/create-outfit");
              }}
            >
              <AppIcon name="createOutfit" size={50} strokeWidth={0.85} />
              <View style={styles.addMenuOptionText}>
                <AppText text={"Create Outfit"} type={"p3"} />
                <AppText
                  text={"Build a look from the pieces you own"}
                  type={"p5"}
                />
              </View>
              <AppIcon name="arrowRight" size={30} />
            </Pressable>
          </>
        </Animated.View>
      </>
    );
  }
};

export default BottomNav;

const s = (t: Theme) =>
  StyleSheet.create({
    wrap: {
      position: "absolute",
      left: 20,
      right: 20,
      bottom: 20,
      zIndex: 5,
      shadowColor: t.ink,
      shadowOpacity: 0.11,
      shadowRadius: 17,
      shadowOffset: { width: 0, height: 12 },
      elevation: 10,
    },
    bar: {
      height: 70,
      borderRadius: 999,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: t.whiteA[50],
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingHorizontal: 10,
    },
    tint: { ...StyleSheet.absoluteFillObject },
    tab: {
      width: 76,
      height: 54,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
      backgroundColor: "transparent",
    },
    tabActive: { backgroundColor: t.inkA[7] },
    tabPressed: { backgroundColor: t.inkA[7] },
    tabLabel: {
      fontFamily: "IBMPlexMono-SemiBold",
      fontSize: 7.5,
      letterSpacing: 0.9,
      color: t.inkA[45],
    },
    tabLabelActive: { color: t.ink },
    add: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: t.ink,
      alignItems: "center",
      justifyContent: "center",
    },
    addPressed: { opacity: 0.82 },
    addMenu: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: 20,
      alignItems: "flex-start",
      borderTopColor: "black",
      borderWidth: 1,
      zIndex: 100,
      overflow: "hidden",
      elevation: 100,
      backgroundColor: t.surface,
      gap: 20,
    },
    header: {
      // "ADD TO LOOKBOOK" / "CLOSE"
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    addMenuOption: {
      width: "100%",
      height: "auto",
      flexDirection: "row",
      gap: 15,
      paddingVertical: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    addMenuOptionText: {
      flex: 1,
      flexDirection: "column",
      gap: 5,
      alignItems: "flex-start",
    },
    list: {
      gap: 1,
      backgroundColor: t.inkA[14], // rgba(10,10,10,.14)
    },
    optionsScreen: {
      ...StyleSheet.absoluteFillObject,
    },
  });
