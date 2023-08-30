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
  error: { 
    message: string 
  } | null;
}

const initialState: AppState = {
  isLoading: false,
  error: null,
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
    error(state, action: PayloadAction<{ message: string }>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { loading, loaded, error } = appSlice.actions;
export default appSlice.reducer;