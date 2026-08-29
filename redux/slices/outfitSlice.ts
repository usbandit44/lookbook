import { ItemPosition, OutfitPositions } from "@/constants/constants";
import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OutfitState = {
  items: number[];
  currentOutfit: { id: number; name: string };
  outfitPositions: OutfitPositions;
  favorited: boolean;
};
const initialState: OutfitState = {
  items: [],
  currentOutfit: { id: -1, name: "" },
  outfitPositions: {},
  favorited: false,
};

const outfitSlice = createSlice({
  name: "outfit",
  initialState,
  reducers: {
    addNewItem(state, action: PayloadAction<number>) {
      state.items.push(action.payload);
    },
    setItems(state, action: PayloadAction<number[]>) {
      state.items = action.payload;
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
    setCurrentOutfit(
      state,
      action: PayloadAction<{ id: number; name: string }>,
    ) {
      state.currentOutfit = action.payload;
    },
    clearCurrentOutfit(state) {
      state.currentOutfit = { id: -1, name: "" };
    },
    clearOutfitPosition(state) {
      state.outfitPositions = {};
    },
    setItemPosition(
      state,
      action: PayloadAction<{ id: number; position: ItemPosition }>,
    ) {
      state.outfitPositions[action.payload.id] = action.payload.position;
    },
    removeItemPosition(state, action: PayloadAction<{ id: number }>) {
      delete state.outfitPositions[action.payload.id];
    },
    setOutfitPosition(
      state,
      action: PayloadAction<{ positions: OutfitPositions }>,
    ) {
      state.outfitPositions = action.payload.positions;
    },
    setFavorited(state, action: PayloadAction<{ favorited: boolean }>) {
      state.favorited = action.payload.favorited;
    },
  },
});

export const selectOutfit = (state: RootState) => state.outfit.items;

export const selectCurrentOutfitId = (state: RootState) =>
  state.outfit.currentOutfit;

export const getItemsPositions = (state: RootState) =>
  state.outfit.outfitPositions;

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
  setItems,
  removeItem,
  clearAllItems,
  setCurrentOutfit,
  clearCurrentOutfit,
  setItemPosition,
  setOutfitPosition,
  removeItemPosition,
  clearOutfitPosition,
} = outfitSlice.actions;

export default outfitSlice.reducer;
