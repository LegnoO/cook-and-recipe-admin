// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";
import { createSearchParams } from "@/utils/helpers";

export async function getAllGroups(filter: any) {
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
  const response = await AxiosInstance.get<Role[]>("/groups/active");

  return response.data;
}

export async function toggleStatusGroup(groupId: string) {
  const response = await AxiosInstance.patch(
    `/groups/${groupId}/toggle-status`,
    {
      id: groupId,
    },
  );
  return response.data;
}

export async function createGroups(
  group: GroupSubmit,
  controller?: AbortController,
) {
  const response = await AxiosInstance.post(`/groups`, group, {
    signal: controller?.signal,
  });
  return response.data;
}

export async function updateGroups(
  groupId: string,
  group: GroupSubmit,
  controller?: AbortController,
) {
  const response = await AxiosInstance.put(`/groups/${groupId}`, group, {
    signal: controller?.signal,
  });
  return response.data;
}

export async function getGroupDetail(groupId: string) {
  const response = await AxiosInstance.get<any>(`/groups/${groupId}`);

  return response.data;
}

