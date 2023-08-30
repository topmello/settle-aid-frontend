import axios, { Method } from "axios";

/**
 * Axios request wrapper
 *
 * GET requests use URL parameters eg. /users?name=John
 * POST requests use a data body in JSON format
 * PUT requests use a data body in JSON format
 * DELETE requests use URL parameters eg. /users?name=John
 */

type RequestOptions = {
  method: Method;
  // URL for the request
  url: string;
  // data body for POST, PUT
  data?: object;
  // URL parameters for GET, DELETE
  params?: object;
  token?: string;
};

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;

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
export const fetch = async (options: RequestOptions) => {
  const token = options.token;
  switch (options.method) {
    case "GET" || "get":
      return await axios.get(options.url, {
        params: options.params,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    case "POST" || "post":
      return await axios.post(options.url, options.data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
    case "PUT" || "put":
      return await axios.put(options.url, options.data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
    case "DELETE" || "delete":
      return await axios.delete(options.url, {
        params: options.params,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    default:
      return await axios.get(options.url, {
        params: options.params,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
  }
};