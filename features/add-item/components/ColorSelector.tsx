// import Swatch from "@/components/ui/Swatch";
// import { Theme } from "@/functions/themeBuilder";
// import { useTheme } from "@/hooks/ThemeProvider";
// import React from "react";
// import { Pressable, StyleSheet, Text } from "react-native";

// const ColorSelector: React.FC<{
//   label: string;
//   onPress?: () => void;
//   selected: boolean;
// }> = ({ ...props }) => {
//   const { theme } = useTheme();
//   const t = theme;
//   const styles = s(t);
//   let label;
//   let container;
//   if (props.selected) {
//     label = { color: theme.onAccent };
//     container = {
//       backgroundColor: theme.accent,
//       padding: 15,
//     };
//   } else {
//     label = { color: theme.ink };
//     container = {
//       padding: 15,

//       borderWidth: theme.shape.borderWidth,
//       borderColor: theme.inkA[20],
//     };
//   }
//   return (
//     <Pressable
//       onPress={props.onPress}
//       style={[
//         props.selected ? styles.selectedContainer : styles.notSelectedContainer,
//         container,
//       ]}
//     >
//       <Swatch color={props.label} width={14} height={14}></Swatch>
//       <Text
//         style={[
//           props.selected ? styles.selectedLabel : styles.notSelectedLabel,
//           label,
//         ]}
//       >
//         {props.label}
//       </Text>
//     </Pressable>
//   );
// };

// export default ColorSelector;

// const s = (t: Theme) =>
//   StyleSheet.create({
//     selectedContainer: {
//       justifyContent: "center",
//       alignItems: "center",
//       textAlign: "center",
//       flexDirection: "row",
//       gap: 9,
//       height: "auto",
//       borderRadius: t.shape.radius.control,
//     },
//     notSelectedContainer: {
//       justifyContent: "center",
//       alignItems: "center",
//       textAlign: "center",
//       flexDirection: "row",
//       gap: 9,
//       height: "auto",
//       borderRadius: t.shape.radius.control,
//     },
//     selectedLabel: {
//       fontFamily: "IBMPlexMono-SemiBold",
//       fontSize: 12,
//       letterSpacing: 1.2, // .12em × 10px
//       textAlign: "center",
//       textTransform: "uppercase",
//     },
//     notSelectedLabel: {
//       fontFamily: "IBMPlexMono-SemiBold",
//       fontSize: 12,
//       letterSpacing: 1.2, // .12em × 10px
//       textAlign: "center",
//       textTransform: "uppercase",
//     },
//   });
