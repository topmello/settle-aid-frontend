import { useEffect } from "react";
import axios, { Method } from "axios";
import { useDispatch } from "react-redux";

import {
  fetchDataRequest,
  fetchDataSuccess,
  fetchDataFailure,
} from "../store/fetchData";

const useFetch = (
  endpoint: string,
  method: Method,
  token: string | null,
  body: object
) => {
  const dispatch = useDispatch();

  const options: {
    method: Method;
    url: string;
    timeout: number;
    headers: {
      Authorization?: string;
      "Content-Type"?: string;
    };
    data?: object;
  } = {
    method: method,
    url: `http://34.129.1.154:8000/${endpoint}`,
    timeout: 5000,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (method !== "GET") {
    options.headers["Content-Type"] = "application/json";
    options.data = body;
  }

  const fetchData = async () => {
    dispatch(fetchDataRequest());

    try {
      const response = await axios(options);
      dispatch(fetchDataSuccess(response.data));
    } catch (error: any) {
      dispatch(fetchDataFailure({ message: error.message }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, JSON.stringify(body)]);
};

export default useFetch;
