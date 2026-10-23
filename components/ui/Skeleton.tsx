import React, { useEffect } from "react";
import { DimensionValue, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const Skeleton: React.FC<{
  width: DimensionValue;
  height: DimensionValue;
  showing: boolean;
  style?: ViewStyle;
}> = (props) => {
  const COLOR1 = "#D0D0D0"; // light green
  const COLOR2 = "#E8E8E8"; // light red

  const backgroundColor = useSharedValue(COLOR1);
  useEffect(() => {
    backgroundColor.value = withRepeat(
      withSequence(
        withTiming(COLOR2, { duration: 850 }),
        withTiming(COLOR1, { duration: 850 }),
      ),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return { backgroundColor: backgroundColor.value };
  }, []);
  if (!props.showing) {
    return null;
  }
  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: props.width, height: props.height },
        animatedStyle,
        props.style,
      ]}
    />
  );
};

export default Skeleton;

const styles = StyleSheet.create({
  skeleton: {
    position: "absolute",
    zIndex: 100,
  },
});
