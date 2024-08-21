// ** Utils
import AxiosInstance from "@/utils/axios";

// ** Types
import { User } from "@/types/User";

export async function signIn(
  username: string,
  password: string,
): Promise<User> {
  const response = await AxiosInstance.post<User>("/auth/login", {
    username,
    password,
  });

  return response.data;
}

export async function getUserInfo(): Promise<User> {
  const response = await AxiosInstance.post<User>("/auth/login");

  return response.data;
}

export async function refreshToken(): Promise<User> {
  const response = await AxiosInstance.post<User>("/auth/login");

  return response.data;
}