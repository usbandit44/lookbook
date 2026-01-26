import cameraReducer from "@/redux/slices/cameraSlice";
import itemReducer from "@/redux/slices/itemSlice";
import outfitReducer from "@/redux/slices/outfitSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // Define a top-level state field named `todos`, handled by `todosReducer`
    camera: cameraReducer,
    outfit: outfitReducer,
    item: itemReducer,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
