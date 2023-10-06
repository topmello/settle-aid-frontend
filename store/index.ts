import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import appSlice from "./appSlice";
import routeSlice from "./routeSlice";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "@react-native-async-storage/async-storage";
import challengeSlice from "./challengeSlice";

export const store = configureStore({
  reducer: {
    auth: persistReducer(
      {
        key: "auth",
        storage,
      },
      authSlice
    ),
    app: persistReducer(
      {
        key: "app",
        storage,
      },
      appSlice
    ),
    route: persistReducer(
      {
        key: "route",
        storage,
      },
      routeSlice
    ),
    challenge: persistReducer(
      {
        key: "challenge",
        storage,
      },
      challengeSlice
    ),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
export const persistor = persistStore(store);
