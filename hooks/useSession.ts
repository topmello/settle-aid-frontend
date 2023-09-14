import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
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
import { AppDispatch } from "../store";

/**
 * Authenticated user session hook
 * @description This hook is used to get the latest token and auth status
 * @returns {
 * token: string,
 * authenticated: boolean,
 * login: (data: LoginData) => void,
 * logout: () => void,
 * register: (data: RegisterData) => void,
 * getSessionAuthenticated: () => Promise<boolean>,
 * getSessionToken: () => Promise<string>, 
 * }
 */
export const useSession = () => {
  const [sessionRefreshing, setSessionRefreshing] = useState(false);
  const token = useSelector(selectUserToken);
  const dispatch = useDispatch<AppDispatch>();
  const tokenExpiresAt = useSelector(
    (state: any) => state.auth?.tokenExpiresAt
  );
  const refreshToken = useSelector((state: any) => state.auth?.refreshToken);
  const refreshTokenExpiresAt = useSelector(
    (state: any) => state.auth?.refreshTokenExpiresAt
  );

  const authenticated = useMemo(() => {
    if (!token || !tokenExpiresAt) return false;
    if (Date.now() > new Date(tokenExpiresAt).getTime()) {
      if (!refreshToken || !refreshTokenExpiresAt) return false;
      if (Date.now() > new Date(refreshTokenExpiresAt).getTime()) {
        return false;
      } else {
        if (!sessionRefreshing) {
          setSessionRefreshing(true);
          dispatch(refreshTokenThunk())
            .finally(() => {
              setSessionRefreshing(false);
            });
        }
      }
    }
    return true;
  }, [token, tokenExpiresAt, refreshToken, refreshTokenExpiresAt]);

  const refreshSession = useCallback(() => {
    setSessionRefreshing(true);
    dispatch(refreshTokenThunk())
      .finally(() => {
        setSessionRefreshing(false);
      });
  }, []);

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
    refreshSession,
    sessionRefreshing
  };
};
