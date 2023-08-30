import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetch, RequestOptions } from "../api/fetch";
import { loading, loaded, error as errorAction } from "../store/appSlice";
import { AppDispatch } from "../store";

const useFetch = (requestOptions: RequestOptions, deps: any[] = []) => {
  const dispatch = useDispatch<AppDispatch>();

  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    dispatch(loading());

    try {
      const response = await fetch(requestOptions);
      setData(response.data);
      dispatch(loaded());
    } catch (error: any) {
      dispatch(errorAction({ message: error.message }));
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

  return data;
};

export default useFetch;
