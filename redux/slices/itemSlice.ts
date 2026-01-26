import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ItemState = {
  currentItem: number;
};
const initialState: ItemState = {
  currentItem: -1,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setCurrentItem(state, action: PayloadAction<number>) {
      state.currentItem = action.payload;
    },
    clearCurrentItem(state) {
      state.currentItem = -1;
    },
  },
});

export const selectCurrentItem = (state: RootState) => state.item.currentItem;

export const { setCurrentItem, clearCurrentItem } = itemSlice.actions;

export default itemSlice.reducer;
