// import { StyleSheet, View } from "react-native";
// import { Gesture, GestureDetector } from "react-native-gesture-handler";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from "react-native-reanimated";

// const BOX_SIZE = 100;

// const Movable: React.FC<{
//   children?: React.ReactNode;
// }> = (props) => {
//   // Translation for drag
//   const translationX = useSharedValue(0);
//   const translationY = useSharedValue(0);
//   const prevX = useSharedValue(0);
//   const prevY = useSharedValue(0);

//   // Scale for pinch
//   const scale = useSharedValue(1);
//   const baseScale = useSharedValue(1);

//   // Pan gesture (drag)
//   const pan = Gesture.Pan()
//     .onStart(() => {
//       prevX.value = translationX.value;
//       prevY.value = translationY.value;
//     })
//     .onUpdate((event) => {
//       translationX.value = prevX.value + event.translationX;
//       translationY.value = prevY.value + event.translationY;
//     });

//   // Pinch gesture (scale)
//   const pinch = Gesture.Pinch()
//     .onUpdate((event) => {
//       scale.value = baseScale.value * event.scale;
//     })
//     .onEnd(() => {
//       // Smoothly snap scale back if needed
//       baseScale.value = scale.value;
//       scale.value = withSpring(baseScale.value, {
//         damping: 15,
//         stiffness: 120,
//       });
//     });

//   // Combine gestures: pinch + pan
//   const gesture = Gesture.Simultaneous(pan, pinch);

//   // Animated style
//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [
//       { translateX: translationX.value },
//       { translateY: translationY.value },
//       { scale: scale.value },
//     ],
//   }));

//   return (
//     <View style={styles.container}>
//       <GestureDetector gesture={gesture}>
//         <Animated.View style={[styles.box, animatedStyle]}>
//           {props.children}
//         </Animated.View>
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
//     width: BOX_SIZE,
//     height: BOX_SIZE,
//     backgroundColor: "tomato",
//     borderRadius: 8,
//     position: "absolute",
//     top: 0,
//     left: 0,
//   },
// });

import React from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const BOX_SIZE = 100;

const Movable: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [parentWidth, setParentWidth] = React.useState(0);
  const [parentHeight, setParentHeight] = React.useState(0);

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevX = useSharedValue(0);
  const prevY = useSharedValue(0);

  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);

  // Worklet clamp function
  const clamp = (value: number, min: number, max: number) => {
    "worklet";
    return Math.min(Math.max(value, min), max);
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      prevX.value = translationX.value;
      prevY.value = translationY.value;
    })
    .onUpdate((event) => {
      const scaledSize = BOX_SIZE * scale.value;
      translationX.value = clamp(
        prevX.value + event.translationX,
        0,
        Math.max(parentWidth - scaledSize, 0)
      );
      translationY.value = clamp(
        prevY.value + event.translationY,
        0,
        Math.max(parentHeight - scaledSize, 0)
      );
    });

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = baseScale.value * event.scale;
    })
    .onEnd(() => {
      baseScale.value = scale.value;
      scale.value = withSpring(baseScale.value, {
        damping: 15,
        stiffness: 120,
      });

      // Clamp after scaling
      const scaledSize = BOX_SIZE * scale.value;
      translationX.value = clamp(
        translationX.value,
        0,
        Math.max(parentWidth - scaledSize, 0)
      );
      translationY.value = clamp(
        translationY.value,
        0,
        Math.max(parentHeight - scaledSize, 0)
      );
    });

  const gesture = Gesture.Simultaneous(pan, pinch);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View
      style={styles.container}
      onLayout={(e: LayoutChangeEvent) => {
        setParentWidth(e.nativeEvent.layout.width);
        setParentHeight(e.nativeEvent.layout.height);

        // Optional: start centered
        translationX.value = (e.nativeEvent.layout.width - BOX_SIZE) / 2;
        translationY.value = (e.nativeEvent.layout.height - BOX_SIZE) / 2;
      }}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.box, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default Movable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: "tomato",
    borderRadius: 8,
    position: "absolute",
    top: 0,
    left: 0,
  },
});
