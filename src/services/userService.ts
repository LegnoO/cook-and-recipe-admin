// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Config
import { userEndpoints } from "@/config/endpoints";

export async function queryUsers(params: string) {
  try {
    const response = await AxiosInstance.get<ClientResponse>(
      userEndpoints.queryUsers(params),
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function toggleStatusUser(userId: string) {
  try {
    const response = await AxiosInstance.patch(
      userEndpoints.toggleStatusUser(userId),
      {
        id: userId,
      },
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
