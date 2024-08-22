import axios, { AxiosError } from "axios";
import { STATUS_CODES } from "@/constants/statusCodes";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_DATABASE_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
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
        // const newAccessToken = await refreshToken();
        // error.config.headers.Authorization = `Bearer ${newAccessToken}`;

        return axios.request(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default AxiosInstance;
