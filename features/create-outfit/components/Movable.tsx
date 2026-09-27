import { AppIcon } from "@/components/ui/AppIcon";
import AppText from "@/components/ui/AppText";
import { Theme } from "@/constants/themes";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useTheme } from "@/hooks/ThemeProvider";
import { useAppModal } from "@/hooks/useAppModal";
import {
  getItemsPositions,
  moveItemDown,
  moveItemToBack,
  moveItemToFront,
  moveItemUp,
  setItemPosition,
} from "@/redux/slices/outfitSlice";
import React, { useEffect } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const isIpad = Platform.OS === "ios" && Platform.isPad;

const BASE_SIZE = isIpad ? 250 : 100;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

export interface MovableProps {
  id: number;
  children?: React.ReactNode;
  parentW: number;
  parentH: number;
  initialX?: number;
  initialY?: number;
  initialScale?: number;
  onClear?: () => void;
  isCapturing?: boolean;
  modalName: string;
}

const Movable: React.FC<MovableProps> = ({
  id,
  children,
  parentW,
  parentH,
  initialX = 0,
  initialY = 0,
  initialScale = 1,
  onClear,
  isCapturing = false,
  modalName,
}) => {
  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);
  const { show, hide } = useAppModal();
  const dispatch = useAppDispatch();
  const x = useSharedValue(initialX);
  const y = useSharedValue(initialY);
  const prevX = useSharedValue(initialX);
  const prevY = useSharedValue(initialY);

  const scale = useSharedValue(initialScale);
  const baseScale = useSharedValue(initialScale);

  useEffect(() => {
    x.value = withTiming(initialX, { duration: 200 });
    y.value = withTiming(initialY, { duration: 200 });
    scale.value = withTiming(initialScale, { duration: 200 });

    prevX.value = initialX;
    prevY.value = initialY;
    baseScale.value = initialScale;
  }, [initialX, initialY, initialScale]);

  const clamp = (v: number, min: number, max: number) => {
    "worklet";
    return Math.min(Math.max(v, min), max);
  };

  const positions = useAppSelector(getItemsPositions);

  const dispatchPosition = (x: number, y: number, scale: number) => {
    dispatch(setItemPosition({ id: id, position: { x, y, scale } }));
  };

  const modalContent = () => {
    return (
      <View>
        <View style={styles.modalTitleRow}>
          <AppText
            text={modalName}
            type={"m22"}
            style={{ fontSize: 12 }}
          ></AppText>
        </View>
        <Pressable
          style={styles.modalRow}
          onPress={() => {
            dispatch(moveItemToFront(id));
            hide();
          }}
        >
          <AppIcon name={"layerTop"}></AppIcon>
          <AppText
            text={"Bring to front"}
            type={"p3"}
            style={{ fontSize: 15 }}
          ></AppText>
        </Pressable>

        <Pressable
          style={styles.modalRow}
          onPress={() => {
            dispatch(moveItemUp(id));
            hide();
          }}
        >
          <AppIcon name={"layerUp"}></AppIcon>
          <AppText
            text={"Move one up"}
            type={"p3"}
            style={{ fontSize: 15 }}
          ></AppText>
        </Pressable>

        <Pressable
          style={styles.modalRow}
          onPress={() => {
            dispatch(moveItemDown(id));
            hide();
          }}
        >
          <AppIcon name="layerDown"></AppIcon>
          <AppText
            text={"Move one down"}
            type={"p3"}
            style={{ fontSize: 15 }}
          ></AppText>
        </Pressable>
        <Pressable
          style={styles.modalRow}
          onPress={() => {
            dispatch(moveItemToBack(id));
            hide();
          }}
        >
          <AppIcon name="layerBottom"></AppIcon>
          <AppText
            text={"Send to back"}
            type={"p3"}
            style={{ fontSize: 15 }}
          ></AppText>
        </Pressable>
      </View>
    );
  };
  const openPositionModal = () => {
    show(modalContent());
  };
  // ────────────── Gestures ──────────────
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      runOnJS(openPositionModal)();
    })
    .onEnd(() => {});

  const pan = Gesture.Pan()
    .onStart(() => {
      prevX.value = x.value;
      prevY.value = y.value;
    })
    .onUpdate((e) => {
      const size = BASE_SIZE * scale.value;
      x.value = clamp(prevX.value + e.translationX, 0, parentW - size);
      y.value = clamp(prevY.value + e.translationY, 0, parentH - size);
    })
    .onEnd(() => {
      runOnJS(dispatchPosition)(x.value, y.value, scale.value);
    });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = clamp(baseScale.value * e.scale, MIN_SCALE, MAX_SCALE);
    })
    .onEnd(() => {
      baseScale.value = scale.value;
      const size = BASE_SIZE * scale.value;
      x.value = clamp(x.value, 0, parentW - size);
      y.value = clamp(y.value, 0, parentH - size);
      runOnJS(dispatchPosition)(x.value, y.value, scale.value);
    });

  const gesture = Gesture.Simultaneous(pan, pinch);
  const composedGesture = Gesture.Exclusive(longPressGesture, gesture);

  // ────────────── Animated Styles ──────────────
  const boxStyle = useAnimatedStyle(() => ({
    width: BASE_SIZE * scale.value,
    height: BASE_SIZE * scale.value,
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  // ────────────── Render ──────────────
  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.box, boxStyle]}>
        {children}

        {/* Regular View so JS state (isCapturing) hides it immediately */}
        <View
          style={[styles.closeIconWrapper, isCapturing && { display: "none" }]}
        >
          <Pressable hitSlop={14} onPress={onClear}>
            <Icon name="close" type="material" color="black" size={14} />
          </Pressable>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default Movable;

// ────────────── Styles ──────────────
const s = (t: Theme) =>
  StyleSheet.create({
    box: {
      position: "absolute",
      borderRadius: 8,
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
    },
    closeIconWrapper: {
      position: "absolute",
      top: 0,
      right: 0,
      zIndex: 2,
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
