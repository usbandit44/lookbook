import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

const AppModal: React.FC<{
  children: React.ReactNode;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  style?: {};
}> = (props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.setModalVisible(!props.modalVisible);
      }}
    >
      <Pressable
        style={styles.centeredView}
        onPress={() => {
          props.setModalVisible(!props.modalVisible);
        }}
      >
        <View style={[styles.modalView, props.style]}>{props.children}</View>
      </Pressable>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 35,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    gap: 15,
  },
});
