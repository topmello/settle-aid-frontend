import { useEffect } from "react";
import axios, { Method } from "axios";
import { useDispatch } from "react-redux";

import { loginRequest, loginSuccess, loginFailure } from "../store/login";

const useLogin = (username: string, password: string) => {
  const dispatch = useDispatch();

  const loginForm = new FormData();
  loginForm.append("username", username);
  loginForm.append("password", password);

  const options = {
    method: "POST",
    url: "http://34.129.1.154:8000/login",
    data: loginForm,
  };

  const login = async () => {
    dispatch(loginRequest());

    try {
      const response = await axios(options);
      dispatch(loginSuccess(response.data));
    } catch (error: any) {
      dispatch(loginFailure({ message: error.message }));
    }
  };

  useEffect(() => {
    login();
  }, [username, password]);
};

export default useLogin;
