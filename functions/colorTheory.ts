import { itemColors } from "@/constants/constants";

// NOTE: for ColorName to be a literal union ("White" | "Black" | ...) instead
// of plain `string`, itemColors needs to be declared `as const` in constants.ts:
//
//   export const itemColors = ["White", "Black", ...] as const;
//
// Without `as const`, TS widens the array to string[], and ColorName below
// just collapses to `string` — everything here still runs, you just lose
// autocomplete/typo-checking on color names.
export type ColorName = (typeof itemColors)[number];

const ALL_COLORS = new Set<string>(itemColors);

/**
 * Runtime guard for colors coming from outside the type system - e.g. a
 * repo/DB call typed as `string`. Narrows to ColorName and doubles as a
 * defensive filter against bad/unexpected data (a color that got renamed
 * or removed from itemColors but is still sitting on an old row, say).
 */
export function isColorName(value: string): value is ColorName {
  return ALL_COLORS.has(value);
}

// ---------------------------------------------------------------------------
// Colors that aren't on the color wheel at all - they go with everything,
// the same way a `versatile: true` item skips the tag-overlap check in
// your style compatibility graph.
// ---------------------------------------------------------------------------

const NEUTRAL_COLORS = new Set<ColorName>([
  "White",
  "Black",
  "Grey",
  "Khaki",
  "Brown",
  "Silver",
  "Gold",
]);

// Multicolor items contain unknown colors - can't rule them in or out against
// a specific combo, so treat as a wildcard rather than guessing.
const WILDCARD_COLORS = new Set<ColorName>(["Multicolor"]);

// ---------------------------------------------------------------------------
// Hue positions (degrees, 0-360) for the chromatic colors only. Neutrals and
// Multicolor deliberately have no entry here - they're handled by
// NEUTRAL_COLORS / WILDCARD_COLORS instead, not by wheel position.
// ---------------------------------------------------------------------------

const COLOR_WHEEL: Partial<Record<ColorName, number>> = {
  Red: 0,
  Orange: 30,
  Yellow: 55,
  Green: 120,
  Blue: 220,
  Purple: 270,
  Pink: 330,
};

function hueDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

// Chromatic colors sorted by hue, for picking true wheel-neighbors below.
const SORTED_WHEEL: [ColorName, number][] = (
  Object.entries(COLOR_WHEEL) as [ColorName, number][]
).sort((a, b) => a[1] - b[1]);

/**
 * The two colors immediately next to `base` on the wheel. With only 7
 * chromatic hues (average ~51deg apart), a fixed-degree offset like +-35deg
 * can snap right back to `base` itself instead of a real neighbor - so
 * analogous picks the actual adjacent wheel entries directly instead.
 */
function wheelNeighbors(base: ColorName): [ColorName, ColorName] {
  const idx = SORTED_WHEEL.findIndex(([c]) => c === base);
  const prev =
    SORTED_WHEEL[(idx - 1 + SORTED_WHEEL.length) % SORTED_WHEEL.length][0];
  const next = SORTED_WHEEL[(idx + 1) % SORTED_WHEEL.length][0];
  return [prev, next];
}

/** Snaps an arbitrary target hue to the closest color actually in your palette. */
function nearestColorToHue(targetHue: number): ColorName {
  let closest: ColorName | null = null;
  let closestDist = Infinity;
  for (const [color, hue] of Object.entries(COLOR_WHEEL) as [
    ColorName,
    number,
  ][]) {
    const dist = hueDistance(hue, targetHue);
    if (dist < closestDist) {
      closestDist = dist;
      closest = color;
    }
  }
  // COLOR_WHEEL always has entries, so this is unreachable, but keeps TS happy.
  if (!closest) throw new Error("COLOR_WHEEL is empty");
  return closest;
}

export type HarmonyType =
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "splitComplementary"
  | "triadic"
  | "neutral";

/**
 * Given a base color and a harmony rule, returns every color that belongs
 * in the combo: the harmony-specific accent(s) plus every always-allowed
 * color (neutrals + Multicolor), since those pair with anything regardless
 * of harmony.
 */
export function generateColorCombo(
  base: ColorName,
  harmony: HarmonyType,
): ColorName[] {
  const baseHue = COLOR_WHEEL[base];

  const accents: ColorName[] =
    baseHue === undefined
      ? // base itself is a neutral or Multicolor - color-wheel harmony
        // doesn't apply, so there's no extra accent to compute.
        [base]
      : (() => {
          switch (harmony) {
            case "monochromatic":
              return [base];
            case "neutral":
              return [base];
            case "analogous":
              return [base, ...wheelNeighbors(base)];
            case "complementary":
              return [base, nearestColorToHue(baseHue + 180)];
            case "splitComplementary":
              return [
                base,
                nearestColorToHue(baseHue + 150),
                nearestColorToHue(baseHue + 210),
              ];
            case "triadic":
              return [
                base,
                nearestColorToHue(baseHue + 120),
                nearestColorToHue(baseHue + 240),
              ];
          }
        })();

  // With only 7 hues on the wheel, nearestColorToHue can collapse two
  // distinct targets onto the same color - dedupe so the combo stays clean.
  return Array.from(
    new Set([...accents, ...NEUTRAL_COLORS, ...WILDCARD_COLORS]),
  );
}

/**
 * Does this item's color belong in the outfit given the selected combo?
 * Neutrals and Multicolor always pass, same idea as `versatile` in the
 * style graph - everything else must be an explicit combo member.
 */
export function colorMatches(
  itemColor: ColorName,
  combo: ColorName[],
): boolean {
  if (NEUTRAL_COLORS.has(itemColor) || WILDCARD_COLORS.has(itemColor))
    return true;
  return combo.includes(itemColor);
}
