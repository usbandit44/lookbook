import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CameraState = {
  newItemImg: string;
};
const initialState: CameraState = {
  newItemImg: "",
};

const cameraSlice = createSlice({
  name: "camera",
  initialState,
  reducers: {
    updateNewItemImg(state, action: PayloadAction<string>) {
      state.newItemImg = action.payload;
    },
  },
});

export const selectNewItemImg = (state: RootState) => state.camera.newItemImg;

export const { updateNewItemImg } = cameraSlice.actions;

export default cameraSlice.reducer;
