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
  language: "en-AU" | "zh-CN" | "hi-IN";
}

const initialState: AppState = {
  isLoading: false,
  isFail: null,
  theme: undefined,
  language: "en-AU"
};

export const selectTheme = (state: any) => state.app.theme;
export const selectLanguage = (state: any) => state.app.language;

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
    },
    setLanguage(state, action: PayloadAction<{ language: "en-AU" | "zh-CN" | "hi-IN" }>) {
      state.language = action.payload.language;
    },
  },
});

export const { loading, loaded, fail, setDarkTheme, setLightTheme, setSystemTheme, setTheme, setLanguage } = appSlice.actions;
export default appSlice.reducer;
