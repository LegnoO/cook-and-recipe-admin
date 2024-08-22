// ** Utils
import AxiosInstance from "@/utils/axios";

// ** Types
import { User } from "@/types/User";

export async function signIn(
  username: string,
  password: string,
): Promise<User> {
  const response = await AxiosInstance.post<User>("/auth/manager/login", {
    username,
    password,
  });
  console.log("🚀 ~ response.data:", response.data)

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