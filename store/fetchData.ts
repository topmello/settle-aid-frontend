import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FetchDataState {
    isLoading: boolean;
    data: any;
    error: { message: string } | null;
}

const initialFetchDataState: FetchDataState = {
    isLoading: false,
    data: null,
    error: null,
};

const fetchDataSlice = createSlice({
    name: 'fetchData',
    initialState: initialFetchDataState,
    reducers: {
        fetchDataRequest(state) {
            state.isLoading = true;
        },
        fetchDataSuccess(state, action: PayloadAction<any>) {
            state.isLoading = false;
            state.data = action.payload;
            state.error = null;
        },
        fetchDataFailure(state, action: PayloadAction<{ message: string }>) {
            state.isLoading = false;
            state.data = null;
            state.error = action.payload;
        }
    }
});

export const { fetchDataRequest, fetchDataSuccess, fetchDataFailure } = fetchDataSlice.actions;
export default fetchDataSlice.reducer;