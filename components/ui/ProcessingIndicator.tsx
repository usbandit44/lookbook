import AppText from "@/components/ui/AppText";
import { useTheme } from "@/hooks/ThemeProvider";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
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
  const { theme } = useTheme();
  const fillWidth = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    const pct = total > 0 ? progress / total : 0;
    fillWidth.value = withTiming(pct, { duration: 300 });
  }, [progress, total]);

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
      <View style={styles.textSlot}>
        <Animated.View
          key={statusText}
          entering={FadeIn.duration(500).delay(3000)}
          exiting={FadeOut.duration(300)}
          style={styles.textLayer}
        >
          <AppText
            type={"p5"}
            style={{ color: theme.whiteA[80], textAlign: "center" }}
            text={statusText}
          />
        </Animated.View>
      </View>
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
  textSlot: {
    width: "100%",
    minHeight: 18,
    justifyContent: "center",
  },
  textLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingTop: 15,
  },
});

export default ProcessingIndicator;
