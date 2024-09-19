// ** Utils
import AxiosInstance from "@/utils/axios";

// ** Types
import { IUserProfile } from "@/types/user";
import {
  AuthTokens,
  IRoutePermission,
  IUserInfo,
  LoginCredentials,
  Messages,
} from "@/types/auth";

export const isRememberMeEnabled =
  JSON.parse(localStorage.getItem("rememberMe")!) === "true";

export async function signIn({
  username,
  password,
  rememberMe,
}: LoginCredentials) {
  const response = await AxiosInstance.post<AuthTokens>("/auth/manager/login", {
    username,
    password,
    rememberMe,
  });

  return response.data;
}

export async function signOut() {
  const response = await AxiosInstance.post<Messages>("/auth/logout");

  return response.data;
}

export async function getUserInfo() {
  const response = await AxiosInstance.get<IUserInfo>("/employees/info");

  return response.data;
}

export async function getUserProfile() {
  const response = await AxiosInstance.get<IUserProfile>("/employees/profile");

  return response.data;
}

export async function getUserPermission() {
  const response = await AxiosInstance.get<IRoutePermission[]>("/permissions");

  return response.data;
}

export async function handleRefresh(rememberMe: string) {
  const response = await AxiosInstance.post<AuthTokens>("/auth/refresh", {
    rememberMe,
  });

  const newToken = response.data;
  localStorage.setItem("access-token", newToken);

  return response.data;
}
