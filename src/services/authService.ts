// ** Utils
import AxiosInstance from "@/utils/axios";

// ** Types
import { AuthTokens, User } from "@/types/Auth";

export async function signIn(username: string, password: string) {
  const response = await AxiosInstance.post<AuthTokens>("/auth/manager/login", {
    username,
    password,
  });

  console.log("🚀 ~ signIn ~ response.data:", response.data);
  return response.data;
}

export async function getUserInfo() {
  // const response = await AxiosInstance.post<User>("/auth/login");

  // return response.data;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: "66c616b0dffdbea4fea8ff20",
    fullName: "Admin",
    email: "admin123@gmail.com",
    dateOfBirth: null,
  };
}

export async function refreshToken() {
  const response = await AxiosInstance.post<User>("/auth/login");

  return response.data;
}
