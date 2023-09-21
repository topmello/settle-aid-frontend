import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetch, RequestOptions } from "../api/fetch";
import { Method } from "axios";
import { loading, loaded, fail } from "../store/appSlice";
import { AppDispatch } from "../store";
import { CustomError, ErrorResponse } from "../types/errorResponse";
import { router, useRootNavigationState } from "expo-router";
import { useSession } from "./useSession";
import { useNotification } from "./useNotification";
import { useTranslation } from "react-i18next";

const useFetch = <T = any>(
  requestOptions: RequestOptions,
  deps: any[] = [],
  initialData?: T,
  shouldFetchImmediately: boolean = true,
  notificationMsg?: string
) => {
  const dispatch = useDispatch<AppDispatch>();

  const { pushNotification } = useNotification();

  const { t } = useTranslation();

  const [data, setData] = useState<T | null>(initialData || null);

  const { token, checkSession } = useSession();

  const fetchData = async (
    overrideOptions?: RequestOptions
  ): Promise<T | null> => {
    let options = overrideOptions || requestOptions;
    let finalOptions = {
      ...options,
      ...(token ? { token } : {}),
    };

    const isSessionValid = await checkSession();

    if (!isSessionValid) {
      dispatch(fail({ message: "Session Invalid" }));
      return null;
    }

    try {
      dispatch(loading());
      const response = await fetch(finalOptions);
      if (notificationMsg) {
        pushNotification({
          message: notificationMsg || t("comm:Done"),
          type: "success",
        });
      }
      setData(response.data);
      dispatch(loaded());
      return response.data;
    } catch (error) {
      const errRes = error as CustomError;
      const response = errRes.response as ErrorResponse;

      if (!response) {
        dispatch(fail({ message: "Network Error" }));
        return null;
      }

      // Ensure response.data, response.data.details, and response.data.details.type are defined before checking their values
      else if (
        !response.data ||
        !response.data.details ||
        !response.data.details.type
      ) {
        dispatch(fail({ message: "Unknown Error" }));
        return null;

        // If not authenticated, redirect to login
      } else if (response.data.details.type === "invalid_credentials") {
        dispatch(fail({ message: response.data.details.type }));
        return null;
      } else if (response.data.details.type === "no_location") {
        dispatch(fail({ message: response.data.details.type }));
        pushNotification({
          message: t(response.data.details.msg, {
            ns: "route",
          }),
          type: "error",
        });
        return null;
      } else if (response.data.details.type === "already_voted") {
        dispatch(fail({ message: response.data.details.type }));

        let method: Method = "DELETE";
        let newOptions = { ...finalOptions, method: method };

        await fetch(newOptions)
          .then((res) => {
            if (res.status === 204) {
              pushNotification({
                message: t("Remove route from favorite", {
                  ns: "route",
                }),
                type: "success",
              });
              return null;
            } else {
              return null;
            }
          })
          .catch((err) => {
            console.log(JSON.stringify(err.response.data));
          });
        return null;
      } else {
        dispatch(fail({ message: response.data.details.type }));
        pushNotification({
          message: t(response.data.details.msg, {
            ns: "route",
          }),
          type: "error",
        });
        console.log(response.data.details.type);
        dispatch(loaded());
        return null;
      }
    }
  };

  useEffect(() => {
    if (shouldFetchImmediately) {
      fetchData();
    }
  }, [
    token,
    JSON.stringify(requestOptions.data),
    requestOptions.params,
    ...deps,
  ]);
  return [data, fetchData] as [T | null, typeof fetchData];
};

export default useFetch;
