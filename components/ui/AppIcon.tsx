// components/Icon.tsx
import { useTheme } from "@/hooks/ThemeProvider";
import React from "react";
import Svg, { Circle, Line, Path, Polyline, Rect } from "react-native-svg";

export type IconName =
  | "search"
  | "close"
  | "plus"
  | "check"
  | "chevronDown"
  | "chevronRight"
  | "arrowLeft"
  | "arrowRight"
  | "trash"
  | "more"
  | "star"
  | "starOutline"
  | "share"
  | "image"
  | "resize"
  | "shirt"
  | "hanger"
  | "createOutfit"
  | "generate"
  | "library";

type Glyph = (p: { color: string; sw: number }) => React.ReactNode;

const GLYPHS: Record<IconName, { draw: Glyph }> = {
  search: {
    draw: ({ color, sw }) => (
      <>
        <Circle cx={10.5} cy={10.5} r={6.5} stroke={color} strokeWidth={sw} />
        <Line
          x1={15.5}
          y1={15.5}
          x2={21}
          y2={21}
          stroke={color}
          strokeWidth={sw}
        />
      </>
    ),
  },
  close: {
    draw: ({ color, sw }) => (
      <>
        <Line x1={5} y1={5} x2={19} y2={19} stroke={color} strokeWidth={sw} />
        <Line x1={19} y1={5} x2={5} y2={19} stroke={color} strokeWidth={sw} />
      </>
    ),
  },
  plus: {
    draw: ({ color, sw }) => (
      <>
        <Line
          x1={12}
          y1={4.5}
          x2={12}
          y2={19.5}
          stroke={color}
          strokeWidth={sw}
        />
        <Line
          x1={4.5}
          y1={12}
          x2={19.5}
          y2={12}
          stroke={color}
          strokeWidth={sw}
        />
      </>
    ),
  },
  check: {
    draw: ({ color, sw }) => (
      <Polyline
        points="4.5,12.5 9.5,17.5 19.5,6.5"
        stroke={color}
        strokeWidth={sw}
      />
    ),
  },
  chevronDown: {
    draw: ({ color, sw }) => (
      <Polyline points="4.5,9 12,16.5 19.5,9" stroke={color} strokeWidth={sw} />
    ),
  },
  chevronRight: {
    draw: ({ color, sw }) => (
      <Polyline points="9,5 16,12 9,19" stroke={color} strokeWidth={sw} />
    ),
  },
  arrowLeft: {
    draw: ({ color, sw }) => (
      <>
        <Line x1={20} y1={12} x2={4} y2={12} stroke={color} strokeWidth={sw} />
        <Polyline points="10,6 4,12 10,18" stroke={color} strokeWidth={sw} />
      </>
    ),
  },
  arrowRight: {
    draw: ({ color, sw }) => (
      <>
        <Line x1={4} y1={12} x2={20} y2={12} stroke={color} strokeWidth={sw} />
        <Polyline points="14,6 20,12 14,18" stroke={color} strokeWidth={sw} />
      </>
    ),
  },
  trash: {
    draw: ({ color, sw }) => (
      <>
        <Polyline points="4,7 20,7" stroke={color} strokeWidth={sw} />
        <Path d="M9 7V4h6v3" stroke={color} strokeWidth={sw} />
        <Path d="M6 7l1 13h10l1-13" stroke={color} strokeWidth={sw} />
      </>
    ),
  },
  more: {
    draw: ({ color }) => (
      <>
        <Circle cx={12} cy={5} r={1.8} fill={color} />
        <Circle cx={12} cy={12} r={1.8} fill={color} />
        <Circle cx={12} cy={19} r={1.8} fill={color} />
      </>
    ),
  },
  star: {
    draw: ({ color }) => (
      <Path
        d="M12 3.6l2.6 5.6 6.1.7-4.5 4.1 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.9l6.1-.7z"
        fill={color}
      />
    ),
  },
  starOutline: {
    draw: ({ color, sw }) => (
      <Path
        d="M12 3.6l2.6 5.6 6.1.7-4.5 4.1 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.9l6.1-.7z"
        stroke={color}
        strokeWidth={sw}
      />
    ),
  },
  share: {
    draw: ({ color, sw }) => (
      <>
        <Path d="M12 16V4" stroke={color} strokeWidth={sw} />
        <Polyline
          points="7.5,8.5 12,4 16.5,8.5"
          stroke={color}
          strokeWidth={sw}
        />
        <Path d="M5 14v5.5h14V14" stroke={color} strokeWidth={sw} />
      </>
    ),
  },
  image: {
    draw: ({ color, sw }) => (
      <>
        <Rect
          x={3.5}
          y={5}
          width={17}
          height={14}
          stroke={color}
          strokeWidth={sw}
        />
        <Circle cx={8.6} cy={9.8} r={1.4} stroke={color} strokeWidth={sw} />
        <Polyline
          points="4.5,17 10,11.5 14,15 16.5,12.8 19.5,15.6"
          stroke={color}
          strokeWidth={sw}
        />
      </>
    ),
  },
  resize: {
    draw: ({ color, sw }) => (
      <>
        <Polyline points="8,22 22,22 22,8" stroke={color} strokeWidth={sw} />
        <Line x1={22} y1={22} x2={8} y2={8} stroke={color} strokeWidth={sw} />
      </>
    ),
  },
  shirt: {
    draw: ({ color, sw }) => (
      <>
        <Path
          d="M8.8 3.6 5.2 5.4 3.4 9.6l2.5 1v9.8h12.2v-9.8l2.5-1-1.8-4.2-3.6-1.8"
          stroke={color}
          strokeWidth={sw}
        />
        <Path
          d="M8.8 3.6c.4 1.9 1.6 2.9 3.2 2.9s2.8-1 3.2-2.9"
          stroke={color}
          strokeWidth={sw}
        />
      </>
    ),
  },
  hanger: {
    draw: ({ color, sw }) => (
      <>
        <Path
          d="M12 8.6c0-1.7 2-1.7 2-3.2a2 2 0 1 0-4 0"
          stroke={color}
          strokeWidth={sw}
        />
        <Path
          d="M12 8.8 3.9 15c-1.1.8-.5 2.6.9 2.6h14.4c1.4 0 2-1.8.9-2.6Z"
          stroke={color}
          strokeWidth={sw}
        />
      </>
    ),
  },
  createOutfit: {
    draw: ({ color, sw }) => (
      <>
        <Rect
          x={3.5}
          y={4.5}
          width={8}
          height={15}
          stroke={color}
          strokeWidth={sw}
        />
        <Rect
          x={14}
          y={4.5}
          width={6.5}
          height={6.5}
          stroke={color}
          strokeWidth={sw}
        />
        <Line
          x1={17.25}
          y1={13.4}
          x2={17.25}
          y2={19}
          stroke={color}
          strokeWidth={sw}
        />
        <Line
          x1={14.45}
          y1={16.2}
          x2={20.05}
          y2={16.2}
          stroke={color}
          strokeWidth={sw}
        />
      </>
    ),
  },
  generate: {
    draw: ({ color, sw }) => (
      <>
        <Path
          d="M10.5 3.5 12.3 9.2 18 11 12.3 12.8 10.5 18.5 8.7 12.8 3 11 8.7 9.2 Z"
          stroke={color}
          strokeWidth={sw}
        />
        <Path
          d="M19.5 15.2 20.25 17.25 22.3 18 20.25 18.75 19.5 20.8 18.75 18.75 16.7 18 18.75 17.25 Z"
          stroke={color}
          strokeWidth={sw}
        />
      </>
    ),
  },
  library: {
    draw: ({ color, sw }) => (
      <>
        <Path d="M7 4H21V18" stroke={color} strokeWidth={sw} />
        <Rect
          x={3}
          y={7}
          width={14}
          height={14}
          stroke={color}
          strokeWidth={sw}
        />
        <Circle cx={7.2} cy={11.4} r={1.15} stroke={color} strokeWidth={sw} />
        <Polyline
          points="3.8,18.6 8.2,13.8 11,16.6 13,14.6 16.2,17.8"
          stroke={color}
          strokeWidth={sw}
        />
      </>
    ),
  },
};

/** Stroke width that holds a ~1.35px on-screen stroke at each rendered size. */
export const SIZE_WEIGHT: Record<number, number> = {
  9: 3.6,
  11: 3,
  14: 2.3,
  15: 2.2,
  17: 1.9,
  18: 1.8,
  19: 1.7,
  20: 1.6,
};

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function AppIcon({ name, size = 20, color, strokeWidth }: IconProps) {
  const { theme: t } = useTheme();
  const stroke = color ?? t.ink;
  const sw = strokeWidth ?? SIZE_WEIGHT[size] ?? 1.8;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {GLYPHS[name].draw({ color: stroke, sw })}
    </Svg>
  );
}
