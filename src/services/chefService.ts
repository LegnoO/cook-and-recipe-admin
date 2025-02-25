// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Config
import { chefEndpoints } from "@/config/endpoints";

export async function queryChef(params: string) {
  try {
    const response = await AxiosInstance.get<ListChef>(
      chefEndpoints.queryChef(params),
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function queryChefPending(params: string) {
  try {
    const response = await AxiosInstance.get<ListChef>(
      chefEndpoints.queryChefPending(params),
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function toggleChefRequest(chefId: string, status: boolean) {
  console.log("🚀 ~ toggleChefRequest ~ ", { chefId, status });
  const response = await AxiosInstance.patch(
    chefEndpoints.toggleChefRequest(chefId),
    {
      approveOrReject: status,
    },
  );

  return response.data;
}

export async function disableChef(chefId: string) {
  const response = await AxiosInstance.patch(chefEndpoints.disableChef(chefId));

  return response.data;
}

export async function activeChef(chefId: string) {
  const response = await AxiosInstance.patch<ListChef>(
    chefEndpoints.activeChef(chefId),
  );

  return response.data;
}

export async function getChefDetail(chefId: string) {
  const response = await AxiosInstance.get<ChefDetail>(
    chefEndpoints.getChefDetail(chefId),
  );

  return response.data;
}
