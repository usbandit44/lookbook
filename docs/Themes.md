# Theming in Lookbook

A theme is one object that holds everything visual about the app: colors, text styles, shape (corner radius, borders, shadows, tilt) and the light/dark scheme. Components never hard-code a hex value, font, font size, radius or shadow. They read them from the current theme.

The pieces:

| File                                      | Role                                                                                    |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| `functions/themeBuilder.ts`               | Types (`Theme`, `ThemeText`, `ThemeShape`, …), `defineTheme()`, `shadowStyle()`, `FLAT` |
| `constants/themes.ts`                     | The list of themes the app ships, plus the `ThemeName` type                             |
| `hooks/ThemeProvider.tsx`                 | React context: the current theme, its name, and how to switch it                        |
| `app/_layout.tsx`                         | Loads fonts and mounts `ThemeProvider`                                                  |
| `db/schemas/user.ts` + `repo/user_repo/*` | Saves the chosen theme to the `user.theme` column                                       |

---

## 1. Creating a new theme

### 1.1 The short version

1. Pick your fonts and load them in `app/_layout.tsx`.
2. Add a `defineTheme({...})` entry to `themes` in `constants/themes.ts`.
3. You're done. `ThemeName`, the DB column type and the provider all pick up the new key automatically.

### 1.2 Anatomy of a theme definition

```ts
myTheme: defineTheme({
  palette: { ... },          // required: colors you write by hand
  fonts:   { ... },          // required: which font plays each role
  shape:   { ... },          // optional: defaults to FLAT
  text:    (c) => ({ ... }), // optional: per-token overrides
}),
```

#### `palette` (required)

| Key                     | Required               | Meaning                                                                                      |
| ----------------------- | ---------------------- | -------------------------------------------------------------------------------------------- |
| `ink`                   | ✅ (6-digit hex)       | Highest-contrast foreground: text and icon strokes. Also the base for the `inkA` alpha ramp. |
| `inkAlt`                | ✅                     | Secondary dark surface, used for immersive screens such as the camera.                       |
| `surface`               | ✅ (6-digit hex)       | Default screen background. It also decides `scheme` (light/dark).                            |
| `surfaceSunken`         | ✅                     | Recessed areas: fields, tiles, wells.                                                        |
| `surfaceAlt`            | optional               | A third, tinted surface.                                                                     |
| `onInk`                 | ✅                     | Foreground drawn on top of `ink`.                                                            |
| `accent`                | optional (6-digit hex) | Primary fills: buttons, selected chips, tags. **Falls back to `ink`.**                       |
| `onAccent`              | optional               | Foreground on `accent`. **Falls back to `onInk`.**                                           |
| `danger`, `dangerPress` | ✅                     | Destructive actions and their pressed state.                                                 |
| `success`, `warning`    | optional               | Status colors.                                                                               |

**Gotchas:**

- `ink`, `surface` and `accent` must be **6-digit `#RRGGBB` hex**. The ramp generator splits the string into pairs, so `#FFF`, `#RRGGBBAA` and `rgba(...)` will produce broken ramps. Other palette keys accept any `CSSColor` (hex, `rgb()`, `rgba()`, `oklch()`).
- Don't add the alpha ramps (`inkA`, `whiteA`, `accentA`, `surfaceA`) yourself. They're derived (see §3.2).
- Leaving out `accent` gives you a monochrome theme, which is what `default` does.

#### `fonts` (required)

| Key         | Used by                                                                         |
| ----------- | ------------------------------------------------------------------------------- |
| `display`   | `p1` (the LOOKBOOK wordmark)                                                    |
| `heading`   | `p2` (screen heading, outfit name)                                              |
| `title`     | `p3` (list row titles)                                                          |
| `body`      | `p4`–`p6` (body, inputs, hints)                                                 |
| `label`     | meta text: counts, captions (`m7`, `m10`, `m11`)                                |
| `labelBold` | buttons, chips, section labels (most `m*` tokens)                               |
| `labelCase` | `textTransform` applied to labels (`"uppercase"`, `"lowercase"`, `"none"`, …)   |
| `tracking`  | multiplier on label letter-spacing (`1` = the original design, `0.6` = tighter) |

The font strings must **exactly match the keys passed to `useFonts` in `app/_layout.tsx`**. If a family isn't loaded, React Native falls back to the system font without any error, so check this when your theme "looks wrong".

Adding a font:

```ts
// app/_layout.tsx
import { Oswald_600SemiBold, Oswald_700Bold } from "@expo-google-fonts/oswald";

useFonts({
  ...
  "Oswald-SemiBold": Oswald_600SemiBold,
  "Oswald-Bold": Oswald_700Bold,
});
```

Use the `Family-Weight` naming convention the other themes use. Several packages are already in `package.json` but not loaded yet (Oswald, Jost, Fraunces, Work Sans, Nunito Sans, Cormorant Garamond, JetBrains Mono, Syncopate). These are the fonts for the commented-out themes in `themeBuilder.ts`.

#### `shape` (optional, defaults to `FLAT`)

```ts
shape: {
  radius: { control: 999, chip: 999, field: 14, tile: 16 },
  borderWidth: 2,
  tilt: 0,
  shadow: {
    control: { x: 3, y: 3, blur: 0, color: "#1B1E9E" }, // buttons
    tile:    { x: 4, y: 4, blur: 0, color: "#1B1E9E" }, // item cards
    image:   null,                                      // clothing cutouts
  },
},
```

- `radius.control`: buttons and press overlays. `chip`: tags and filter chips. `field`: inputs. `tile`: item cards.
- `borderWidth`: the hairline/outline weight used across the app.
- `tilt`: degrees. Tiles alternate `-tilt` / `+tilt` by index for a "scattered photos" look (used by `scrapbook`). Use `0` to turn it off.
- `shadow.*`: `null` means no shadow. `blur: 0` with an offset gives a hard "sticker" drop shadow (as in `popMaximal`).
- You must supply the **whole** object. To change only radii, spread `FLAT` (exported from `themeBuilder.ts`):

  ```ts
  shape: { ...FLAT, radius: { control: 6, chip: 6, field: 6, tile: 8 } }
  ```

#### `text` (optional): token overrides

The builder generates every text token from your fonts and colors (§3.3). If one token needs to differ, override only that one. You get the finished colors as `c`:

```ts
text: (c) => ({
  p1: { fontSize: 28, letterSpacing: 2 },
  m6: { color: c.accent },           // make text links use the accent color
  p2: { textTransform: "uppercase" },
}),
```

Overrides are shallow-merged per token, so anything you leave out keeps its generated value.

### 1.3 Full example

```ts
// constants/themes.ts
noirStreet: defineTheme({
  palette: {
    ink: "#F4F4F0",
    inkAlt: "#000000",
    surface: "#0B0B0B",
    surfaceSunken: "#161616",
    surfaceAlt: "#1D1D1D",
    onInk: "#0B0B0B",
    accent: "#C6FF00",
    onAccent: "#0B0B0B",
    danger: "#FF4D3D",
    dangerPress: "#FF6A5C",
  },
  fonts: {
    display: "Oswald-Bold",
    heading: "Oswald-SemiBold",
    title: "Oswald-Medium",
    body: "Archivo-Regular",
    label: "JetBrainsMono-Medium",
    labelBold: "JetBrainsMono-Bold",
    labelCase: "uppercase",
    tracking: 1,
  },
  text: (c) => ({ p1: { letterSpacing: 4 }, m6: { color: c.accent } }),
}),
```

### 1.4 What a contributor needs to know

- **No migration is needed** to add a theme. The `user.theme` column is plain SQLite `TEXT`. Drizzle's `enum: Object.keys(themes)` only narrows the TypeScript type and adds no DB constraint.
- **Renaming or removing a theme key is safe but resets users.** If a saved value no longer exists in `themes`, `ThemeProvider` ignores it and uses `default`. Avoid renaming keys once a theme has shipped.
- **Keep the `satisfies Record<string, Theme>`** at the end of the `themes` object. It type-checks every entry while keeping the literal keys that `ThemeName` comes from.
- **Dark themes:** set a dark `surface` and a light `ink`. Every token uses `ink` and the `inkA` ramp, so the whole text and border system inverts on its own. `whiteA` stays white-based for overlays on dark fills.
- **Test on these screens**, because they use the most theme surface area:
  - Item grid (`ItemPreview`): tile shadow, tilt, image shadow
  - Add Item (`AddItemForm`)
  - Outfit editor (`OutfitEditor`, `Movable`, `SelectableItem`)
  - Buttons in all variants (`AppButton`)
  - Tags and chips (`Tag`)
  - Camera screen (uses `inkAlt`)
- **There is no theme picker in the UI yet.** To preview a theme, change `initialTheme` temporarily, or call `setThemeName("yourTheme")` from somewhere (there's a commented-out test button in `TopBar.tsx`). Note that the saved DB value overrides `initialTheme` (§2.3).

---

## 2. Using the ThemeProvider

### 2.1 Setup

`ThemeProvider` is already mounted in `app/_layout.tsx`. It sits **inside `RepoProvider`** because it needs `userRepo` to load and save the theme:

```tsx
<RepoProvider>
  <ThemeProvider>
    ...
    <AppShell />
  </ThemeProvider>
</RepoProvider>
```

Any component below it can call `useTheme()`. Calling it outside throws `"useTheme must be used within a ThemeProvider"`.

### 2.2 The hook

```ts
const { theme, themeName, setThemeName } = useTheme();
```

| Value          | Type                        | Use                                                                                        |
| -------------- | --------------------------- | ------------------------------------------------------------------------------------------ |
| `theme`        | `Theme`                     | The resolved theme object: colors, `text`, `shape`, `scheme`                               |
| `themeName`    | `ThemeName`                 | The current key, e.g. `"scrapbook"` (useful for showing which one is selected in a picker) |
| `setThemeName` | `(name: ThemeName) => void` | Switches the theme right away **and saves it** to the DB                                   |

### 2.3 Changing the theme

```tsx
const { themeName, setThemeName } = useTheme();

<AppButton label="Scrapbook" onPress={() => setThemeName("scrapbook")} />;
```

- The whole tree re-renders with the new theme on the next frame.
- Saving happens in the background through `userRepo.setTheme`. Save errors are ignored (`.catch(() => {})`), so the UI still switches even if the write fails.
- To list all themes for a picker:

  ```ts
  import { themes, ThemeName } from "@/constants/themes";
  const names = Object.keys(themes) as ThemeName[];
  ```

### 2.4 Using theme elements in components

#### Text: always use `AppText` with a token

```tsx
<AppText type="p2" text={outfit.name} />
<AppText type="m7" text={`${count} pieces`} />
```

The token supplies font, size, line height, tracking, case and color. Don't pass `fontSize` or `fontFamily` in `style`. If a token doesn't fit, add or adjust one in the builder, or override it per theme. Pass `style={{ color }}` only for real one-off cases. `TextToken` (exported from `themeBuilder.ts`) is the union of valid keys.

Token reference:

| Token        | Purpose                              |
| ------------ | ------------------------------------ |
| `p1`         | LOOKBOOK wordmark                    |
| `p2`         | Screen heading / outfit name         |
| `p3`         | List row title                       |
| `p4`         | Body, input text, dropdown rows      |
| `p5`         | Empty-state body (multi-line, muted) |
| `p6`         | Hints, "No matching tags"            |
| `m1`         | Empty-state title                    |
| `m2`         | Screen title (PIECE, OUTFIT)         |
| `m3`         | Primary button label (on `accent`)   |
| `m4` / `m16` | Filter chip idle / selected          |
| `m5`         | Section label (TYPE, COLOUR)         |
| `m6`         | Text link, + ADD TAG                 |
| `m7`         | Header count                         |
| `m10`        | Tile caption                         |
| `m11`        | Row meta                             |
| `m13`        | Secondary button label               |
| `m14`        | Disabled / ghost button label        |
| `m19`        | Button label on a dark surface       |
| `m22`        | Sheet header                         |

#### Colors

```ts
backgroundColor: theme.surface;
borderColor: theme.inkA[14]; // hairline
color: theme.onAccent;
backgroundColor: theme.accentA[70]; // tinted fill
```

Use the alpha ramps for greys and tints, and never add a new hex value in a component. **Only these steps exist.** `AlphaRamp` is typed as `Record<number, …>`, so TypeScript won't catch a missing step, and `inkA[25]` returns `undefined`:

| Ramp       | Steps                                                                   |
| ---------- | ----------------------------------------------------------------------- |
| `inkA`     | 7, 8, 9, 10, 12, 14, 16, 18, 20, 30, 35, 38, 40, 42, 45, 50, 55, 60, 65 |
| `whiteA`   | 7, 16, 30, 40, 50, 55, 60, 65, 70, 80, 85, 90                           |
| `accentA`  | 7, 10, 12, 16, 20, 30, 40, 50, 60, 70, 80                               |
| `surfaceA` | 46, 50, 60, 90                                                          |

#### Shape and shadows

```ts
import { shadowStyle } from "@/functions/themeBuilder";

{
  borderRadius: theme.shape.radius.tile,
  borderWidth: theme.shape.borderWidth,
  ...shadowStyle(theme.shape.shadow.tile), // returns {} when the shadow is null
}
```

Tilt (copy the pattern from `ItemPreview` / `SelectableItem`):

```ts
theme.shape.tilt !== 0 && {
  transform: [
    { rotate: `${index % 2 === 0 ? -theme.shape.tilt : theme.shape.tilt}deg` },
  ],
};
```

#### StyleSheet pattern used across the codebase

Styles that depend on the theme are built by a factory that takes the theme:

```tsx
export default function MyThing() {
  const { theme } = useTheme();
  const styles = s(theme);
  return <View style={styles.box} />;
}

const s = (t: Theme) =>
  StyleSheet.create({
    box: {
      backgroundColor: t.surfaceSunken,
      borderRadius: t.shape.radius.field,
      ...shadowStyle(t.shape.shadow.tile),
    },
  });
```

If this ever becomes a performance problem, wrap it in `useMemo(() => s(theme), [theme])`. Theme objects are created once at module load, so the reference only changes when the user switches.

---

## 3. How it works internally

### 3.1 Overview

```
constants/themes.ts                    functions/themeBuilder.ts
  defineTheme({palette, fonts,  ──►     makeColors(palette)              → colors + 4 alpha ramps
               shape?, text?})          makeText(colors, fonts, tweaks)  → 20 text tokens
                                        shape ?? FLAT
                                        isDark(surface)                  → scheme
                                   ◄──  Theme (plain, fully resolved object)

themes = { default, popMaximal, scrapbook }   (built once at import)
        │
        ▼
ThemeProvider ── reads/writes user.theme via userRepo
        │  value = { theme: themes[themeName], themeName, setThemeName }
        ▼
useTheme() in components → AppText / StyleSheet factories / shadowStyle
```

All theme building happens **once, when `constants/themes.ts` is imported**. At runtime, switching themes only means looking up a different pre-built object.

### 3.2 Colors: `makeColors`

1. `accent = palette.accent ?? palette.ink`, `onAccent = palette.onAccent ?? palette.onInk`.
2. Four alpha ramps are generated with `ramp(hex, steps)`. It parses the hex into RGB and produces `rgba(r, g, b, step/100)` for each step:
   - `inkA` from `ink`
   - `whiteA` from `#FFFFFF` (fixed)
   - `accentA` from the resolved `accent`
   - `surfaceA` from `surface`
3. The ramp step lists (`INK_STEPS`, `WHITE_STEPS`, `ACCENT_STEPS`, `SURFACE_STEPS`) are constants at the top of the builder. To add a step (say `inkA[25]`), add it to the array. Every theme gets it.

This is why "derive greys from these ramps, never new hexes" works: every grey in the app is the theme's own `ink` at some opacity, so a navy-ink theme gets navy-tinted greys for free.

### 3.3 Type: `makeText`

1. A few shared **metric presets** are built from `fonts`, with `tracking` multiplied into every label letter-spacing:
   - `button`: labelBold, 12/13, 1.2 tracking, `labelCase`
   - `filterChip`: button with 1.0 tracking
   - `chip`: button with lineHeight 12
   - `meta`: label, 10/13, 0.85 tracking
   - `eyebrow`: labelBold, 14/14, 1.54 tracking
2. Each of the 20 tokens is a preset or a direct font role, **plus a color** taken from the resolved colors (`ink`, an `inkA` step, `onAccent` or `whiteA[70]`). Colors live on the token, so components never pass `color`.
3. `p1` always uses `textTransform: "uppercase"` and a fixed letter-spacing, separate from `labelCase`/`tracking`. Override it in `text` if your theme needs something different.
4. The theme's `text` tweak function runs last with the final colors. Its result is shallow-merged into each token.

### 3.4 Shape and scheme

- `shape` is used exactly as given, or `FLAT` (no radius, 1px borders, no tilt, no shadows) if left out.
- `shadowStyle(s)` turns a `Shadow` into iOS shadow props: `shadowRadius = blur / 2`, `shadowOpacity = 1` (the opacity comes from the color's alpha). It returns `{}` for `null`. **It doesn't set Android `elevation`**, so shadows only show on iOS right now.
- `scheme` is `"dark"` when the perceived luminance of `surface` (`0.299R + 0.587G + 0.114B`) is under 110, otherwise `"light"`. It's meant to drive the status bar and keyboard. **Nothing uses it yet:** `_layout.tsx` still hard-codes `<StatusBar style={isCamera ? "light" : "dark"} />`, so a dark-surface theme will show dark status-bar icons on a dark background.
- `pad(blur)` is exported (`Math.max(15, blur * 0.6)`), probably for spacing that leaves room for large shadows, but nothing calls it yet.

### 3.5 ThemeProvider lifecycle

1. On mount, `themeName` = `initialTheme` (`"default"`), `ready = false`.
2. The effect calls `userRepo.getTheme()` (`AppUserRepo` → `SqliteUserRepo`: `SELECT … FROM user LIMIT 1`, returns `.theme`).
   - If the value exists **and** is a key in `themes`, it's used. Otherwise it stays on the initial theme.
   - `.finally` sets `ready = true` whether the call succeeds or fails.
3. **While `ready` is false the provider renders `null`.** This stops the default theme from flashing before the saved one loads. It also means the whole app below the provider waits for that DB read.
4. `setThemeName(name)` updates local state right away, then calls `userRepo.setTheme(name)` (`UPDATE user SET theme = ?`) and ignores errors.
5. The context value is memoized on `themeName`, so consumers only re-render when the theme actually changes.

### 3.6 Persistence

- Migration `0017_confused_luckman.sql`: `ALTER TABLE user ADD theme text DEFAULT 'default' NOT NULL;`. Existing users get `default`.
- `db/schemas/user.ts` types the column as `ThemeName` through `enum: Object.keys(themes)`. This is compile-time only (see §1.4).
- `UserRepo` (abstract) → `AppUserRepo` (delegates) → `SqliteUserRepo` (Drizzle). Any new `UserRepo` implementation must add `getTheme` and `setTheme`.
