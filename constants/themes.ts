import { AlphaRamp, CSSColor } from "@/constants/types";
import type { TextStyle } from "react-native";

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
  /* Archivo — prose, names, values */
  p1: TypeToken; // LOOKBOOK wordmark
  p2: TypeToken; // outfit name / screen heading
  p3: TypeToken; // list row title (piece label)
  p4: TypeToken; // input text, dropdown row, default body
  p5: TypeToken; // empty-state body (multi-line)
  p6: TypeToken; // hint / "No matching tags"
  p7: TypeToken; // inline validation
  p8: TypeToken; // body on dark surface

  /* IBM Plex Mono — labels, meta, all-caps */
  m1: TypeToken; // empty-state title
  m2: TypeToken; // screen title (PIECE, OUTFIT, ADD ITEM)
  m3: TypeToken; // button label, primary (on ink fill)
  m4: TypeToken; // filter chip, idle
  m5: TypeToken; // section label (TYPE, COLOUR)
  m6: TypeToken; // text link, + ADD TAG
  m7: TypeToken; // option chip, idle
  m8: TypeToken; // header count
  m9: TypeToken; // outfit meta line
  m10: TypeToken; // tile caption
  m11: TypeToken; // row meta
  m12: TypeToken; // trailing count
  m13: TypeToken; // button label, secondary (outlined on surface)
  m14: TypeToken; // button label, disabled / ghost
  m15: TypeToken; // option chip, selected (on ink fill)
  m16: TypeToken; // filter chip, selected (on ink fill)
  m17: TypeToken; // + ADD TAG, idle (empty query)
  m18: TypeToken; // text link, pressed
  m19: TypeToken; // button label on dark surface (CANCEL)
  m20: TypeToken; // shot index number on dark
  m21: TypeToken; // label on dark surface (processing well)
  m22: TypeToken; // sheet header
};

/** The colour half of a theme. */
export type ThemeColors = {
  /** Highest-contrast foreground; primary fills. */
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

  danger: CSSColor;
  dangerPress: CSSColor;
  success?: CSSColor;
  warning?: CSSColor;

  /** Derive greys from these ramps, never new hexes. */
  inkA: AlphaRamp;
  whiteA: AlphaRamp;
};

export type Theme = ThemeColors & {
  /** Every text style in the app. Never inline a font size or a colour. */
  text: ThemeText;
};

/* ---------- colours ---------- */

const defaultColors: ThemeColors = {
  ink: "#0A0A0A", // text, primary fills, icon strokes, active chips
  inkAlt: "#101010", // camera / shot-review / processing screens
  surface: "#FFFFFF", // screens, sticky headers, footers, outfit cards
  surfaceSunken: "#F5F5F6", // search field, item tiles, detail image well
  surfaceAlt: "#F6F5F3", // "+ ADD TAG" row at the foot of the tag dropdown
  onInk: "#FFFFFF", // labels on ink fills

  danger: "#C4291C", // delete icon (item detail header)
  dangerPress: "#B3261E", // validation text, delete confirm button

  inkA: {
    7: "rgba(10, 10, 10, 0.07)", // clear-search button fill, pressed state
    8: "rgba(10, 10, 10, 0.08)", // tag dropdown row divider
    9: "rgba(10, 10, 10, 0.09)", // tile / outfit card hairline
    10: "rgba(10, 10, 10, 0.10)", // image well border, footer top rule
    12: "rgba(10, 10, 10, 0.12)", // search field border
    14: "rgba(10, 10, 10, 0.14)", // header rule
    16: "rgba(10, 10, 10, 0.16)", // default border, ghost button, idle chip
    18: "rgba(10, 10, 10, 0.18)", // swatch square border
    20: "rgba(10, 10, 10, 0.20)", // menu shadow
    30: "rgba(10, 10, 10, 0.30)", // disabled label
    35: "rgba(10, 10, 10, 0.35)", // meta / counts
    38: "rgba(10, 10, 10, 0.38)", // input placeholder
    40: "rgba(10, 10, 10, 0.40)", // empty-state icon, "No matching tags"
    42: "rgba(10, 10, 10, 0.42)", // field labels (CUSTOM TAGS)
    45: "rgba(10, 10, 10, 0.45)", // header count, screen title, tag search icon
    50: "rgba(10, 10, 10, 0.50)", // empty-state body
    55: "rgba(10, 10, 10, 0.55)", // idle chip text, chevron
    60: "rgba(10, 10, 10, 0.60)", // tile captions
    65: "rgba(10, 10, 10, 0.65)",
  },

  whiteA: {
    7: "rgba(255, 255, 255, 0.07)", // diagonal hatch on shot thumbnails
    16: "rgba(255, 255, 255, 0.16)",
    30: "rgba(255, 255, 255, 0.30)", // ghost button border on dark
    40: "rgba(255, 255, 255, 0.40)", // camera guide frame
    50: "rgba(255, 255, 255, 0.50)",
    55: "rgba(255, 255, 255, 0.55)", // shot index number
    60: "rgba(255, 255, 255, 0.60)",
    65: "rgba(255, 255, 255, 0.65)", // ✕ on tag chips
    70: "rgba(255, 255, 255, 0.70)", // CANCEL label on dark
    80: "rgba(255, 255, 255, 0.80)", // processing image well text
    85: "rgba(255, 255, 255, 0.85)", // shutter icon strokes
    90: "rgba(255, 255, 255, 0.90)", // fav badge over imagery (+ blur 10)
  },
};

/* ---------- shared metrics ---------- */

const button: Metrics = {
  fontFamily: "IBMPlexMono-SemiBold",
  fontSize: 12,
  lineHeight: 13,
  letterSpacing: 1.2, // .12em
  textTransform: "uppercase",
};
const filterChip: Metrics = { ...button, letterSpacing: 1 }; // .10em
const chip: Metrics = {
  ...button,
  lineHeight: 12,
  fontSize: 12,
  letterSpacing: 1.2, // 9.5 × .09em
};
const link: Metrics = { ...chip, letterSpacing: 1.14 }; // .12em
const meta: Metrics = {
  fontFamily: "IBMPlexMono-Medium",
  fontSize: 10,
  lineHeight: 13,
  letterSpacing: 0.85, // .10em
  textTransform: "uppercase",
};
const eyebrow: Metrics = {
  fontFamily: "IBMPlexMono-SemiBold",
  fontSize: 14,
  lineHeight: 14,
  letterSpacing: 1.54, // .14em
  textTransform: "uppercase",
};
/* ---------- type, built from the colours ---------- */

const makeText = (c: ThemeColors): ThemeText => ({
  // ---- Archivo ----
  p1: {
    fontFamily: "Archivo-Bold",
    fontSize: 30,
    lineHeight: 30,
    letterSpacing: 5.72, // .22em
    textTransform: "uppercase",
    color: c.ink,
  },
  p2: {
    fontFamily: "Archivo-SemiBold",
    fontSize: 23,
    lineHeight: 27.6,
    letterSpacing: -0.23, // -.01em
    color: c.ink,
  },
  p3: {
    fontFamily: "Archivo-Medium",
    fontSize: 22,
    lineHeight: 25,
    color: c.ink,
  },
  p4: {
    fontFamily: "Archivo-Regular",
    fontSize: 15,
    lineHeight: 18,
    color: c.ink,
  },
  p5: {
    fontFamily: "Archivo-Regular",
    fontSize: 14,
    lineHeight: 20,
    color: c.inkA[50],
  },
  p6: {
    fontFamily: "Archivo-Regular",
    fontSize: 14,
    lineHeight: 16,
    color: c.inkA[40],
  },
  p7: {
    fontFamily: "Archivo-Medium",
    fontSize: 10.5,
    lineHeight: 14,
    color: c.dangerPress,
  },
  p8: {
    fontFamily: "Archivo-Regular",
    fontSize: 13,
    lineHeight: 18,
    color: c.whiteA[80],
  },

  // ---- IBM Plex Mono ----
  m1: {
    ...eyebrow,
    color: c.ink,
  },
  m2: { ...button, letterSpacing: 1.6, color: c.inkA[45] }, // .16em
  m3: { ...button, color: c.onInk },
  m4: { ...filterChip, color: c.ink },
  m5: { ...chip, letterSpacing: 1.235, color: c.inkA[42] }, // .13em
  m6: {
    fontFamily: "IBMPlexMono-SemiBold",
    fontSize: 12,
    letterSpacing: 1.2, // 9.5 × .12em
    textTransform: "uppercase",
    color: c.inkA[55],
  },
  m7: { ...chip, color: c.ink },
  m8: {
    fontFamily: "IBMPlexMono-Medium",
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0.76, // .08em
    textTransform: "uppercase",
    color: c.inkA[45],
  },
  m9: {
    fontFamily: "IBMPlexMono-Medium",
    fontSize: 9.5,
    lineHeight: 12,
    letterSpacing: 1.045, // .11em
    textTransform: "uppercase",
    color: c.inkA[45],
  },
  m10: { ...meta, letterSpacing: 0.765, color: c.inkA[60] }, // .09em
  m11: { ...meta, color: c.inkA[45] },
  m12: { ...meta, letterSpacing: 0.51, color: c.inkA[35] }, // .06em
  m13: { ...button, color: c.ink },
  m14: { ...button, color: c.inkA[30] },
  m15: { ...chip, color: c.onInk },
  m16: { ...filterChip, color: c.onInk },
  m17: { ...link, color: c.inkA[35] },
  m18: { ...link, color: c.ink },
  m19: { ...button, color: c.whiteA[70] },
  m20: {
    fontFamily: "IBMPlexMono-Medium",
    fontSize: 9.5,
    lineHeight: 12,
    letterSpacing: 0.76,
    textTransform: "uppercase",
    color: c.whiteA[55],
  },
  m21: { ...link, color: c.whiteA[80] },
  m22: { ...eyebrow, color: c.inkA[50] }, // sheet header (ADD TO LOOKBOOK)
});

/* ---------- themes ---------- */

export const themes = {
  default: { ...defaultColors, text: makeText(defaultColors) },
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof themes;
export type TextToken = keyof ThemeText;
