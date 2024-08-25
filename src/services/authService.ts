// ** Utils
import AxiosInstance from "@/utils/axios";

// ** Types
import { AuthTokens, User, IRoutePermission } from "@/types/Auth";

export async function signIn(username: string, password: string) {
  const response = await AxiosInstance.post<AuthTokens>("/auth/manager/login", {
    username,
    password,
  });

  return response.data;
}

export async function getUserInfo() {
  const response = await AxiosInstance.get<User>("/users/info");

  return response.data;
}

export async function getUserPermission() {
  const response = await AxiosInstance.get<IRoutePermission[]>("/permission");

  return response.data;
}

export async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Invalid Refresh Token!");
  }

  const response = await AxiosInstance.post<AuthTokens>("/auth/refresh", {
    refreshToken,
  });
  const { accessToken, refreshToken: newRefreshToken } = response.data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", newRefreshToken);

  return response.data;
}
