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
import { router } from "expo-router";
import { useNotification } from "./useNotification";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const token = useSelector(selectUserToken);
  const dispatch = useDispatch<AppDispatch>();
  const { pushNotification } = useNotification();
  const tokenExpiresAt = useSelector(
    (state: any) => state.auth?.tokenExpiresAt
  );
  const refreshToken = useSelector((state: any) => state.auth?.refreshToken);
  const refreshTokenExpiresAt = useSelector(
    (state: any) => state.auth?.refreshTokenExpiresAt
  );

  const redirectToLogin = useCallback(() => {
    router.replace("/auth/login");
    pushNotification({
      message: t("Session expired, please login again", { ns: "acc" }),
      type: "error",
    });
  }, []);

  const authenticated = () => {
    let authenticated = true;
    if (!token || !tokenExpiresAt) {
      return false;
    }
    if (Date.now() > new Date(tokenExpiresAt).getTime()) {
      if (!refreshToken || !refreshTokenExpiresAt) {
        redirectToLogin();
        return false;
      }
      if (Date.now() > new Date(refreshTokenExpiresAt).getTime()) {
        redirectToLogin();
        return false;
      } else {
        if (!sessionRefreshing) {
          setSessionRefreshing(true);
          dispatch(refreshTokenThunk()).unwrap()
            .catch((err) => {
              redirectToLogin();
            })
            .finally(() => {
              setSessionRefreshing(false);
            });
            return false;
        }
      }
    }
    return true;
  };

  const refreshSession = useCallback(() => {
    setSessionRefreshing(true);
    dispatch(refreshTokenThunk()).finally(() => {
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
    sessionRefreshing,
  };
};
