// import React from "react";
// import { Modal, Pressable, StyleSheet, View } from "react-native";

// const AppModal: React.FC<{
//   children: React.ReactNode;
//   modalVisible: boolean;
//   setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
//   style?: {};
// }> = (props) => {
//   return (
//     <Modal
//       animationType="fade"
//       transparent={true}
//       visible={props.modalVisible}
//       onRequestClose={() => {
//         props.setModalVisible(!props.modalVisible);
//       }}
//     >
//       <Pressable
//         style={styles.centeredView}
//         onPress={() => {
//           props.setModalVisible(!props.modalVisible);
//         }}
//       >
//         <View style={[styles.modalView, props.style]}>{props.children}</View>
//       </Pressable>
//     </Modal>
//   );
// };

// export default AppModal;

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalView: {
//     backgroundColor: "white",
//     borderRadius: 8,
//     padding: 35,
//     alignItems: "center",
//     width: "80%",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,

//     gap: 15,
//   },
// });

import { Theme } from "@/constants/themes";
import { useTheme } from "@/hooks/ThemeProvider";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal, Pressable, StyleSheet } from "react-native";

const AppModal: React.FC<{
  children: React.ReactNode;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  style?: object;
}> = (props) => {
  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => props.setModalVisible(false)}
    >
      <Pressable
        style={styles.backdrop}
        onPress={() => props.setModalVisible(false)}
      >
        <BlurView intensity={10} tint="light" style={styles.blur}>
          {/* inner Pressable with a no-op onPress absorbs the touch so tapping
            inside the card doesn't fall through and dismiss the modal */}
          <Pressable style={[styles.modalView, props.style]} onPress={() => {}}>
            {props.children}
          </Pressable>
        </BlurView>
      </Pressable>
    </Modal>
  );
};

export default AppModal;

const s = (t: Theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: t.inkA[40],
    },
    blur: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "stretch",
    },
    modalView: {
      backgroundColor: t.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: t.whiteA[60],
      marginHorizontal: 20, // keeps it off the left/right edges too
      marginBottom: 40, // the bottom gap you asked for
      shadowColor: "#0A0A0A",
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.22,
      shadowRadius: 22, // RN radius ≈ CSS blur / 2
      elevation: 16,
      gap: 15,
    },
  });
