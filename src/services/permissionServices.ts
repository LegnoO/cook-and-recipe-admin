// ** Utils
import AxiosInstance from "@/utils/axios";


export async function getPermissions() {
  const response = await AxiosInstance.get<PermissionsFetch[]>("/permissions");

  return response.data;
}

