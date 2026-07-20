import AppText from "@/components/ui/AppText";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ProcessingIndicatorProps {
  progress: number;
  total: number;
  statusText: string;
}

export function ProcessingIndicator({
  progress,
  total,
  statusText,
}: ProcessingIndicatorProps) {
  const fillWidth = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    const pct = total > 0 ? progress / total : 0;
    fillWidth.value = withTiming(pct, { duration: 300 });
  }, [progress, total]);

  useEffect(() => {
    textOpacity.value = 0;
    const timer = setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 500 });
    }, 3000);
    return () => {
      clearTimeout(timer);
      textOpacity.value = withTiming(0, { duration: 300 });
    };
  }, [statusText]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${fillWidth.value * 100}%`,
  }));

  const textWrapperStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
      <Animated.View style={textWrapperStyle}>
        <AppText type="p3" style={{ color: "white", textAlign: "center" }}>
          {statusText}
        </AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "70%",
    alignItems: "center",
    gap: 12,
  },
  track: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "white",
  },
});

export default ProcessingIndicator;
