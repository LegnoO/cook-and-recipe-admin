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

export async function createCategory(
  formData: FormData,
  controller?: AbortController,
) {
  const response = await AxiosInstance.post(
    categoryEndpoints.createCategory,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal: controller?.signal,
    },
  );
  return response.data;
}

export async function updateCategory(
  id: string,
  category: CategoryUpdate,
  controller?: AbortController,
) {
  const response = await AxiosInstance.put(
    categoryEndpoints.updateCategory(id),
    category,
    {
      signal: controller?.signal,
    },
  );
  return response.data;
}

export async function getDetailCategory(id: string) {
  const response = await AxiosInstance.get<any>(
    categoryEndpoints.getDetailCategory(id),
  );

  return response.data;
}
