// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";
import { createSearchParams } from "@/utils/helpers";

// ** Config
import { categoryEndpoints } from "@/config/endpoints";

export async function queryCategory(filter: any) {
  const { total, ...restFilter } = filter;

  const params = createSearchParams(restFilter);
  try {
    const response = await AxiosInstance.get(
      categoryEndpoints.queryCategory(params.toString()),
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function toggleStatusCategory(groupId: string) {
  const response = await AxiosInstance.patch(
    categoryEndpoints.toggleStatusCategory(groupId),
    {
      id: groupId,
    },
  );
  return response.data;
}

export async function updateCategory(
  groupId: string,
  category: {
    name: string;
    description: string;
  },
  controller?: AbortController,
) {
  const response = await AxiosInstance.put(
    categoryEndpoints.updateCategory(groupId),
    category,
    {
      signal: controller?.signal,
    },
  );
  return response.data;
}

export async function getDetailCategory(groupId: string) {
  const response = await AxiosInstance.get<any>(
    categoryEndpoints.getDetailCategory(groupId),
  );

  return response.data;
}
