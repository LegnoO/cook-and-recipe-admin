// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Config
import { notifyEndpoints } from "@/config/endpoints";

export async function queryNotify(params: string) {
  try {
    const response = await AxiosInstance.get<NotifyResponse>(
      notifyEndpoints.queryNotify(params),
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
