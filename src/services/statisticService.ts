// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Config
import { statisticsEndpoints } from "@/config/endpoints";

export async function fetchUserTotalStatistics() {
  try {
    const response = await AxiosInstance.get(
      statisticsEndpoints.userTotalStatistics,
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
