import FormErrorAlert from "@/components/ui/FormErrorAlert";
import React from "react";
import { StyleSheet, View } from "react-native";

const FormElement: React.FC<{
  children: React.ReactNode;
  showError: boolean;
  errorMsg: string;
}> = (props) => {
  return (
    <View style={styles.container}>
      {props.children}
      <FormErrorAlert show={props.showError}>{props.errorMsg}</FormErrorAlert>
    </View>
  );
};

export default FormElement;

const styles = StyleSheet.create({ container: { width: "100%", gap: 5 } });
