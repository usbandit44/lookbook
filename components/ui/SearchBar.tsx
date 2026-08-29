import { AppIcon } from "@/components/ui/AppIcon";
import { Theme } from "@/constants/themes";
import { useTheme } from "@/hooks/ThemeProvider";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import AppButton from "./AppButton";

const SearchBar: React.FC<{
  value: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}> = (props) => {
  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);

  const [showClear, setShowClear] = useState(false);
  return (
    <View style={styles.searchbar}>
      <AppIcon name="search" />

      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={t.inkA[38]} // rgba(10,10,10,.40)
        style={[theme.text.p4, styles.input]}
        onFocus={() => {
          setShowClear(true);
        }}
        onBlur={() => {
          setShowClear(false);
        }}
      ></TextInput>
      {!showClear ? null : (
        <AppButton
          type="icon"
          onPress={() => {
            props.onChangeText("");
          }}
          icon={<AppIcon name={"close"}></AppIcon>}
        />
      )}
    </View>
  );
};

export default SearchBar;

const s = (t: Theme) =>
  StyleSheet.create({
    searchbar: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: t.surfaceSunken,
      borderWidth: 1,
      borderColor: t.inkA[12],
      height: 42,
      paddingHorizontal: 10,
    },
    input: { flex: 1 },
  });
