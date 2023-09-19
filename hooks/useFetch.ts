import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetch, RequestOptions } from "../api/fetch";
import { loading, loaded, fail } from "../store/appSlice";
import { AppDispatch } from "../store";
import { CustomError, ErrorResponse } from "../types/errorResponse";

const useFetch = <T = any>(
  requestOptions: RequestOptions,
  deps: any[] = []
) => {
  const dispatch = useDispatch<AppDispatch>();

  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    dispatch(loading());

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
      } else {
        dispatch(fail({ message: response.data.details.type }));
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    requestOptions.token,
    JSON.stringify(requestOptions.data),
    requestOptions.params,
    ...deps,
  ]);

  return [data, fetchData];
};

export default useFetch;
