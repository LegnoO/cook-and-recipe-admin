// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Config
import { categoryEndpoints } from "@/config/endpoints";

export async function queryCategory(params: string) {
  try {
    const response = await AxiosInstance.get(
      categoryEndpoints.queryCategory(params),
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

export async function getCategoryDetail(id: string) {
  const response = await AxiosInstance.get<any>(
    categoryEndpoints.getCategoryDetail(id),
  );

  return response.data;
}
