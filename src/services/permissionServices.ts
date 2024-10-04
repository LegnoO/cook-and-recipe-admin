// ** Utils
import AxiosInstance from "@/utils/axios";


export async function getPermissions() {
  const response = await AxiosInstance.get<RoutePermission[]>("/permissions");

  return response.data;
}
