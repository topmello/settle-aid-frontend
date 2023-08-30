import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FetchDataState {
  isLoadingFetch: boolean;
  data: any;
  errorFetch: { message: string } | null;
}

const initialFetchDataState: FetchDataState = {
  isLoadingFetch: false,
  data: null,
  errorFetch: null,
};

const fetchDataSlice = createSlice({
  name: "fetchData",
  initialState: initialFetchDataState,
  reducers: {
    fetchDataRequest(state) {
      state.isLoadingFetch = true;
    },
    fetchDataSuccess(state, action: PayloadAction<any>) {
      state.isLoadingFetch = false;
      state.data = action.payload;
      state.errorFetch = null;
    },
    fetchDataFailure(state, action: PayloadAction<{ message: string }>) {
      state.isLoadingFetch = false;
      state.data = null;
      state.errorFetch = action.payload;
    },
  },
});

export const { fetchDataRequest, fetchDataSuccess, fetchDataFailure } =
  fetchDataSlice.actions;
export default fetchDataSlice.reducer;
