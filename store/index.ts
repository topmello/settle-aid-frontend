import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import appSlice from "./appSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    app: appSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
