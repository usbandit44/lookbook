// // import React from "react";
// // import { Pressable, StyleSheet } from "react-native";
// // import { Icon } from "react-native-elements";
// // import { Gesture, GestureDetector } from "react-native-gesture-handler";
// // import Animated, {
// //   useAnimatedStyle,
// //   useSharedValue,
// // } from "react-native-reanimated";

// // const BASE_SIZE = 100;
// // const MIN_SCALE = 0.5;
// // const MAX_SCALE = 2.5;

// // export interface MovableProps {
// //   children?: React.ReactNode;
// //   parentW: number;
// //   parentH: number;
// //   initialX?: number;
// //   initialY?: number;
// // }

// // const Movable: React.FC<MovableProps> = ({
// //   children,
// //   parentW,
// //   parentH,
// //   initialX = 0,
// //   initialY = 0,
// // }) => {
// //   const x = useSharedValue(initialX);
// //   const y = useSharedValue(initialY);
// //   const prevX = useSharedValue(initialX);
// //   const prevY = useSharedValue(initialY);

// //   const scale = useSharedValue(1);
// //   const baseScale = useSharedValue(1);

// //   const clamp = (v: number, min: number, max: number) => {
// //     "worklet";
// //     return Math.min(Math.max(v, min), max);
// //   };

// //   // ─────────────────────
// //   // Gestures
// //   // ─────────────────────
// //   const pan = Gesture.Pan()
// //     .onStart(() => {
// //       prevX.value = x.value;
// //       prevY.value = y.value;
// //     })
// //     .onUpdate((e) => {
// //       const size = BASE_SIZE * scale.value;
// //       x.value = clamp(prevX.value + e.translationX, 0, parentW - size);
// //       y.value = clamp(prevY.value + e.translationY, 0, parentH - size);
// //     });

// //   const pinch = Gesture.Pinch()
// //     .onUpdate((e) => {
// //       scale.value = clamp(baseScale.value * e.scale, MIN_SCALE, MAX_SCALE);
// //     })
// //     .onEnd(() => {
// //       baseScale.value = scale.value;
// //       const size = BASE_SIZE * scale.value;
// //       x.value = clamp(x.value, 0, parentW - size);
// //       y.value = clamp(y.value, 0, parentH - size);
// //     });

// //   const gesture = Gesture.Simultaneous(pan, pinch);

// //   // ─────────────────────
// //   // Animated styles
// //   // ─────────────────────
// //   const boxStyle = useAnimatedStyle(() => {
// //     const size = BASE_SIZE * scale.value;
// //     return {
// //       width: size,
// //       height: size,
// //       transform: [{ translateX: x.value }, { translateY: y.value }],
// //     };
// //   });

// //   /**
// //    * IMPORTANT:
// //    * - reverse icon white circle cannot be resized directly
// //    * - so we start smaller + grow slower
// //    */
// //   const iconStyle = useAnimatedStyle(() => {
// //     const iconScale = Math.min(
// //       Math.pow(scale.value, 0.6) * 0.7, // slow growth + smaller base
// //       1.1, // max size cap
// //     );

// //     return {
// //       transform: [{ scale: iconScale }],
// //     };
// //   });

// //   // ─────────────────────
// //   // Render
// //   // ─────────────────────
// //   return (
// //     <GestureDetector gesture={gesture}>
// //       <Animated.View style={[styles.box, boxStyle]}>
// //         {/* Close button */}
// //         <Pressable hitSlop={14} style={styles.clearIconWrapper}>
// //           <Animated.View style={iconStyle}>
// //             <Icon
// //               reverse
// //               name="close"
// //               type="material"
// //               color="black"
// //               size={14}
// //             />
// //           </Animated.View>
// //         </Pressable>

// //         {children}
// //       </Animated.View>
// //     </GestureDetector>
// //   );
// // };

// // export default Movable;

// // // ─────────────────────
// // // Styles
// // // ─────────────────────
// // const styles = StyleSheet.create({
// //   box: {
// //     position: "absolute",
// //     borderRadius: 8,
// //     backgroundColor: "transparent",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   // Only positions the icon (not scaled)
// //   clearIconWrapper: {
// //     position: "absolute",
// //     top: -16,
// //     right: -16,
// //     zIndex: 2,
// //   },
// // });

// import React from "react";
// import { Pressable, StyleSheet } from "react-native";
// import { Icon } from "react-native-elements";
// import { Gesture, GestureDetector } from "react-native-gesture-handler";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
// } from "react-native-reanimated";

// const BASE_SIZE = 100;
// const MIN_SCALE = 0.5;
// const MAX_SCALE = 2.5;

// export interface MovableProps {
//   children?: React.ReactNode;
//   parentW: number;
//   parentH: number;
//   initialX?: number;
//   initialY?: number;
// }

// const Movable: React.FC<MovableProps> = ({
//   children,
//   parentW,
//   parentH,
//   initialX = 0,
//   initialY = 0,
// }) => {
//   const x = useSharedValue(initialX);
//   const y = useSharedValue(initialY);
//   const prevX = useSharedValue(initialX);
//   const prevY = useSharedValue(initialY);

//   const scale = useSharedValue(1);
//   const baseScale = useSharedValue(1);

//   const clamp = (v: number, min: number, max: number) => {
//     "worklet";
//     return Math.min(Math.max(v, min), max);
//   };

//   // ────────────── Gestures ──────────────
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

//   // ────────────── Animated Styles ──────────────
//   const boxStyle = useAnimatedStyle(() => ({
//     width: BASE_SIZE * scale.value,
//     height: BASE_SIZE * scale.value,
//     transform: [{ translateX: x.value }, { translateY: y.value }],
//   }));

//   // Only scale the icon itself
//   const iconStyle = useAnimatedStyle(() => {
//     const iconScale = Math.min(Math.pow(scale.value, 0.6) * 0.7, 1.1);
//     return {
//       transform: [{ scale: iconScale }],
//     };
//   });

//   // ────────────── Render ──────────────
//   return (
//     <GestureDetector gesture={gesture}>
//       <Animated.View style={[styles.box, boxStyle]}>
//         {children}

//         {/* Icon stays pinned to top-right */}
//         <Pressable hitSlop={14} style={styles.clearIconWrapper}>
//           <Animated.View style={iconStyle}>
//             <Icon
//               reverse
//               name="close"
//               type="material"
//               color="black"
//               size={14}
//             />
//           </Animated.View>
//         </Pressable>
//       </Animated.View>
//     </GestureDetector>
//   );
// };

// export default Movable;

// // ────────────── Styles ──────────────
// const styles = StyleSheet.create({
//   box: {
//     position: "absolute",
//     borderRadius: 8,
//     backgroundColor: "transparent",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   // Fixed wrapper in top-right corner, does not move or scale
//   clearIconWrapper: {
//     position: "absolute",
//     top: -30,
//     right: -16,
//     zIndex: 2,
//   },
// });

import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
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
  onClear?: () => void;
}

const Movable: React.FC<MovableProps> = ({
  children,
  parentW,
  parentH,
  initialX = 0,
  initialY = 0,
  onClear,
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

  // Scale the icon but keep its position pinned
  const iconScaleStyle = useAnimatedStyle(() => {
    const iconScale = Math.min(Math.pow(scale.value, 0.6) * 0.7, 1.1);
    return {
      transform: [{ scale: iconScale }],
    };
  });

  // Wrapper follows top-right corner exactly
  const iconWrapperStyle = useAnimatedStyle(() => {
    const size = BASE_SIZE * scale.value;
    const iconSize = 14; // Icon size in px
    // Position the icon so its center sits at the top-right corner
    return {
      position: "absolute",
      top: -iconSize * 2.5,
      right: -iconSize * 2,
    };
  });

  // ────────────── Render ──────────────
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.box, boxStyle]}>
        {children}

        {/* Close icon stays pinned to top-right */}
        <Animated.View style={iconWrapperStyle}>
          <Pressable hitSlop={14} onPress={onClear}>
            <Animated.View style={iconScaleStyle}>
              <Icon
                reverse
                name="close"
                type="material"
                color="black"
                size={14}
              />
            </Animated.View>
          </Pressable>
        </Animated.View>
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
});
