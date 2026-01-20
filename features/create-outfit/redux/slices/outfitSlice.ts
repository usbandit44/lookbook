import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OutfitState = {
  items: number[];
  currentOutfit: number;
};
const initialState: OutfitState = {
  items: [],
  currentOutfit: -1,
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
    setCurrentOutfit(state, action: PayloadAction<number>) {
      state.currentOutfit = action.payload;
    },
    clearCurrentOutfit(state) {
      state.currentOutfit = -1;
    },
  },
});

export const selectOutfit = (state: RootState) => state.outfit.items;

export const selectCurrentOutfitId = (state: RootState) =>
  state.outfit.currentOutfit;

export const itemInOutfit =
  (id: number) =>
  (state: RootState): boolean => {
    if (state.outfit.items.includes(id)) {
      return true;
    } else {
      return false;
    }
  };

export const {
  addNewItem,
  removeItem,
  clearAllItems,
  setCurrentOutfit,
  clearCurrentOutfit,
} = outfitSlice.actions;

export default outfitSlice.reducer;
