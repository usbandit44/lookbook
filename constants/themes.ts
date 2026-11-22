import { defineTheme, Theme } from "@/functions/themeBuilder";

export const themes = {
  default: defineTheme({
    palette: {
      ink: "#0A0A0A",
      inkAlt: "#101010",
      surface: "#FFFFFF",
      surfaceSunken: "#F5F5F6",
      surfaceAlt: "#F6F5F3",
      onInk: "#FFFFFF",
      danger: "#C4291C",
      dangerPress: "#B3261E",
    },
    fonts: {
      display: "Archivo-Bold",
      heading: "Archivo-SemiBold",
      title: "Archivo-Medium",
      body: "Archivo-Regular",
      label: "IBMPlexMono-Medium",
      labelBold: "IBMPlexMono-SemiBold",
      labelCase: "uppercase",
      tracking: 1,
    },
  }),

  popMaximal: defineTheme({
    palette: {
      ink: "#1B1E9E",
      inkAlt: "#12124A",
      surface: "#FFD23F",
      surfaceSunken: "#FFF1C9",
      surfaceAlt: "#C8FF5A",
      onInk: "#FFFFFF",
      accent: "#FF2E93",
      onAccent: "#1A1050",
      danger: "#D4143A",
      dangerPress: "#B80F30",
    },
    fonts: {
      display: "Fredoka-Bold",
      heading: "Fredoka-SemiBold",
      title: "Fredoka-Medium",
      body: "Fredoka-Regular",
      label: "BarlowSemiCondensed-SemiBold",
      labelBold: "BarlowSemiCondensed-Bold",
      labelCase: "uppercase",
      tracking: 1,
    },
    shape: {
      radius: { control: 999, chip: 999, field: 14, tile: 16 },
      borderWidth: 2,
      tilt: 0,
      shadow: {
        control: { x: 3, y: 3, blur: 0, color: "#1B1E9E" },
        tile: { x: 4, y: 4, blur: 0, color: "#1B1E9E" },
        image: null,
      },
    },
    text: () => ({
      p1: { letterSpacing: 1.5 },
      m10: { fontSize: 11 },
      m11: { fontSize: 11 },
    }),
  }),

  scrapbook: defineTheme({
    palette: {
      ink: "#221C16",
      inkAlt: "#1E1914",
      surface: "#F3E9D2",
      surfaceSunken: "#E6D5B5",
      surfaceAlt: "#F0D9A8",
      onInk: "#F3E9D2",
      accent: "#2F6F73",
      onAccent: "#FFF6E3",
      danger: "#B8322A",
      dangerPress: "#9E2B24",
    },
    fonts: {
      display: "PermanentMarker-Regular",
      heading: "Caveat-Bold",
      title: "Caveat-SemiBold",
      body: "CourierPrime-Regular",
      label: "SpecialElite-Regular",
      labelBold: "SpecialElite-Regular",
      labelCase: "uppercase",
      tracking: 0.6,
    },
    shape: {
      radius: { control: 3, chip: 2, field: 3, tile: 2 },
      borderWidth: 1,
      tilt: 1.4,
      shadow: {
        control: null,
        tile: { x: 1, y: 3, blur: 8, color: "rgba(34, 28, 22, 0.22)" },
        image: { x: 3, y: 7, blur: 16, color: "rgba(34, 28, 22, 0.42)" },
      },
    },
    text: () => ({
      p1: { fontSize: 28, letterSpacing: 2 },
      p2: { fontSize: 36, lineHeight: 32, letterSpacing: 0 },
      p3: { fontSize: 27 },
      p4: { fontSize: 14 },
    }),
  }),
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof themes;
