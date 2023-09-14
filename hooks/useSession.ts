import { useDispatch, useSelector } from "react-redux";
import {
  selectRefreshToken,
  selectRefreshTokenExpiresAt,
  selectTokenExpiresAt,
  selectUserToken,
} from "../store/authSlice";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { pushNotification } = useNotification();

  const token = useSelector(selectUserToken);
  const tokenExpiresAt = useSelector(selectTokenExpiresAt);
  const refreshToken = useSelector(selectRefreshToken);
  const refreshTokenExpiresAt = useSelector(selectRefreshTokenExpiresAt);

  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [sessionRefreshing, setSessionRefreshing] = useState(false);

  const doRefreshToken = useCallback(() => {
    setSessionRefreshing(true);
    dispatch(refreshTokenThunk())
      .unwrap()
      .catch((err) => {
        console.error(err);
        doRedirectToLogin();
      })
      .finally(() => {
        setSessionRefreshing(false);
      });
  }, [dispatch]);
  
  const doRedirectToLogin = useCallback(() => {
    router.replace("/auth/login");
    pushNotification({
      message: t("Session expired, please login again", { ns: "acc" }),
      type: "warning",
    });
  }, [pushNotification, t]);

  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
      doRedirectToLogin();
      return;
    }
    if (new Date().getUTCMilliseconds() > new Date(tokenExpiresAt).getTime()) {
      if (refreshToken && new Date().getUTCMilliseconds() < new Date(refreshTokenExpiresAt).getTime()) {
        console.log("refreshing token");
        doRefreshToken();
      } else {
        doRedirectToLogin();
        return;
      }
    } else {
      setIsLoggedIn(true);
    }
  }, [token, tokenExpiresAt, refreshTokenExpiresAt, doRefreshToken, doRedirectToLogin]);

  return {
    token,
    isLoggedIn,
    sessionRefreshing,
  };
};
