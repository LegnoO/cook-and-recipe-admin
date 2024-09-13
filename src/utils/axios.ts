// ** Library
import axios, { AxiosError } from "axios";

// ** Services
import { handleRefresh } from "@/utils/services/authService";

// ** Constants
import { STATUS_CODES } from "@/utils/constants/statusCodes";

const BASE_URL: string =
  import.meta.env.VITE_DATABASE_URL || import.meta.env.VITE_VERCEL_DATABASE_URL;

if (!BASE_URL) console.log("Wrong Backend URL!");

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
    if (
      error.config &&
      error.response &&
      error.response.status === STATUS_CODES.UNAUTHORIZED &&
      !error.response?.config?.url?.includes("/login") &&
      !error.request.responseURL.includes("/api/auth/refresh") &&
      !error.request.responseURL.includes("/auth/logout")
    ) {
      const newToken = await handleRefresh(
        localStorage.getItem("rememberMe")
          ? JSON.parse(localStorage.getItem("rememberMe")!)
          : false,
      );
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return axios.request(error.config);
    }

    return Promise.reject(error);
  },
);

export default AxiosInstance;
