import { ItemPosition, OutfitPositions } from "@/constants/constants";
import { RootState } from "@/redux/store";
import { repos } from "@/repo/repo";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const DEFAULT_POSITIONS: Record<string, ItemPosition> = {
  Tops: { x: 53, y: 23, scale: 3 },
  Bottoms: { x: 52, y: 220, scale: 3 },
  Outerwear: { x: 177, y: 64, scale: 2.3 },
  Dresses: { x: 47, y: 87, scale: 3 },
  Shoes: { x: 225, y: 430, scale: 1.5 },
  Belt: { x: 217, y: 214, scale: 1.5 },
  Headwear: { x: 0, y: 18, scale: 1 },
  Accessories: { x: 5, y: 195, scale: 1 },
};

const getDefaultPosition = (type: string): ItemPosition => ({
  ...(DEFAULT_POSITIONS[type] ?? { x: 0, y: 0, scale: 1 }),
});

export const addNewItem = createAsyncThunk(
  "outfit/addNewItem", // just a name, any unique string
  async (id: number) => {
    const result = await repos.itemRepo.getItem(id); // slow repo call
    return { id, type: result.type }; // e.g. true or false
  },
);

export const setOutfitItems = createAsyncThunk(
  "outfit/setOutfitItems",
  async (ids: number[]) => {
    const types = await Promise.all(
      ids.map(async (id) => {
        const result = await repos.itemRepo.getItem(id);
        return { id, type: result.type };
      }),
    );
    return types;
  },
);

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
    addNewItemWithPosition(
      state,
      action: PayloadAction<{ id: number; position: ItemPosition }>,
    ) {
      state.items.push(action.payload.id);
      state.outfitPositions[action.payload.id] = action.payload.position;
    },
    setOutfitItemsWithPositions(
      state,
      action: PayloadAction<{ items: number[]; positions: OutfitPositions }>,
    ) {
      state.items = action.payload.items;
      if (action.payload.positions) {
        state.outfitPositions = action.payload.positions;
      } else {
        action.payload.items.forEach((id) => {
          if (state.outfitPositions[id] == null) {
            state.outfitPositions[id] = { x: 0, y: 0, scale: 1 };
          }
        });
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      const index: number = state.items.indexOf(action.payload);
      if (index !== -1) {
        // Check if the item was found
        state.items.splice(index, 1);
      }
      delete state.outfitPositions[action.payload];
    },
    clearAllItems(state) {
      state.items = [];
      state.outfitPositions = {};
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
    // clearOutfitPosition(state) {
    //   state.outfitPositions = {};
    // },
    updateItemPosition(
      state,
      action: PayloadAction<{ id: number; position: ItemPosition }>,
    ) {
      state.outfitPositions[action.payload.id] = action.payload.position;
    },
    // removeItemPosition(state, action: PayloadAction<{ id: number }>) {
    //   delete state.outfitPositions[action.payload.id];
    // },
    // setOutfitPosition(
    //   state,
    //   action: PayloadAction<{ positions: OutfitPositions }>,
    // ) {
    //   state.outfitPositions = action.payload.positions;
    // },
    setFavorited(state, action: PayloadAction<boolean>) {
      state.favorited = action.payload;
    },
    moveItemUp(state, action: PayloadAction<number>) {
      const i = state.items.indexOf(action.payload);
      if (i === -1 || i === state.items.length - 1) return;
      [state.items[i], state.items[i + 1]] = [
        state.items[i + 1],
        state.items[i],
      ];
    },
    moveItemDown(state, action: PayloadAction<number>) {
      const i = state.items.indexOf(action.payload);
      if (i <= 0) return;
      [state.items[i - 1], state.items[i]] = [
        state.items[i],
        state.items[i - 1],
      ];
    },
    moveItemToFront(state, action: PayloadAction<number>) {
      const i = state.items.indexOf(action.payload);
      if (i === -1 || i === state.items.length - 1) return;
      state.items.splice(i, 1);
      state.items.push(action.payload);
    },
    moveItemToBack(state, action: PayloadAction<number>) {
      const i = state.items.indexOf(action.payload);
      if (i <= 0) return;
      state.items.splice(i, 1);
      state.items.unshift(action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addNewItem.fulfilled, (state, action) => {
        state.items.push(action.payload.id);
        console.log(action.payload.type);
        state.outfitPositions[action.payload.id] = getDefaultPosition(
          action.payload.type,
        );

        // action.payload = what the thunk returned
      })
      .addCase(setOutfitItems.fulfilled, (state, action) => {
        state.items = [];
        state.outfitPositions = {};
        action.payload.forEach((item) => {
          state.items.push(item.id);
          state.outfitPositions[item.id] = getDefaultPosition(item.type);
        });
      });

    // action.payload = what the thunk returned
  },
});

export const selectOutfit = (state: RootState) => state.outfit.items;

export const selectCurrentOutfitId = (state: RootState) =>
  state.outfit.currentOutfit;

export const getItemsPositions = (state: RootState) =>
  state.outfit.outfitPositions;
export const getFavorited = (state: RootState) => state.outfit.favorited;

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
  addNewItemWithPosition,
  setOutfitItemsWithPositions,
  removeItem,
  clearAllItems,
  setCurrentOutfit,
  clearCurrentOutfit,
  updateItemPosition,
  // setOutfitPosition,
  // // removeItemPosition,
  // clearOutfitPosition,
  setFavorited,
  moveItemUp,
  moveItemDown,
  moveItemToFront,
  moveItemToBack,
} = outfitSlice.actions;

export default outfitSlice.reducer;
