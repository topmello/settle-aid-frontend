import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetch, RequestOptions } from "../api/fetch";
import { loading, loaded, fail } from "../store/appSlice";
import { AppDispatch } from "../store";
import { CustomError, ErrorResponse } from "../types/errorResponse";
import { router } from "expo-router";
import { useSession } from "./useSession";

const useFetch = <T = any>(
  requestOptions: RequestOptions,
  deps: any[] = [],
  initialData?: T,
  shouldFetchImmediately: boolean = true
) => {
  const dispatch = useDispatch<AppDispatch>();

  const [data, setData] = useState<T | null>(initialData || null);

  const { checkSession } = useSession();

  const fetchData = async () => {
    dispatch(loading());

    const isSessionValid = await checkSession();

    if (!isSessionValid) {
      dispatch(fail({ message: "Session Invalid" }));
      router.replace("/auth/login");
      return;
    }

    try {
      const response = await fetch(requestOptions);
      setData(response.data);
      dispatch(loaded());

    } catch (error) {

      const errRes = error as CustomError;
      const response = errRes.response as ErrorResponse;

      if (!response) {
        dispatch(fail({ message: "Network Error" }));
        return;
      }

      // Ensure response.data, response.data.details, and response.data.details.type are defined before checking their values
      else if (
        !response.data ||
        !response.data.details ||
        !response.data.details.type
      ) {
        dispatch(fail({ message: "Unknown Error" }));
        return;

      // If not authenticated, redirect to login
      } else if (response.data.details.type === "invalid_credentials") {
        dispatch(fail({ message: response.data.details.type }));
        router.replace("/auth/login");
        return;
      
      } else {
        dispatch(fail({ message: response.data.details.type }));
      }
    }
  };

  useEffect(() => {
    if (shouldFetchImmediately) {
      fetchData();
    }
  }, [
    requestOptions.token,
    JSON.stringify(requestOptions.data),
    requestOptions.params,
    ...deps,
  ]);

  return [data, fetchData] as [T | null, typeof fetchData];
};

export default useFetch;
