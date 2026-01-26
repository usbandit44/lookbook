// import React from "react";
// import { Pressable, StyleSheet } from "react-native";

// type ButtonType = "primary" | "secondary" | "icon" | "text";

// const AppButton: React.FC<{
//   children: React.ReactNode;
//   onPress?: () => void;
//   containWidth?: boolean;
//   type?: ButtonType;
// }> = ({ type = "primary", ...props }) => {
//   let hugging = {};
//   if (props.containWidth) {
//     hugging = { alignSelf: "flex-start" };
//   }

//   let typeStyling = {};

//   switch (type) {
//     case "primary":
//       typeStyling = {
//         backgroundColor: "#090a0a",

//         padding: 15,
//         paddingLeft: 25,
//         paddingRight: 25,
//       };
//       break;
//     case "secondary":
//       typeStyling = {
//         padding: 15,
//         paddingLeft: 25,
//         paddingRight: 25,
//       };
//       break;
//     case "icon":
//       typeStyling = { padding: 10 };
//       hugging = { alignSelf: "flex-start" };
//       break;
//     case "text":
//       typeStyling = { padding: 10 };

//       break;
//     default:
//       break;
//   }
//   return (
//     <Pressable onPress={props.onPress} style={[styles.mainButton, typeStyling]}>
//       {props.children}
//     </Pressable>
//   );
// };

// export default AppButton;

// const styles = StyleSheet.create({
//   mainButton: {
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 8,
//     flexDirection: "row",
//     gap: 8,
//   },
// });

import React from "react";
import { Pressable, StyleSheet } from "react-native";

type ButtonType = "primary" | "secondary" | "icon" | "text";

const AppButton: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  /** when true → full width (100%), when false/undefined → hug content */
  fullWidth?: boolean;
  type?: ButtonType;
}> = ({ type = "primary", fullWidth = false, ...props }) => {
  const widthStyle = fullWidth ? { alignSelf: "stretch" } : {};

  let typeStyling: any = {};

  switch (type) {
    case "primary":
      typeStyling = {
        backgroundColor: "#090a0a",
        padding: 15,
        paddingLeft: 25,
        paddingRight: 25,
      };
      break;
    case "secondary":
      typeStyling = {
        padding: 15,
        paddingLeft: 25,
        paddingRight: 25,
        borderWidth: 1,
      };
      break;
    case "icon":
      typeStyling = { padding: 10 };
      break;
    case "text":
      typeStyling = { padding: 10 };
      break;
    default:
      break;
  }

  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.mainButton, widthStyle, typeStyling]}
    >
      {props.children}
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  mainButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
  },
});
