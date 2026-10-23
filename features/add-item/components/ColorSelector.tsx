import Swatch from "@/components/ui/Swatch";
import { useTheme } from "@/hooks/ThemeProvider";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const ColorSelector: React.FC<{
  label: string;
  onPress?: () => void;
  selected: boolean;
}> = ({ ...props }) => {
  const { theme } = useTheme();
  let label;
  let container;
  if (props.selected) {
    label = { color: theme.onInk };
    container = {
      backgroundColor: theme.ink,
      padding: 15,
    };
  } else {
    label = { color: theme.ink };
    container = {
      padding: 15,

      borderWidth: 1,
      borderColor: theme.inkA[20],
    };
  }
  return (
    <Pressable
      onPress={props.onPress}
      style={[
        props.selected ? styles.selectedContainer : styles.notSelectedContainer,
        container,
      ]}
    >
      <Swatch color={props.label} width={14} height={14}></Swatch>
      <Text
        style={[
          props.selected ? styles.selectedLabel : styles.notSelectedLabel,
          label,
        ]}
      >
        {props.label}
      </Text>
    </Pressable>
  );
};

export default ColorSelector;

const styles = StyleSheet.create({
  selectedContainer: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    flexDirection: "row",
    gap: 9,
    height: "auto",
  },
  notSelectedContainer: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    flexDirection: "row",
    gap: 9,
    height: "auto",
  },
  selectedLabel: {
    fontFamily: "IBMPlexMono-SemiBold",
    fontSize: 12,
    letterSpacing: 1.2, // .12em × 10px
    textAlign: "center",
    textTransform: "uppercase",
  },
  notSelectedLabel: {
    fontFamily: "IBMPlexMono-SemiBold",
    fontSize: 12,
    letterSpacing: 1.2, // .12em × 10px
    textAlign: "center",
    textTransform: "uppercase",
  },
});
