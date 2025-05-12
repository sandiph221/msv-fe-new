import axios from "axios";
import { toast } from "react-toastify";

// SETTING DEFAULT
if (window.location.host.includes("localhost")) {
  axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;
} else {
  axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL_LIVE;
}
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = `Bearer ${
      localStorage.getItem("userInfo") &&
      localStorage.getItem("userInfo") != "undefined"
        ? JSON.parse(localStorage.getItem("userInfo")).access_token
        : ""
    }`;

    if (token) {
      config.headers["Authorization"] = token;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    if (error.response) {
      const { status } = error.response;
      const location = window.location.pathname;
      if (status === 401 && location != "/login") {
        await toast.error(
          "Your session has been expired, please login to continue"
        );
        await localStorage.clear();
        window.location.href = "/login";
      }
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
