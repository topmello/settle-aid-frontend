import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
  isLoadingLogin: boolean;
  token: string | null;
  errorLogin: { message: string } | null;
}

const initialLoginState: LoginState = {
  isLoadingLogin: false,
  token: null,
  errorLogin: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState: initialLoginState,
  reducers: {
    loginRequest(state) {
      state.isLoadingLogin = true;
    },
    loginSuccess(
      state,
      action: PayloadAction<{ access_token: string; token_type: string }>
    ) {
      state.isLoadingLogin = false;
      state.token = action.payload.access_token;
      state.errorLogin = null;
    },
    loginFailure(state, action: PayloadAction<{ message: string }>) {
      state.isLoadingLogin = false;
      state.token = null;
      state.errorLogin = action.payload;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure } = loginSlice.actions;
export default loginSlice.reducer;
