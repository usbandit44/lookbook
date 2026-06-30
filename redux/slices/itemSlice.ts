import type { NewItemType } from "@/constants/constants";
import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ItemState = {
  currentItemId: number;
  items: NewItemType[];
  index: number;
};
const initialState: ItemState = {
  currentItemId: -1,
  items: [],
  index: 0,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setCurrentItemId(state, action: PayloadAction<number>) {
      state.currentItemId = action.payload;
    },
    clearCurrentItemId(state) {
      state.currentItemId = -1;
    },
    setItems(state, action: PayloadAction<NewItemType[]>) {
      state.items = action.payload;
    },
    addItem(state, action: PayloadAction<NewItemType>) {
      state.items.push(action.payload);
    },
    clearItems(state) {
      state.items = [];
      state.index = 0;
    },
    increaseIndex(state) {
      state.index++;
    },
    decreaseIndex(state) {
      state.index--;
    },
    addItemTag(state, action: PayloadAction<{ index: number; tag: string }>) {
      state.items[action.payload.index].tags.push(action.payload.tag);
    },
    addItemTagToFront(
      state,
      action: PayloadAction<{ index: number; tag: string }>,
    ) {
      state.items[action.payload.index].tags.unshift(action.payload.tag);
    },
    removeItemTag(
      state,
      action: PayloadAction<{ index: number; tag: string }>,
    ) {
      state.items[action.payload.index].tags = state.items[
        action.payload.index
      ].tags.filter((item) => item !== action.payload.tag);
    },
    setItemType(state, action: PayloadAction<{ index: number; type: string }>) {
      state.items[action.payload.index].type = action.payload.type;
    },
    clearItemType(state, action: PayloadAction<{ index: number }>) {
      state.items[action.payload.index].type = "";
    },
    setItemName(state, action: PayloadAction<{ index: number; name: string }>) {
      state.items[action.payload.index].name = action.payload.name;
    },
    setItemImgUrl(
      state,
      action: PayloadAction<{ index: number; url: string }>,
    ) {
      state.items[action.payload.index].imgUrl = action.payload.url;
    },
    setItemColor(
      state,
      action: PayloadAction<{ index: number; color: string }>,
    ) {
      state.items[action.payload.index].color = action.payload.color;
    },
    setItemBackgroundRemoved(
      state,
      action: PayloadAction<{ index: number; backgroundRemoved: boolean }>,
    ) {
      state.items[action.payload.index].backgroundRemoved =
        action.payload.backgroundRemoved;
    },
  },
});

export const selectCurrentItem = (state: RootState) => state.item.currentItemId;
export const selectItems = (state: RootState) => state.item.items;
export const selectIndex = (state: RootState) => state.item.index;

export const {
  setCurrentItemId,
  clearCurrentItemId,
  clearItems,
  setItems,
  addItem,
  addItemTag,
  removeItemTag,
  setItemType,
  clearItemType,
  increaseIndex,
  setItemName,
  setItemImgUrl,
  addItemTagToFront,
  setItemColor,
  setItemBackgroundRemoved,
} = itemSlice.actions;

export default itemSlice.reducer;
