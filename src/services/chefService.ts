// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";
import { createSearchParams } from "@/utils/helpers";

export async function getFilterChef(filter: FilterChef) {
  try {
    const { ...restFilter } = filter;

    const params = createSearchParams(restFilter);
    const response = await AxiosInstance.get<ListChef>(
      `/chefs?${params.toString()}`,
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function getFilterChefPending(filter: FilterChefPending) {
  try {
    const { ...restFilter } = filter;

    const params = createSearchParams(restFilter);
    const response = await AxiosInstance.get<ListChef>(
      `/chefs/pending?${params.toString()}`,
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function toggleChefRequest(chefId: string, status: boolean) {
  try {
    const response = await AxiosInstance.patch(
      `/chefs/pending/${chefId}/approve-or-reject`,
      {
        approveOrReject: status,
      },
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function disableChef(chefId: string) {
  try {
    const response = await AxiosInstance.patch(`/chefs/${chefId}/ban`);

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function activeChef(chefId: string) {
  try {
    const response = await AxiosInstance.patch<ListChef>(
      `/chefs/${chefId}/unban`,
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function getChefDetail(chefId: string) {
  const response = await AxiosInstance.get<ChefDetail>(`/chefs/${chefId}`);

  return response.data;
}
