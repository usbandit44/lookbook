/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { ItemsType } from "@/db/schemas/items";
import { OutfitType } from "@/db/schemas/outfits";
import { PresetType } from "@/db/schemas/presets";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#000000",
    background: "#fafafa",
    tint: tintColorLight,
    icon: "#000000",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    destructive: "#ff5247",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export enum itemTypes {
  Tops = "Tops",
  Bottoms = "Bottoms",
  Outerwear = "Outerwear",
  Dresses = "Dresses",
  Shoes = "Shoes",
  Belt = "Belt",
  Headwear = "Headwear",
  Accessories = "Accessories",
}

export const itemTypesArray = [
  "Tops",
  "Bottoms",
  "Outerwear",
  "Dresses",
  "Shoes",
  "Belt",
  "Headwear",
  "Accessories",
];

export type ItemTypeType =
  | "Tops"
  | "Bottoms"
  | "Outerwear"
  | "Dresses"
  | "Shoes"
  | "Belt"
  | "Headwear"
  | "Accessories";

export interface SubType {
  key: ItemTypeType;
  value: string;
}

export const itemSubTypes: SubType[] = [
  // Tops
  { key: "Tops", value: "T-Shirt" },
  { key: "Tops", value: "Long Sleeve Tee" },
  { key: "Tops", value: "Button-Down" },
  { key: "Tops", value: "Blouse" },
  { key: "Tops", value: "Sweater" },
  { key: "Tops", value: "Tank Top" },
  { key: "Tops", value: "Polo" },
  { key: "Tops", value: "Vest" },
  { key: "Tops", value: "Dress Shirt" },

  // Bottoms
  { key: "Bottoms", value: "Jeans" },
  { key: "Bottoms", value: "Dress Pants" },
  { key: "Bottoms", value: "Sweatpants" },
  { key: "Bottoms", value: "Cargo Pants" },
  { key: "Bottoms", value: "Leggings" },
  { key: "Bottoms", value: "Pants" },
  { key: "Bottoms", value: "Shorts" },
  { key: "Bottoms", value: "Denim Shorts" },
  { key: "Bottoms", value: "Skirt" },
  { key: "Bottoms", value: "Mini Skirt" },
  { key: "Bottoms", value: "Midi Skirt" },
  { key: "Bottoms", value: "Maxi Skirt" },
  { key: "Bottoms", value: "Overalls" },

  // Outerwear
  { key: "Outerwear", value: "Hoodie" },
  { key: "Outerwear", value: "Zip-Up Jacket" },
  { key: "Outerwear", value: "Coat" },
  { key: "Outerwear", value: "Puffer Jacket" },
  { key: "Outerwear", value: "Blazer" },
  { key: "Outerwear", value: "Bomber Jacket" },
  { key: "Outerwear", value: "Denim Jacket" },
  { key: "Outerwear", value: "Jacket" },
  { key: "Outerwear", value: "Raincoat" },
  { key: "Outerwear", value: "Fleece" },
  { key: "Outerwear", value: "Windbreaker" },
  { key: "Outerwear", value: "Trench Coat" },

  // Dresses
  { key: "Dresses", value: "Mini Dress" },
  { key: "Dresses", value: "Midi Dress" },
  { key: "Dresses", value: "Maxi Dress" },
  { key: "Dresses", value: "Sundress" },
  { key: "Dresses", value: "Wrap Dress" },
  { key: "Dresses", value: "Bodycon Dress" },
  { key: "Dresses", value: "Slip Dress" },
  { key: "Dresses", value: "Romper" },

  // Shoes
  { key: "Shoes", value: "Sneakers" },
  { key: "Shoes", value: "Running Shoes" },
  { key: "Shoes", value: "Boots" },
  { key: "Shoes", value: "Loafers" },
  { key: "Shoes", value: "Dress Shoes" },
  { key: "Shoes", value: "Sandals" },
  { key: "Shoes", value: "Slides" },
  { key: "Shoes", value: "Heels" },
  { key: "Shoes", value: "Flats" },
  { key: "Shoes", value: "Mules" },

  // Belt
  { key: "Belt", value: "Leather Belt" },
  { key: "Belt", value: "Canvas Belt" },
  { key: "Belt", value: "Chain Belt" },
  { key: "Belt", value: "Braided Belt" },

  // Headwear
  { key: "Headwear", value: "Baseball Cap" },
  { key: "Headwear", value: "Beanie" },
  { key: "Headwear", value: "Bucket Hat" },
  { key: "Headwear", value: "Beret" },
  { key: "Headwear", value: "Fedora" },
  { key: "Headwear", value: "Visor" },
  { key: "Headwear", value: "Headband" },

  // Accessories
  { key: "Accessories", value: "Watch" },
  { key: "Accessories", value: "Sunglasses" },
  { key: "Accessories", value: "Necklace" },
  { key: "Accessories", value: "Bracelet" },
  { key: "Accessories", value: "Ring" },
  { key: "Accessories", value: "Earrings" },
  { key: "Accessories", value: "Scarf" },
  { key: "Accessories", value: "Gloves" },
  { key: "Accessories", value: "Bag" },
  { key: "Accessories", value: "Purse" },
  { key: "Accessories", value: "Backpack" },
  { key: "Accessories", value: "Tote Bag" },
  { key: "Accessories", value: "Wallet" },
  { key: "Accessories", value: "Tie" },
  { key: "Accessories", value: "Bow Tie" },
  { key: "Accessories", value: "Socks" },
];

export const itemColors = [
  "White",
  "Black",
  "Grey",
  "Khaki",
  "Brown",
  "Blue",
  "Green",
  "Red",
  "Pink",
  "Yellow",
  "Orange",
  "Purple",
  "Silver",
  "Gold",
  "Multicolor",
];

export const COLOR_NAMES_MAP = new Map([
  ["000000", "Black"],
  ["0000FF", "Blue"],
  ["00FF00", "Green"],
  ["660099", "Purple"],
  ["808080", "Grey"],
  ["964B00", "Brown"],
  ["C0C0C0", "Silver"],
  ["F0E68C", "Khaki"],
  ["FF0000", "Red"],
  ["FF681F", "Orange"],
  ["FFC0CB", "Pink"],
  ["FFD700", "Gold"],
  ["FFFF00", "Yellow"],
  ["FFFFFF", "White"],
]);

export const DEFAULT_PRESETS: NewPresetType[] = [
  {
    name: "Everyday Casual",
    types: {
      Tops: ["T-Shirt", "Long Sleeve Tee", "Polo"],
      Bottoms: ["Jeans", "Cargo Pants", "Shorts"],
      Shoes: ["Sneakers", "Sandals"],
    },
    favorited: false,
  },
  {
    name: "Smart Casual",
    types: {
      Tops: ["Button-Down", "Polo", "Sweater"],
      Bottoms: ["Jeans", "Dress Pants"],
      Shoes: ["Loafers", "Sneakers", "Boots"],
    },
    favorited: false,
  },
  {
    name: "Office Ready",
    types: {
      Tops: ["Dress Shirt", "Button-Down", "Blouse", "Polo"],
      Bottoms: ["Dress Pants", "Midi Skirt"],
      Outerwear: ["Blazer"],
      Shoes: ["Dress Shoes", "Loafers", "Heels", "Flats"],
    },
    favorited: false,
  },
  {
    name: "Summer Day",
    types: {
      Tops: ["T-Shirt", "Tank Top"],
      Bottoms: ["Shorts", "Denim Shorts", "Mini Skirt", "Midi Skirt"],
      Shoes: ["Sandals", "Slides", "Sneakers"],
    },
    favorited: false,
  },
  {
    name: "Easy Dress",
    types: {
      Dresses: ["Dresses"],
      Shoes: ["Sandals", "Flats", "Sneakers", "Mules"],
    },
    favorited: false,
  },
  {
    name: "Night Out",
    types: {
      Tops: ["Blouse", "Button-Down", "Tank Top"],
      Bottoms: ["Jeans", "Mini Skirt", "Dress Pants"],
      Shoes: ["Boots", "Heels", "Loafers"],
    },
    favorited: false,
  },
  {
    name: "Athleisure",
    types: {
      Tops: ["T-Shirt", "Tank Top", "Long Sleeve Tee"],
      Bottoms: ["Leggings", "Sweatpants", "Shorts"],
      Outerwear: ["Hoodie", "Zip-Up Jacket", "Windbreaker"],
      Shoes: ["Running Shoes", "Sneakers"],
    },
    favorited: false,
  },
  {
    name: "Cold Weather",
    types: {
      Tops: ["Sweater", "Long Sleeve Tee"],
      Bottoms: ["Jeans", "Cargo Pants", "Dress Pants"],
      Outerwear: ["Coat", "Puffer Jacket", "Trench Coat"],
      Shoes: ["Boots"],
    },
    favorited: false,
  },
  {
    name: "Date Night (Guys)",
    types: {
      Tops: ["Button-Down", "Dress Shirt", "Sweater", "Polo"],
      Bottoms: ["Jeans", "Dress Pants"],
      Outerwear: ["Blazer", "Bomber Jacket", "Denim Jacket"],
      Shoes: ["Loafers", "Boots", "Dress Shoes", "Sneakers"],
    },
    favorited: false,
  },
  {
    name: "Date Night (Girls)",
    types: {
      Dresses: [
        "Mini Dress",
        "Midi Dress",
        "Slip Dress",
        "Wrap Dress",
        "Bodycon Dress",
      ],
      Shoes: ["Heels", "Mules", "Flats", "Boots"],
    },
    favorited: false,
  },
];

export const NOTIFICATIONS = [
  {
    weekday: 2,
    hour: 8,
    minute: 0,
    title: "Start Your Week Right!",
    body: "Kick off your week strong! Open the app to plan your outfit.",
  },
  {
    weekday: 6,
    hour: 20,
    minute: 0,
    title: "Friday Night! 🎉",
    body: "Friday night’s here! Make sure you outfit is as good as your plans.",
  },
  {
    weekday: 7,
    hour: 9,
    minute: 0,
    title: "Weekend Vibes 🌴",
    body: "Your weekend starts now! Check Lookbook for outfit ideas.",
  },
];

export type NewItemType = Omit<ItemsType, "id" | "size">;
export type NewOutfitType = Omit<OutfitType, "id">;
export type NewPresetType = Omit<PresetType, "id">;
export type ItemPosition = {
  x: number;
  y: number;
  scale: number;
};

export type OutfitPositions = Record<number, ItemPosition>;
export type PresetTypesType = Record<string, string[]>;
