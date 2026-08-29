import { itemColors } from "@/constants/constants";
import { useTheme } from "@/hooks/ThemeProvider";
import React from "react";
import { StyleSheet, View } from "react-native";

type ItemColor = (typeof itemColors)[number];

/** Garment content colours — not themed. A red coat is red in dark mode too. */
const itemColorHex: Record<ItemColor, string> = {
  White: "#FFFFFF",
  Black: "#161616", // not pure black, so it separates from t.ink when selected
  Grey: "#8A8A8A",
  Khaki: "#C9BB9B",
  Brown: "#6B4A2E",
  Blue: "#2F4A7A",
  Green: "#3C5E43",
  Red: "#9B3B32",
  Pink: "#D9A2A6",
  Yellow: "#D9B44A",
  Orange: "#C4703A",
  Purple: "#6A4B7A",
  Silver: "#C2C4C6",
  Gold: "#B08D4F",
  Multicolor: "transparent", // drawn as four quadrants, see multicolorSegments
};

/** Quadrants for the Multicolor swatch tile. */
const multicolorSegments = ["#9B3B32", "#D9B44A", "#3C5E43", "#2F4A7A"];

const Swatch: React.FC<{ color: string; width: number; height: number }> = ({
  color,
  width,
  height,
}) => {
  const { theme } = useTheme();

  if (color === "Multicolor") {
    return (
      <View
        style={[
          styles.container,
          styles.multi,
          { width, height, borderColor: theme.inkA[20] },
        ]}
      >
        {multicolorSegments.map((c) => (
          <View
            key={c}
            style={{ width: "50%", height: "50%", backgroundColor: c }}
          />
        ))}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderColor: theme.inkA[20],
          backgroundColor: itemColorHex[color as ItemColor],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  multi: {
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
  },
});
export default Swatch;
