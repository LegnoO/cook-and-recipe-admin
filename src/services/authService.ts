// ** Library
import cookies from "js-cookie";

// ** Utils
import AxiosInstance from "@/utils/axios";

// ** Types
import { AuthTokens, User, IRoutePermission } from "@/types/Auth";

export const isRememberMeEnabled =
  localStorage.getItem("rememberMe") === "true";

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
  const response = await AxiosInstance.get<IRoutePermission[]>("/permissions");

  return response.data;
}

export async function handleRefreshToken() {
  const refreshToken = cookies.get("refreshToken");

  if (!refreshToken) {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
    throw new Error("Invalid Refresh Token!");
  }

  const response = await AxiosInstance.post<AuthTokens>("/auth/refresh", {
    refreshToken,
  });

  const { accessToken, refreshToken: newRefreshToken } = response.data;
  localStorage.setItem("accessToken", accessToken);
  const cookieOptions = isRememberMeEnabled ? { expires: 30 } : undefined;
  cookies.set("refreshToken", newRefreshToken, cookieOptions);

  return response.data;
}
