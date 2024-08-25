// ** Library
import axios, { AxiosError } from "axios";

// ** Constants
import { STATUS_CODES } from "@/constants/statusCodes";

// ** Services
import { refreshToken } from "@/services/authService";

const BASE_URL: string =
  import.meta.env.VITE_DATABASE_URL || import.meta.env.VITE_VERCEL_DATABASE_URL;

if (!BASE_URL) console.log("Wrong Backend URL!");

const AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken: string = localStorage.getItem("accessToken")!;

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
      !error.response?.config?.url?.includes("/login")
    ) {
      try {
        const newToken = await refreshToken();
        error.config.headers.Authorization = `Bearer ${newToken.accessToken}`;

        return axios.request(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default AxiosInstance;
