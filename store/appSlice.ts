import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * For global states
 * - theme
 * - language
 * - loading
 * - notifications
 */
interface AppState {
  isLoading: boolean;
  isFail: {
    message: string;
  } | null;
  theme: "light" | "dark" | "system" | undefined;
}

const initialState: AppState = {
  isLoading: false,
  isFail: null,
  theme: undefined,
};

export const selectTheme = (state: any) => state.app.theme;

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    loading(state) {
      state.isLoading = true;
    },
    loaded(state) {
      state.isLoading = false;
    },
    fail(state, action: PayloadAction<{ message: string }>) {
      state.isLoading = false;
      state.isFail = action.payload;
    },
    setDarkTheme(state) {
      state.theme = "dark";
    },
    setLightTheme(state) {
      state.theme = "light";
    },
    setSystemTheme(state) {
      state.theme = "system";
    },
    setTheme(state, action: PayloadAction<{ theme: "light" | "dark" | "system" }>) {
      state.theme = action.payload.theme;
    }
  },
});

export const { loading, loaded, fail, setDarkTheme, setLightTheme, setSystemTheme, setTheme } = appSlice.actions;
export default appSlice.reducer;
