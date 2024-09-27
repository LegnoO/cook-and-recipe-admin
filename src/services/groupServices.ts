// ** Utils
import AxiosInstance from "@/utils/axios";

export async function getAllGroups() {
  const response = await AxiosInstance.get<Role[]>("/groups");

  return response.data;
}
