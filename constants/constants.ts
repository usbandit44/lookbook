/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { ItemsType } from "@/db/schemas/items";
import { OutfitType } from "@/db/schemas/outfits";

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

export const itemSubTypes = [
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

export type NewItemType = Omit<ItemsType, "id" | "size">;
export type NewOutfitType = Omit<OutfitType, "id">;
export type ItemPosition = {
  x: number;
  y: number;
  scale: number;
};

export type OutfitPositions = Record<number, ItemPosition>;
