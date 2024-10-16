// ** Library Imports
import axios, { AxiosError } from "axios";

// ** Services
import { refreshInfo } from "@/services/authService";

// ** Config
import { STATUS_CODES } from "@/config/status-codes";
import { loginRoute } from "@/config/url";

// ** Utils
import { handleAxiosError } from "./errorHandler";

const BASE_URL: string =
  import.meta.env.VITE_DATABASE_URL || import.meta.env.VITE_VERCEL_DATABASE_URL;

const AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken: string = localStorage.getItem("access-token")!;

    if (accessToken && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const pathname = window.location.pathname;
    const responseUrl = error.response?.config?.url;

    if (
      error.config &&
      error.response &&
      error.response.status === STATUS_CODES.UNAUTHORIZED &&
      pathname !== loginRoute &&
      responseUrl !== "/auth/refresh" &&
      responseUrl !== "/auth/logout"
    ) {
      try {
        const newToken = await refreshInfo(
          localStorage.getItem("rememberMe")
            ? JSON.parse(localStorage.getItem("rememberMe")!)
            : false,
        );
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axios.request(error.config);
      } catch (error) {
        handleAxiosError(error);
        window.location.href = loginRoute;
      }
    }
    return Promise.reject(error);
  },
);

export default AxiosInstance;
