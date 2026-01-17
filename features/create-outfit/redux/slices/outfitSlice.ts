import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GenerateOutfitConfig = {
  top: boolean;
  bottom: boolean;
  outerwear: boolean;
  shoes: boolean;
  eyewear: boolean;
  headwear: boolean;
  necklaces: boolean;
  wristWear: boolean;
};

type OutfitState = {
  items: number[];
  genrateOutfitConfig: GenerateOutfitConfig;
};
const initialState: OutfitState = {
  items: [],
  genrateOutfitConfig: {
    top: false,
    bottom: false,
    outerwear: false,
    shoes: false,
    eyewear: false,
    headwear: false,
    necklaces: false,
    wristWear: false,
  },
};

const outfitSlice = createSlice({
  name: "outfit",
  initialState,
  reducers: {
    addNewItem(state, action: PayloadAction<number>) {
      state.items.push(action.payload);
    },
    removeItem(state, action: PayloadAction<number>) {
      const index: number = state.items.indexOf(action.payload);
      if (index !== -1) {
        // Check if the item was found
        state.items.splice(index, 1);
      }
    },
    clearAllItems(state) {
      state.items = [];
    },
    setGenerateOutfitConfig(
      state,
      action: PayloadAction<GenerateOutfitConfig>,
    ) {
      state.genrateOutfitConfig = action.payload;
    },
  },
});

export const selectOutfit = (state: RootState) => state.outfit.items;
export const selectGenerateOutfitConfig = (state: RootState) =>
  state.outfit.genrateOutfitConfig;

export const itemInOutfit =
  (id: number) =>
  (state: RootState): boolean => {
    if (state.outfit.items.includes(id)) {
      return true;
    } else {
      return false;
    }
  };

export const { addNewItem, removeItem, clearAllItems } = outfitSlice.actions;

export default outfitSlice.reducer;
