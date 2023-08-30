import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetch } from "../api/fetch";

export type LoginData = {
  username: string;
  password: string;
}

export type RegisterData = {
  username: string;
  password: string;
}

export interface AuthState {
  username: string | null;
  token: string | null;
  status: 'idle' | 'loading' | 'failed';
}

export const selectUserToken = (state: any) => state.auth?.token;
export const selectAuthStatus = (state: any) => state.auth?.status;

// login user thunk (action)
export const loginUser = createAsyncThunk('auth/loginUser', async (data: LoginData) => {
  const response = await fetch({
    method: 'POST',
    url: '/login',
    data,
  });
  return response.data;
});

// register user thunk (action)
export const registerUser = createAsyncThunk('auth/registerUser', async (data: RegisterData) => {
  const response = await fetch({
    method: 'POST',
    url: '/user',
    data,
  });
  return response.data;
});


const initialState: AuthState = {
  username: null,
  token: null,
  status: 'idle'
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.username = null;
      state.token = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'idle';
      state.username = action.payload.username;
      state.token = action.payload.access_token;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      console.error(action.error.message, action.meta);
      state.status = 'failed';
    });
    builder.addCase(registerUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.status = 'idle';
      state.username = action.payload.username;
      state.token = action.payload.token;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      console.error(action.error.message, action.meta);
      state.status = 'failed';
    });
  }
});

export default authSlice.reducer;
