// import React from "react";
// import { LayoutChangeEvent, StyleSheet, View } from "react-native";
// import { Gesture, GestureDetector } from "react-native-gesture-handler";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
// } from "react-native-reanimated";

// const BASE_SIZE = 100;
// const MIN_SCALE = 0.5;
// const MAX_SCALE = 2.5;

// const Movable: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
//   const [parentW, setParentW] = React.useState(0);
//   const [parentH, setParentH] = React.useState(0);

//   const x = useSharedValue(0);
//   const y = useSharedValue(0);
//   const prevX = useSharedValue(0);
//   const prevY = useSharedValue(0);

//   const scale = useSharedValue(1);
//   const baseScale = useSharedValue(1);

//   const didInit = useSharedValue(false);

//   const clamp = (v: number, min: number, max: number) => {
//     "worklet";
//     return Math.min(Math.max(v, min), max);
//   };

//   const pan = Gesture.Pan()
//     .onStart(() => {
//       prevX.value = x.value;
//       prevY.value = y.value;
//     })
//     .onUpdate((e) => {
//       const size = BASE_SIZE * scale.value;

//       x.value = clamp(prevX.value + e.translationX, 0, parentW - size);
//       y.value = clamp(prevY.value + e.translationY, 0, parentH - size);
//     });

//   const pinch = Gesture.Pinch()
//     .onUpdate((e) => {
//       scale.value = clamp(baseScale.value * e.scale, MIN_SCALE, MAX_SCALE);
//     })
//     .onEnd(() => {
//       baseScale.value = scale.value;

//       const size = BASE_SIZE * scale.value;

//       x.value = clamp(x.value, 0, parentW - size);
//       y.value = clamp(y.value, 0, parentH - size);
//     });

//   const gesture = Gesture.Simultaneous(pan, pinch);

//   const style = useAnimatedStyle(() => {
//     const size = BASE_SIZE * scale.value;

//     return {
//       width: size,
//       height: size,
//       transform: [{ translateX: x.value }, { translateY: y.value }],
//     };
//   });

//   return (
//     <View
//       style={styles.container}
//       onLayout={(e: LayoutChangeEvent) => {
//         const w = e.nativeEvent.layout.width;
//         const h = e.nativeEvent.layout.height;

//         setParentW(w);
//         setParentH(h);

//         if (!didInit.value) {
//           didInit.value = true;

//           x.value = (w - BASE_SIZE) / 2;
//           y.value = (h - BASE_SIZE) / 2;

//           prevX.value = x.value;
//           prevY.value = y.value;
//         }
//       }}
//     >
//       <GestureDetector gesture={gesture}>
//         <Animated.View style={[styles.box, style]}>{children}</Animated.View>
//       </GestureDetector>
//     </View>
//   );
// };

// export default Movable;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: "relative",
//   },
//   box: {
//     backgroundColor: "tomato",
//     borderRadius: 8,
//     position: "absolute",
//     top: 0,
//     left: 0,
//   },
// });

import React from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const BASE_SIZE = 100;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;

export interface MovableProps {
  children?: React.ReactNode;
  parentW: number;
  parentH: number;
  initialX?: number;
  initialY?: number;
}

const Movable: React.FC<MovableProps> = ({
  children,
  parentW,
  parentH,
  initialX = 0,
  initialY = 0,
}) => {
  // Hooks are unconditional
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

  // Pan gesture
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

  // Pinch gesture
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

  const style = useAnimatedStyle(() => {
    const size = BASE_SIZE * scale.value;
    return {
      width: size,
      height: size,
      transform: [{ translateX: x.value }, { translateY: y.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.box, style]}>{children}</Animated.View>
    </GestureDetector>
  );
};

export default Movable;

const styles = StyleSheet.create({
  box: {
    position: "absolute",
    borderRadius: 8,
    backgroundColor: "transparent",
  },
});
