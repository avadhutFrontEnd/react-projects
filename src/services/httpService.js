import axios from "axios";
import Raven from "raven-js";
// import * as Sentry from "@sentry/react";
import { toast } from "react-toastify";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    Raven.captureException("Logging the Error", error);
    // --> we can  use this "toast" like an "object" :
    toast.error("An unexpected error occurred.");

    // --> we can  use this "toast" like an "function" :
    // toast("An unexpected error occurred.");
  }

  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
