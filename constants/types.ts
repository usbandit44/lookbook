export type SnackbarAction = { actionFn: () => void; actionMsg: string };
export type Hex = `#${string}`;
export type CSSColor =
  | Hex
  | `rgba(${string})`
  | `rgb(${string})`
  | `oklch(${string})`;

/** Opacity ramp of a single base colour, keyed by percent. */
export type AlphaRamp = Record<number, CSSColor>;
