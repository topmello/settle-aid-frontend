import axios, { Method } from "axios";

/**
 * Axios request wrapper
 *
 * GET requests use URL parameters eg. /users?name=John
 * POST requests use a data body in JSON format
 * PUT requests use a data body in JSON format
 * DELETE requests use URL parameters eg. /users?name=John
 */

export type RequestOptions = {
  method: Method;
  // URL for the request
  url: string;
  // data body for POST, PUT
  data?: object;
  // URL parameters for GET, DELETE
  params?: object;
  // token for authorization
  token?: string | null;
};

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;

axios.interceptors.request.use(request => {
  console.log(JSON.stringify(request));
  return request
});

axios.interceptors.response.use(response => {
  console.log(JSON.stringify(response));
  return response
});

/**
 * Wrapper for axios requests
 * @param options - request options
 * @param options.method - HTTP method
 * @param options.url - URL for the request
 * @param options.data - data body for POST, PUT
 * @returns Axios promise response object
 * @example
 * const response = await fetch({
 *  method: 'POST',
 *  url: '/login',
 *    data: {
 *      username: 'John',
 *      password: 'Doe'
 *  }
 * });
 */
export const fetch = (options: RequestOptions) => {
  const token = options.token;

  switch (options.method) {
    case "GET" || "get":
      return axios.get(options.url, {
        params: options.params,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    case "POST" || "post":      
      return axios.post(options.url, options.data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
    case "PUT" || "put":
      return axios.put(options.url, options.data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
    case "DELETE" || "delete":
      return axios.delete(options.url, {
        params: options.params,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    default:
      return axios.get(options.url, {
        params: options.params,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
  }
};
