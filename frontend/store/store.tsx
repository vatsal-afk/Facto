// store/store.tsx
import { configureStore } from "@reduxjs/toolkit";
import { articleReducer } from "./articleSlice";

export const store = configureStore({
  reducer: {
    articleState: articleReducer, // Register your slice reducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
