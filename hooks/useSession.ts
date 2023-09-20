import { throttle } from 'lodash';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import {
  selectToken,
  selectTokenExpiresAt,
  selectRefreshToken,
  selectRefreshTokenExpiresAt,
  refreshToken as doRefreshToken,
  logoutUser,
} from "../store/authSlice";

const DEBUG = true;

const _checkSession = async (dispatch: any, token:any, tokenExpireAt:any, refreshToken:any, refreshTokenExpireAt:any) => {
  if (!token || !tokenExpireAt || !refreshToken || !refreshTokenExpireAt) {
    DEBUG && console.log("no token or refresh token");
    dispatch(logoutUser());
    return false;
  } else if (
    new Date(tokenExpireAt) < new Date()
  ) {
    if (
      new Date(refreshTokenExpireAt) < new Date()
    ) {
      DEBUG && console.log("refresh token expired");
      dispatch(logoutUser());
      return false;
    } else {
      try {
        DEBUG && console.log("refreshing token");
        await dispatch(doRefreshToken()).unwrap();
        return true;
      } catch (e) {
        DEBUG && console.log("refresh token failed");
        dispatch(logoutUser());
        return false;
      }
    }
  } else {
    DEBUG && console.log("token is valid");
    return true;
  }
}

const throttleCheckSession = throttle(_checkSession, 1000);

export const useSession = () => {
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector(selectToken);
  const tokenExpireAt = useSelector(selectTokenExpiresAt);
  const refreshToken = useSelector(selectRefreshToken);
  const refreshTokenExpireAt = useSelector(selectRefreshTokenExpiresAt);

  const checkSession = async () => {
    return throttleCheckSession(dispatch, token, tokenExpireAt, refreshToken, refreshTokenExpireAt);
  }
  
  return {
    token,
    checkSession,
  };
};
