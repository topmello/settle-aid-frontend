export interface ErrorResponse {
  data: {
    details: {
      type: string;
      msg: string;
    };
  };
}

export interface CustomError extends Error {
  response?: ErrorResponse;
}
