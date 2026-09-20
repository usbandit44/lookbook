import { PresetType } from "@/db/schemas/presets";
import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PresetSlice = PresetType;
const initialState: PresetSlice = {
  id: -1,
  name: "",
  types: {},
  favorited: false,
};

const presetSlice = createSlice({
  name: "preset",
  initialState,
  reducers: {
    setPresetState(state, action: PayloadAction<PresetType>) {
      state.favorited = action.payload.favorited;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.types = action.payload.types;
    },
    clearPresetState(state) {
      state.favorited = false;
      state.id = -1;
      state.name = "";
      state.types = {};
    },
    addToTypes(state, action: PayloadAction<{ key: string; value: string }>) {
      (state.types[action.payload.key] ??= []).push(action.payload.value);
    },
    removeFromTypes(
      state,
      action: PayloadAction<{ key: string; value: string }>,
    ) {
      state.types[action.payload.key] = (
        state.types[action.payload.key] ?? []
      ).filter((t) => t !== action.payload.value);
    },
    clearPresetType(state, action: PayloadAction<{ key: string }>) {
      delete state.types[action.payload.key];
    },
    clearPresetTypes(state) {
      state.types = {};
    },
    setPresetName(state, action: PayloadAction<{ name: string }>) {
      state.name = action.payload.name;
    },
    setPresetId(state, action: PayloadAction<{ id: number }>) {
      state.id = action.payload.id;
    },
  },
});

export const selectCurrentPreset = (state: RootState) => state.preset;
export const selectCurrentPresetId = (state: RootState) => state.preset.id;

export const {
  setPresetState,
  clearPresetState,
  addToTypes,
  removeFromTypes,
  clearPresetType,
  setPresetName,
  clearPresetTypes,
  setPresetId,
} = presetSlice.actions;

export default presetSlice.reducer;
