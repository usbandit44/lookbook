import AppButton from "@/components/ui/AppButton";
import { AppIcon } from "@/components/ui/AppIcon";
import AppText from "@/components/ui/AppText";
import { PresetTypesType } from "@/constants/constants";
import { Theme } from "@/constants/themes";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { useRepo } from "@/hooks/RepoProvider";
import { useTheme } from "@/hooks/ThemeProvider";
import { useAppModal } from "@/hooks/useAppModal";
import { useGenerateOutfit } from "@/hooks/useGenerateOutfit";
import { useSnackbar } from "@/hooks/useSnackBar";
import { setOutfitItems } from "@/redux/slices/outfitSlice";
import { setPresetId } from "@/redux/slices/presetSlice";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const FULL_SWIPE_DISTANCE = 150; // drag past this and the action fires on release
const MAX_DRAG = FULL_SWIPE_DISTANCE + 40; // resistance-free travel cap while dragging
const FLY_OFF_DISTANCE = 500;

const PresetPreview: React.FC<{
  id: number;
  name: string;
  types: PresetTypesType;
  favorited: boolean;
}> = (props) => {
  const { presetsRepo } = useRepo();

  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);

  const { show, hide } = useAppModal();
  const [isPressed, setIsPressed] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { generate } = useGenerateOutfit();
  const posthog = usePostHog();

  const snackbarSettingsContext = useSnackbar();
  if (!snackbarSettingsContext) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  const { showSnackbar, hideSnackbar } = snackbarSettingsContext;

  const translateX = useSharedValue(0);

  const handleFavorite = () => {
    presetsRepo.updateFavorited(props.id, !props.favorited);
    posthog.capture("favorite_toggled", {
      target: "preset",
      favorited: !props.favorited,
    });
  };

  const handleDelete = async () => {
    try {
      await presetsRepo.deletePreset(props.id);
      posthog.capture("preset_deleted", {
        category_count: Object.keys(props.types).length,
      });
      showSnackbar("Preset Deleted", "success");
      setTimeout(() => hideSnackbar(), 3000);
    } catch (error) {
      showSnackbar("Unable to remove preset", "error");
      setTimeout(() => hideSnackbar(), 3000);
    }
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onUpdate((event) => {
      let next = event.translationX;
      if (next > MAX_DRAG) next = MAX_DRAG;
      if (next < -MAX_DRAG) next = -MAX_DRAG;
      translateX.value = next;
    })
    .onEnd((event) => {
      const dx = event.translationX;

      if (dx > FULL_SWIPE_DISTANCE) {
        // full swipe right -> favorite (non-destructive, row stays), spring back
        runOnJS(handleFavorite)();
        translateX.value = withSpring(0, { damping: 20, stiffness: 220 });
        return;
      }

      if (dx < -FULL_SWIPE_DISTANCE) {
        // full swipe left -> delete: fly the row off, then remove from db
        translateX.value = withTiming(
          -FLY_OFF_DISTANCE,
          { duration: 200 },
          (finished) => {
            if (finished) {
              runOnJS(handleDelete)();
            }
          },
        );
        return;
      }

      // didn't reach the threshold either way -> snap back
      translateX.value = withSpring(0, { damping: 20, stiffness: 220 });
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftActionStyle = useAnimatedStyle(() => ({
    width: translateX.value > 0 ? translateX.value : 0,
  }));

  const rightActionStyle = useAnimatedStyle(() => ({
    width: translateX.value < 0 ? -translateX.value : 0,
  }));

  const modalContent = () => {
    return (
      <View>
        <View style={styles.modalTitleRow}>
          <AppText
            text={props.name}
            type={"m22"}
            style={{ fontSize: 12 }}
          ></AppText>
        </View>
        <Pressable
          style={styles.modalRow}
          onPress={() => {
            hide();
            handleGenerate("menu");
          }}
        >
          <AppIcon name={"regenerate"}></AppIcon>
          <AppText
            text={"Generate Outfit"}
            type={"p3"}
            style={{ fontSize: 15 }}
          ></AppText>
        </Pressable>
        <Pressable
          style={styles.modalRow}
          onPress={() => {
            hide();
            dispatch(setPresetId({ id: props.id }));
            router.navigate("/presets/create-preset");
          }}
        >
          <AppIcon name={"edit"}></AppIcon>
          <AppText
            text={"Edit Preset"}
            type={"p3"}
            style={{ fontSize: 15 }}
          ></AppText>
        </Pressable>
        <Pressable
          style={styles.modalRow}
          onPress={() => {
            hide();
            handleFavorite();
          }}
        >
          <AppIcon name={props.favorited ? "star" : "starOutline"}></AppIcon>
          <AppText
            text={
              props.favorited ? "Remove from Favorites" : "Add to Favorites"
            }
            type={"p3"}
            style={{ fontSize: 15 }}
          ></AppText>
        </Pressable>
        <Pressable
          style={styles.modalRow}
          onPress={() => {
            hide();
            handleDelete();
          }}
        >
          <AppIcon name="trash" color={theme.danger}></AppIcon>
          <AppText
            text={"Delete"}
            type={"p3"}
            style={{ fontSize: 15, color: theme.danger }}
          ></AppText>
        </Pressable>
      </View>
    );
  };

  async function handleGenerate(trigger: "tap" | "menu") {
    console.log(props.types);
    posthog.capture("preset_used", {
      trigger,
      category_count: Object.keys(props.types).length,
      favorited: props.favorited,
    });
    const result = await generate(props.types);
    if (result.ok) {
      dispatch(setOutfitItems({ items: result.items }));
      router.navigate("/outfit/create-outfit");
    } else {
      showSnackbar(`No ${result.missing[0]} in your closet yet.`, "error");
      setTimeout(() => hideSnackbar(), 3000);
    }
  }

  return (
    <View style={styles.rowWrapper}>
      {/* revealed while dragging right, disappears again unless it's a full swipe */}
      <Animated.View style={[styles.actionLeft, leftActionStyle]}>
        <View style={[styles.actionButton, { backgroundColor: theme.inkA[7] }]}>
          <AppIcon name={props.favorited ? "star" : "starOutline"}></AppIcon>
        </View>
      </Animated.View>

      {/* revealed while dragging left, disappears again unless it's a full swipe */}
      <Animated.View style={[styles.actionRight, rightActionStyle]}>
        <View style={[styles.actionButton, { backgroundColor: theme.danger }]}>
          <AppIcon name="trash" color={theme.onInk}></AppIcon>
        </View>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={rowStyle}>
          <Pressable
            style={styles.container}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onLongPress={() => {
              setIsPressed(false);
              show(modalContent());
            }}
            onPress={() => {
              handleGenerate("tap");
            }}
          >
            {isPressed && (
              <View style={styles.pressOverlay} pointerEvents="none" />
            )}
            <View style={styles.textSection}>
              <AppText
                text={props.name}
                type={"p2"}
                style={{ fontSize: 15 }}
              ></AppText>
              <AppText
                text={Object.values(props.types).flat().join(" / ")}
                type={"m11"}
              ></AppText>
            </View>
            {props.favorited ? <AppIcon name={"star"}></AppIcon> : null}

            <AppButton
              type="icon"
              icon={<AppIcon name={"more"}></AppIcon>}
              onPress={() => {
                show(modalContent());
              }}
            ></AppButton>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default PresetPreview;

const s = (t: Theme) =>
  StyleSheet.create({
    rowWrapper: {
      position: "relative",
      overflow: "hidden",
    },
    actionLeft: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      overflow: "hidden",
    },
    actionRight: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      overflow: "hidden",
    },
    actionButton: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      backgroundColor: t.surface,
      gap: 8,
    },
    textSection: {
      flexDirection: "column",
      gap: 8,
      flex: 1,
    },
    pressOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: t.inkA[20],
    },
    modalTitleRow: {
      paddingHorizontal: 20,
      paddingTop: 15,
      paddingBottom: 13,
      borderBottomWidth: 1,
      borderBottomColor: t.inkA[10],
    },
    modalRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 13,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: t.inkA[8],
    },
  });
