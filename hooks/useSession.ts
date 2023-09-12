import { useDispatch, useSelector } from "react-redux";
import {
  LoginData,
  RegisterData,
  loginUser,
  logoutUser,
  registerUser,
  selectUserToken,
} from "../store/authSlice";
import { useCallback, useMemo, useState } from "react";
import { refreshToken as refreshTokenThunk } from "../store/authSlice";
import { fetch } from "../api/fetch";
import { AppDispatch } from "../store";

export const useSession = () => {
  const token = useSelector(selectUserToken);
  const tokenExpiresAt = useSelector(
    (state: any) => state.auth?.tokenExpiresAt
  );
  const refreshToken = useSelector((state: any) => state.auth?.refreshToken);
  const refreshTokenExpiresAt = useSelector(
    (state: any) => state.auth?.refreshTokenExpiresAt
  );
  const dispatch = useDispatch<AppDispatch>();

  const authenticated = useMemo(() => {
    if (!token || !tokenExpiresAt) return false;
    if (Date.now() > new Date(tokenExpiresAt).getTime()) {
      if (!refreshToken || !refreshTokenExpiresAt) return false;
      if (Date.now() > new Date(refreshTokenExpiresAt).getTime()) {
        return false;
      } else {
        dispatch(refreshTokenThunk());
      }
    }
    return true;
  }, [token, tokenExpiresAt, refreshToken, refreshTokenExpiresAt]);

  const login = useCallback((data: LoginData) => {
    dispatch(loginUser(data));
  }, []);

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, []);

  const register = useCallback((data: RegisterData) => {
    dispatch(registerUser(data));
  }, []);

  return {
    token,
    authenticated,
    login,
    logout,
    register,
  };
};
