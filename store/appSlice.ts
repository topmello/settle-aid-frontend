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
  language: "en-AU" | "zh-CN" | "hi-IN" | undefined;
  privacyChecked: boolean;
  notification: {
    message: string;
    type: "success" | "error" | "warning" | "info";
    timeout?: number;
  }
}

const initialState: AppState = {
  isLoading: false,
  isFail: null,
  theme: undefined,
  language: undefined,
  privacyChecked: false,
  notification: {
    message: "",
    type: "success",
    timeout: 4000,
  }
};

export const selectTheme = (state: any) => state.app.theme;
export const selectLanguage = (state: any) => state.app.language;
export const selectPrivacyChecked = (state: any) => state.app.privacyChecked;

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
    setTheme(
      state,
      action: PayloadAction<{ theme: "light" | "dark" | "system" }>
    ) {
      state.theme = action.payload.theme;
    },
    setLanguage(
      state,
      action: PayloadAction<{ language: "en-AU" | "zh-CN" | "hi-IN" }>
    ) {
      state.language = action.payload.language;
    },
    setPrivacyChecked(state) {
      state.privacyChecked = true;
    },
    setPrivacyUnchecked(state) {
      state.privacyChecked = false;
    },
    pushNotification(state, action: PayloadAction<{ message: string, type: "success" | "error" | "warning" | "info", timeout?:number }>) {
      state.notification = action.payload;
      setTimeout(() => {
        state.notification = {
          message: "",
          type: "success",
        }
      }, state.notification.timeout || 4000);
    },
  },
});

export const {
  loading,
  loaded,
  fail,
  setDarkTheme,
  setLightTheme,
  setSystemTheme,
  setTheme,
  setLanguage,
  setPrivacyChecked,
  setPrivacyUnchecked,
} = appSlice.actions;
export default appSlice.reducer;
