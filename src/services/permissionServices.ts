// ** Utils
import AxiosInstance from "@/utils/axios";

// ** Config
import { permissionEndpoints } from "@/config/endpoints";

export async function getPermissions() {
  const response = await AxiosInstance.get<PermissionsFetch[]>(
    permissionEndpoints.getPermissions,
  );

  return response.data;
}
