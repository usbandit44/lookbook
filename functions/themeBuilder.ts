import { AlphaRamp, CSSColor } from "@/constants/types";
import type { TextStyle, ViewStyle } from "react-native";

/** One text style — metrics and colour. Components never pass `color`. */
export type TypeToken = Pick<
  TextStyle,
  | "fontFamily"
  | "fontSize"
  | "lineHeight"
  | "letterSpacing"
  | "textTransform"
  | "color"
>;

/** Shared metrics, colour applied per token. */
type Metrics = Omit<TypeToken, "color">;

export type ThemeText = {
  /* prose, names, values */
  p1: TypeToken; // LOOKBOOK wordmark
  p2: TypeToken; // outfit name / screen heading
  p3: TypeToken; // list row title (piece label)
  p4: TypeToken; // input text, dropdown row, default body
  p5: TypeToken; // empty-state body (multi-line)
  p6: TypeToken; // hint / "No matching tags"

  /* labels, meta */
  m1: TypeToken; // empty-state title
  m2: TypeToken; // screen title (PIECE, OUTFIT, ADD ITEM)
  m3: TypeToken; // button label, primary (on accent fill)
  m4: TypeToken; // filter chip, idle
  m5: TypeToken; // section label (TYPE, COLOUR)
  m6: TypeToken; // text link, + ADD TAG
  m7: TypeToken; // header count
  m10: TypeToken; // tile caption
  m11: TypeToken; // row meta
  m13: TypeToken; // button label, secondary (outlined on surface)
  m14: TypeToken; // button label, disabled / ghost
  m16: TypeToken; // filter chip, selected (on accent fill)
  m19: TypeToken; // button label on dark surface (CANCEL)
  m22: TypeToken; // sheet header
};

/** The colour half of a theme. */
export type ThemeColors = {
  /** Highest-contrast foreground: text, icon strokes. */
  ink: CSSColor;
  /** Secondary dark surface (immersive/camera screens). */
  inkAlt: CSSColor;
  /** Default page/screen surface. */
  surface: CSSColor;
  /** Recessed fields, tiles, wells. */
  surfaceSunken: CSSColor;
  /** Optional third surface (warm/tinted rows). */
  surfaceAlt?: CSSColor;
  /** Foreground on `ink`. */
  onInk: CSSColor;

  /** NEW — primary fills (buttons, selected chips, FAB). */
  accent: CSSColor;
  /** NEW — foreground on `accent`. */
  onAccent: CSSColor;

  danger: CSSColor;
  dangerPress: CSSColor;
  success?: CSSColor;
  warning?: CSSColor;

  /** Derive greys from these ramps, never new hexes. */
  inkA: AlphaRamp;
  whiteA: AlphaRamp;
  /** NEW — the accent colour at opacity: tinted chips, focus rings, soft fills. */
  accentA: AlphaRamp;
  /** NEW — the surface colour at opacity: glass tab bar, menus, badges over imagery. */
  surfaceA: AlphaRamp;
};

type Shadow = { x: number; y: number; blur: number; color: CSSColor } | null;

export const pad = (blur: number = 0): number => Math.max(15, blur * 0.6);

/** NEW — everything colour and type can't say. */
export type ThemeShape = {
  radius: { control: number; chip: number; field: number; tile: number };
  borderWidth: number;
  /** Degrees; tiles alternate ±tilt. */
  tilt: number;
  shadow: { control: Shadow; tile: Shadow; image: Shadow };
};

export type Theme = ThemeColors & {
  /** Every text style in the app. Never inline a font size or a colour. */
  text: ThemeText;
  shape: ThemeShape;
  /** Drives the status bar and the keyboard appearance. */
  scheme: "light" | "dark";
};

/* ---------- colours ---------- */

const INK_STEPS = [
  7, 8, 9, 10, 12, 14, 16, 18, 20, 30, 35, 38, 40, 42, 45, 50, 55, 60, 65,
] as const;
const WHITE_STEPS = [7, 16, 30, 40, 50, 55, 60, 65, 70, 80, 85, 90] as const;
const SURFACE_STEPS = [46, 50, 60, 90] as const;
const ACCENT_STEPS = [7, 10, 12, 16, 20, 30, 40, 50, 60, 70, 80] as const;

const rgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
};

/** ramp("#0A0A0A", [9]) -> { 9: "rgba(10, 10, 10, 0.09)" } */
const ramp = (hex: string, steps: readonly number[]): AlphaRamp => {
  const [r, g, b] = rgb(hex);
  const out: AlphaRamp = {};
  for (const s of steps) {
    out[s] = `rgba(${r}, ${g}, ${b}, ${(s / 100).toFixed(2)})` as CSSColor;
  }
  return out;
};

/** What you write by hand for a theme; ramps and fill fallbacks are derived. */
type Palette = Omit<
  ThemeColors,
  "inkA" | "whiteA" | "accentA" | "surfaceA" | "accent" | "onAccent"
> & {
  ink: `#${string}`;
  surface: `#${string}`;
  accent?: `#${string}`;
  onAccent?: CSSColor;
};

const makeColors = (p: Palette): ThemeColors => {
  const accent = p.accent ?? p.ink;
  return {
    ...p,
    accent,
    onAccent: p.onAccent ?? p.onInk,
    inkA: ramp(p.ink, INK_STEPS),
    whiteA: ramp("#FFFFFF", WHITE_STEPS),
    accentA: ramp(accent, ACCENT_STEPS),
    surfaceA: ramp(p.surface, SURFACE_STEPS),
  };
};

/* ---------- type, built from the colours ---------- */

/** Which bundled font file plays each role. */
type FontSet = {
  display: string; // p1
  heading: string; // p2
  title: string; // p3
  body: string; // p4–p6
  label: string; // meta, counts
  labelBold: string; // buttons, chips, section labels
  labelCase: NonNullable<TextStyle["textTransform"]>;
  /** Multiplier on label letter-spacing (1 = the original). */
  tracking: number;
};

type TextTweaks = (
  c: ThemeColors,
) => Partial<Record<keyof ThemeText, Partial<TypeToken>>>;

const makeText = (
  c: ThemeColors,
  f: FontSet,
  tweak?: TextTweaks,
): ThemeText => {
  const k = f.tracking;
  const button: Metrics = {
    fontFamily: f.labelBold,
    fontSize: 12,
    lineHeight: 13,
    letterSpacing: 1.2 * k,
    textTransform: f.labelCase,
  };
  const filterChip: Metrics = { ...button, letterSpacing: 1 * k };
  const chip: Metrics = { ...button, lineHeight: 12 };
  const meta: Metrics = {
    fontFamily: f.label,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.85 * k,
    textTransform: f.labelCase,
  };
  const eyebrow: Metrics = {
    fontFamily: f.labelBold,
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 1.54 * k,
    textTransform: f.labelCase,
  };

  const text: ThemeText = {
    p1: {
      fontFamily: f.display,
      fontSize: 30,
      lineHeight: 30,
      letterSpacing: 5.72,
      textTransform: "uppercase",
      color: c.ink,
    },
    p2: {
      fontFamily: f.heading,
      fontSize: 30,
      lineHeight: 27.6,
      letterSpacing: -0.23,
      color: c.ink,
    },
    p3: { fontFamily: f.title, fontSize: 22, lineHeight: 25, color: c.ink },
    p4: { fontFamily: f.body, fontSize: 15, lineHeight: 18, color: c.ink },
    p5: { fontFamily: f.body, fontSize: 14, lineHeight: 20, color: c.inkA[50] },
    p6: { fontFamily: f.body, fontSize: 14, lineHeight: 16, color: c.inkA[40] },

    m1: { ...eyebrow, color: c.ink },
    m2: { ...button, letterSpacing: 1.6 * k, color: c.inkA[45] },
    m3: { ...button, color: c.onAccent },
    m4: { ...filterChip, color: c.ink },
    m5: { ...chip, letterSpacing: 1.235 * k, color: c.inkA[42] },
    m6: {
      fontFamily: f.labelBold,
      fontSize: 12,
      letterSpacing: 1.2 * k,
      textTransform: f.labelCase,
      color: c.inkA[55],
    },
    m7: {
      fontFamily: f.label,
      fontSize: 12,
      lineHeight: 12,
      letterSpacing: 0.76 * k,
      textTransform: f.labelCase,
      color: c.inkA[45],
    },
    m10: { ...meta, letterSpacing: 0.765 * k, color: c.inkA[60] },
    m11: { ...meta, color: c.inkA[45] },
    m13: { ...button, color: c.ink },
    m14: { ...button, color: c.inkA[30] },
    m16: { ...filterChip, color: c.onAccent },
    m19: { ...button, color: c.whiteA[70] },
    m22: { ...eyebrow, color: c.inkA[50] },
  };

  const over = tweak?.(c) ?? {};
  for (const key of Object.keys(over) as (keyof ThemeText)[]) {
    text[key] = { ...text[key], ...over[key] };
  }
  return text;
};

/* ---------- shape ---------- */

export const FLAT: ThemeShape = {
  radius: { control: 0, chip: 0, field: 0, tile: 0 },
  borderWidth: 1,
  tilt: 0,
  shadow: { control: null, tile: null, image: null },
};

/** Spread into a View style: `...shadowStyle(theme.shape.shadow.tile)`. iOS props. */
type ShadowProps = Pick<
  ViewStyle,
  "shadowColor" | "shadowOffset" | "shadowRadius" | "shadowOpacity"
>;

/** Spread into any style: `...shadowStyle(theme.shape.shadow.tile)`. iOS props. */
export const shadowStyle = (s: Shadow): ShadowProps =>
  s
    ? {
        shadowColor: s.color,
        shadowOffset: { width: s.x, height: s.y },
        shadowRadius: s.blur / 2,
        shadowOpacity: 1,
      }
    : {};

/* ---------- themes ---------- */

const isDark = (hex: string) => {
  const [r, g, b] = rgb(hex);
  return r * 0.299 + g * 0.587 + b * 0.114 < 110;
};

export const defineTheme = (def: {
  palette: Palette;
  fonts: FontSet;
  shape?: ThemeShape;
  text?: TextTweaks;
}): Theme => {
  const colors = makeColors(def.palette);
  return {
    ...colors,
    text: makeText(colors, def.fonts, def.text),
    shape: def.shape ?? FLAT,
    scheme: isDark(def.palette.surface) ? "dark" : "light",
  };
};

// export const themes = {
//   default: defineTheme({
//     palette: {
//       ink: "#0A0A0A",
//       inkAlt: "#101010",
//       surface: "#FFFFFF",
//       surfaceSunken: "#F5F5F6",
//       surfaceAlt: "#F6F5F3",
//       onInk: "#FFFFFF",
//       danger: "#C4291C",
//       dangerPress: "#B3261E",
//     },
//     fonts: {
//       display: "Archivo-Bold",
//       heading: "Archivo-SemiBold",
//       title: "Archivo-Medium",
//       body: "Archivo-Regular",
//       label: "IBMPlexMono-Medium",
//       labelBold: "IBMPlexMono-SemiBold",
//       labelCase: "uppercase",
//       tracking: 1,
//     },
//   }),

//   popMaximal: defineTheme({
//     palette: {
//       ink: "#1B1E9E",
//       inkAlt: "#12124A",
//       surface: "#FFD23F",
//       surfaceSunken: "#FFF1C9",
//       surfaceAlt: "#C8FF5A",
//       onInk: "#FFFFFF",
//       accent: "#FF2E93",
//       onAccent: "#1A1050",
//       danger: "#D4143A",
//       dangerPress: "#B80F30",
//     },
//     fonts: {
//       display: "Fredoka-Bold",
//       heading: "Fredoka-SemiBold",
//       title: "Fredoka-Medium",
//       body: "Fredoka-Regular",
//       label: "BarlowSemiCondensed-SemiBold",
//       labelBold: "BarlowSemiCondensed-Bold",
//       labelCase: "uppercase",
//       tracking: 1,
//     },
//     shape: {
//       radius: { control: 999, chip: 999, field: 14, tile: 16 },
//       borderWidth: 2,
//       tilt: 0,
//       shadow: {
//         control: { x: 3, y: 3, blur: 0, color: "#1B1E9E" },
//         tile: { x: 4, y: 4, blur: 0, color: "#1B1E9E" },
//         image: { x: 4, y: 4, blur: 0, color: "#1B1E9E" },
//       },
//     },
//     text: () => ({
//       p1: { letterSpacing: 1.5 },
//       m10: { fontSize: 11 },
//       m11: { fontSize: 11 },
//     }),
//   }),

//   softBloom: defineTheme({
//     palette: {
//       ink: "#4A3B40",
//       inkAlt: "#3A2F33",
//       surface: "#FFF9F5",
//       surfaceSunken: "#F8ECE8",
//       surfaceAlt: "#EEF1E6",
//       onInk: "#FFF9F5",
//       accent: "#9C4F65",
//       onAccent: "#FFF9F5",
//       danger: "#B4443C",
//       dangerPress: "#9E3A33",
//     },
//     fonts: {
//       display: "CormorantGaramond-SemiBold",
//       heading: "CormorantGaramond-SemiBold",
//       title: "CormorantGaramond-Medium",
//       body: "NunitoSans-Regular",
//       label: "NunitoSans-SemiBold",
//       labelBold: "NunitoSans-Bold",
//       labelCase: "lowercase",
//       tracking: 0.4,
//     },
//     shape: {
//       radius: { control: 16, chip: 999, field: 14, tile: 18 },
//       borderWidth: 1,
//       tilt: 0,
//       shadow: {
//         control: null,
//         tile: { x: 0, y: 10, blur: 28, color: "rgba(156, 79, 101, 0.16)" },
//         image: { x: 0, y: 8, blur: 22, color: "rgba(156, 79, 101, 0.18)" },
//       },
//     },
//     text: () => ({
//       p1: {
//         fontSize: 34,
//         lineHeight: 34,
//         letterSpacing: 0.5,
//         textTransform: "lowercase",
//       },
//       p2: { fontSize: 32, lineHeight: 32, letterSpacing: 0 },
//       p3: { fontSize: 24 },
//     }),
//   }),

//   noirStreet: defineTheme({
//     palette: {
//       ink: "#F4F4F0",
//       inkAlt: "#000000",
//       surface: "#0B0B0B",
//       surfaceSunken: "#161616",
//       surfaceAlt: "#1D1D1D",
//       onInk: "#0B0B0B",
//       accent: "#C6FF00",
//       onAccent: "#0B0B0B",
//       danger: "#FF4D3D",
//       dangerPress: "#FF6A5C",
//     },
//     fonts: {
//       display: "Oswald-Bold",
//       heading: "Oswald-SemiBold",
//       title: "Oswald-Medium",
//       body: "Archivo-Regular",
//       label: "JetBrainsMono-Medium",
//       labelBold: "JetBrainsMono-Bold",
//       labelCase: "uppercase",
//       tracking: 1,
//     },
//     text: (c) => ({
//       p1: { letterSpacing: 4 },
//       p2: { textTransform: "uppercase", letterSpacing: 0.3 },
//       p3: { fontSize: 20, textTransform: "uppercase" },
//       m6: { color: c.accent },
//     }),
//   }),

//   studioNatural: defineTheme({
//     palette: {
//       ink: "#2F2A24",
//       inkAlt: "#26221D",
//       surface: "#F3ECE0",
//       surfaceSunken: "#E9DFCF",
//       surfaceAlt: "#E3DCC6",
//       onInk: "#F6F0E6",
//       accent: "#A4532F",
//       onAccent: "#F6F0E6",
//       danger: "#A63A2A",
//       dangerPress: "#8F3023",
//       success: "#5E6B3A",
//     },
//     fonts: {
//       display: "Fraunces-SemiBold",
//       heading: "Fraunces-SemiBold",
//       title: "Fraunces-Medium",
//       body: "WorkSans-Regular",
//       label: "WorkSans-Medium",
//       labelBold: "WorkSans-SemiBold",
//       labelCase: "uppercase",
//       tracking: 1,
//     },
//     shape: { ...FLAT, radius: { control: 6, chip: 6, field: 6, tile: 8 } },
//     text: (c) => ({
//       p1: { letterSpacing: 2.5 },
//       m6: { color: c.accent },
//     }),
//   }),

//   neoGlam: defineTheme({
//     palette: {
//       ink: "#EDEBF2",
//       inkAlt: "#07060B",
//       surface: "#0E0B14",
//       surfaceSunken: "#1A1424",
//       surfaceAlt: "#241A33",
//       onInk: "#0E0B14",
//       accent: "#D7C6FF",
//       onAccent: "#0E0B14",
//       danger: "#FF5C7A",
//       dangerPress: "#FF7C94",
//     },
//     fonts: {
//       display: "Syncopate-Bold",
//       heading: "Jost-SemiBold",
//       title: "Jost-Medium",
//       body: "Jost-Regular",
//       label: "Jost-Medium",
//       labelBold: "Jost-SemiBold",
//       labelCase: "uppercase",
//       tracking: 1.3,
//     },
//     shape: {
//       radius: { control: 2, chip: 999, field: 10, tile: 14 },
//       borderWidth: 1,
//       tilt: 0,
//       shadow: {
//         control: null,
//         tile: { x: 0, y: 12, blur: 30, color: "rgba(0, 0, 0, 0.5)" },
//         image: { x: 0, y: 10, blur: 26, color: "rgba(0, 0, 0, 0.5)" },
//       },
//     },
//     text: (c) => ({
//       p1: { fontSize: 22, letterSpacing: 5 },
//       p2: { letterSpacing: 0.6 },
//       m6: { color: c.accent },
//     }),
//   }),

//   scrapbook: defineTheme({
//     palette: {
//       ink: "#221C16",
//       inkAlt: "#1E1914",
//       surface: "#F3E9D2",
//       surfaceSunken: "#E6D5B5",
//       surfaceAlt: "#F0D9A8",
//       onInk: "#F3E9D2",
//       accent: "#2F6F73",
//       onAccent: "#FFF6E3",
//       danger: "#B8322A",
//       dangerPress: "#9E2B24",
//     },
//     fonts: {
//       display: "PermanentMarker-Regular",
//       heading: "Caveat-Bold",
//       title: "Caveat-SemiBold",
//       body: "CourierPrime-Regular",
//       label: "SpecialElite-Regular",
//       labelBold: "SpecialElite-Regular",
//       labelCase: "uppercase",
//       tracking: 0.6,
//     },
//     shape: {
//       radius: { control: 3, chip: 2, field: 3, tile: 2 },
//       borderWidth: 1,
//       tilt: 1.4,
//       shadow: {
//         control: null,
//         tile: { x: 1, y: 3, blur: 8, color: "rgba(34, 28, 22, 0.22)" },
//         image: { x: 1, y: 3, blur: 8, color: "rgba(34, 28, 22, 0.22)" },
//       },
//     },
//     text: () => ({
//       p1: { fontSize: 28, letterSpacing: 2 },
//       p2: { fontSize: 36, lineHeight: 32, letterSpacing: 0 },
//       p3: { fontSize: 27 },
//       p4: { fontSize: 14 },
//     }),
//   }),
// } satisfies Record<string, Theme>;

// export type ThemeName = keyof typeof themes;
export type TextToken = keyof ThemeText;
