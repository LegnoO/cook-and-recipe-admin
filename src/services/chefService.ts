// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";
import { createSearchParams } from "@/utils/helpers";

// ** Config
import { chefEndpoints } from "@/config/endpoints";

export async function queryChef(filter: FilterChef) {
  try {
    const { ...restFilter } = filter;

    const params = createSearchParams(restFilter);
    const response = await AxiosInstance.get<ListChef>(
      chefEndpoints.queryChef(params.toString()),
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function queryChefPending(filter: FilterChefPending) {
  try {
    const { ...restFilter } = filter;

    const params = createSearchParams(restFilter);
    const response = await AxiosInstance.get<ListChef>(
      chefEndpoints.queryChefPending(params.toString()),
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function toggleChefRequest(chefId: string, status: boolean) {
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
