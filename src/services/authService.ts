// ** Config
import {
  authEndpoints,
  employeeEndpoints,
  groupEndpoints,
} from "@/config/endpoints";

// ** Utils
import AxiosInstance from "@/utils/axios";

export const isRememberMeEnabled =
  JSON.parse(localStorage.getItem("rememberMe")!) === "true";

export async function signIn({
  username,
  password,
  rememberMe,
}: LoginCredentials) {
  const response = await AxiosInstance.post<AuthTokens>(authEndpoints.login, {
    username,
    password,
    rememberMe,
  });
  localStorage.setItem("access-token", response.data);
  return response.data;
}

export async function signOut() {
  const response = await AxiosInstance.post<Messages>(authEndpoints.logout);

  return response.data;
}

export async function getUserInfo() {
  const response = await AxiosInstance.get<User>(employeeEndpoints.getInfo);

  return response.data;
}

export async function getUserProfile() {
  const response = await AxiosInstance.get<UserProfile>(
    employeeEndpoints.getProfile,
  );

  return response.data;
}

export async function getUserPermission() {
  const response = await AxiosInstance.get<Permission[]>(
    groupEndpoints.getPermissions,
  );

  return response.data;
}

export async function refreshInfo(rememberMe: string) {
  const response = await AxiosInstance.post<AuthTokens>(
    authEndpoints.refreshInfo,
    {
      rememberMe,
    },
  );

  const newToken = response.data;
  localStorage.setItem("access-token", newToken);

  return response.data;
}
