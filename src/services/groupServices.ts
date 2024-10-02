// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";
import { createSearchParams } from "@/utils/helpers";

export async function getAllGroups(filter: Filter) {
  const { total, ...restFilter } = filter;

  const params = createSearchParams(restFilter);
  try {
    const response = await AxiosInstance.get(`/groups?${params.toString()}`);

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function getGroupActive() {
  const response = await AxiosInstance.get<Role[]>("groups/active");

  return response.data;
}

// export async function getAllGroups() {
//   const response = await AxiosInstance.get<Role[]>("/groups"); // dev test - use groups active api

//   return response.data;
// }
