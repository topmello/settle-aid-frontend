import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
    isLoading: boolean;
    token: string | null;
    error: { message: string } | null;
}

const initialLoginState: LoginState = {
    isLoading: false,
    token: null,
    error: null,
};

const loginSlice = createSlice({
    name: 'login',
    initialState: initialLoginState,
    reducers: {
        loginRequest(state) {
            state.isLoading = true;
        },
        loginSuccess(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.token = action.payload;
            state.error = null;
        },
        loginFailure(state, action: PayloadAction<{ message: string }>) {
            state.isLoading = false;
            state.token = null;
            state.error = action.payload;
        }
    }
});

export const { loginRequest, loginSuccess, loginFailure } = loginSlice.actions;
export default loginSlice.reducer;