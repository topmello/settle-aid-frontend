import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetch } from "../api/fetch";
import store from ".";

export type LoginData = {
  username: string;
  password: string;
}

export type RegisterData = {
  username: string;
  password: string;
}

export interface AuthState {
  username?: string;
  token?: string;
  tokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  status: 'idle' | 'login' | 'loginSuccess' | 'loginFail' | 'logout' | 'registering' | 'registerSuccess' | 'registerFail' | 'refreshing' | 'refreshSuccess' | 'refreshFail' | 'logout';
}

export const selectUserToken = (state: any) => state.auth?.token;
export const selectAuthStatus = (state: any) => state.auth?.status;
export const selectTokenExpiresAt = (state: any) => state.auth?.tokenExpiresAt;
export const selectRefreshToken = (state: any) => state.auth?.refreshToken;
export const selectRefreshTokenExpiresAt = (state: any) => state.auth?.refreshTokenExpiresAt;

// login user thunk (action)
export const loginUser = createAsyncThunk('auth/loginUser', async (data: LoginData) => {
  const response = await fetch({
    method: 'POST',
    url: '/login/v2/',
    data,
  });
  return response.data;
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async (arg, {getState}) => {
  const state = getState() as any;
  const response = await fetch({
    method: 'POST',
    url: '/login/v2/refresh/',
    data: {
      refresh_token: state.auth.refreshToken,
    }
  });
  return response.data;
});


// register user thunk (action)
export const registerUser = createAsyncThunk('auth/registerUser', async (data: RegisterData) => {
  const response = await fetch({
    method: 'POST',
    url: '/user/',
    data,
  });
  return response.data;
});


const initialState: AuthState = {
  status: 'idle'
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      delete state.username;
      delete state.token;
      delete state.tokenExpiresAt;
      delete state.refreshToken;
      delete state.refreshTokenExpiresAt;
      state.status = 'logout';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'login';
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'loginSuccess';
      state.username = action.payload.username;
      state.token = action.payload.access_token;
      state.tokenExpiresAt = action.payload.access_token_expire;
      state.refreshToken = action.payload.refresh_token;
      state.refreshTokenExpiresAt = action.payload.refresh_token_expire;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = 'loginFail';
    });
    builder.addCase(registerUser.pending, (state) => {
      state.status = 'registering';
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.status = 'registerSuccess';
      state.username = action.payload.username;
      state.token = action.payload.token;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.status = 'registerFail';
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.token = action.payload.access_token;
      state.tokenExpiresAt = action.payload.access_token_expire;
      state.refreshToken = action.payload.refresh_token;
      state.refreshTokenExpiresAt = action.payload.refresh_token_expire;
      state.status = 'refreshSuccess';
    });
    builder.addCase(refreshToken.rejected, (state, action) => {
      state.status = 'refreshFail';
    });
  }
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
