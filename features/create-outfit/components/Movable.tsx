import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const isIpad = Platform.OS === "ios" && Platform.isPad;

const BASE_SIZE = isIpad ? 250 : 100;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;

export interface MovableProps {
  children?: React.ReactNode;
  parentW: number;
  parentH: number;
  initialX?: number;
  initialY?: number;
  onClear?: () => void;
  isCapturing?: boolean;
}

const Movable: React.FC<MovableProps> = ({
  children,
  parentW,
  parentH,
  initialX = 0,
  initialY = 0,
  onClear,
  isCapturing = false,
}) => {
  const x = useSharedValue(initialX);
  const y = useSharedValue(initialY);
  const prevX = useSharedValue(initialX);
  const prevY = useSharedValue(initialY);

  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);

  const clamp = (v: number, min: number, max: number) => {
    "worklet";
    return Math.min(Math.max(v, min), max);
  };

  // ────────────── Gestures ──────────────
  const pan = Gesture.Pan()
    .onStart(() => {
      prevX.value = x.value;
      prevY.value = y.value;
    })
    .onUpdate((e) => {
      const size = BASE_SIZE * scale.value;
      x.value = clamp(prevX.value + e.translationX, 0, parentW - size);
      y.value = clamp(prevY.value + e.translationY, 0, parentH - size);
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
    });

  const gesture = Gesture.Simultaneous(pan, pinch);

  // ────────────── Animated Styles ──────────────
  const boxStyle = useAnimatedStyle(() => ({
    width: BASE_SIZE * scale.value,
    height: BASE_SIZE * scale.value,
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  // ────────────── Render ──────────────
  return (
    <GestureDetector gesture={gesture}>
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
const styles = StyleSheet.create({
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
});
