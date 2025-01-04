// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Config
import { groupEndpoints } from "@/config/endpoints";

export async function queryGroups(params: string) {
  try {
    const response = await AxiosInstance.get(
      groupEndpoints.queryGroups(params),
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function getActiveGroup() {
  const response = await AxiosInstance.get<Role[]>(
    groupEndpoints.getActiveGroup,
  );

  return response.data;
}

export async function toggleGroupStatus(groupId: string) {
  const response = await AxiosInstance.patch(
    groupEndpoints.toggleGroupStatus(groupId),
    {
      id: groupId,
    },
  );
  return response.data;
}

export async function createGroup(
  group: GroupSubmit,
  controller?: AbortController,
) {
  const response = await AxiosInstance.post(groupEndpoints.createGroup, group, {
    signal: controller?.signal,
  });
  return response.data;
}

export async function editGroup(
  groupId: string,
  group: GroupSubmit,
  controller?: AbortController,
) {
  const response = await AxiosInstance.put(
    groupEndpoints.editGroup(groupId),
    group,
    {
      signal: controller?.signal,
    },
  );
  return response.data;
}

export async function getDetailGroup(groupId: string) {
  const response = await AxiosInstance.get(
    groupEndpoints.getDetailGroup(groupId),
  );

  return response.data;
}

export async function deleteGroup(groupId: string) {
  const response = await AxiosInstance.get(groupEndpoints.deleteGroup(groupId));

  return response.data;
}
