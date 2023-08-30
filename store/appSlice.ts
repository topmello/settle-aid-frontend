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
}

const initialState: AppState = {
  isLoading: false,
  isFail: null,
};

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
  },
});

export const { loading, loaded, fail } = appSlice.actions;
export default appSlice.reducer;
