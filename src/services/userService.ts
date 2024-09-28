// ** Utils
import AxiosInstance from "@/utils/axios";

export async function updateEmployeeProfile(formData: FormData) {
  const response = await AxiosInstance.put<any>(
    "/employees/profile/edit",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export async function getFilterEmployee(filter: Filter) {
  const params = new URLSearchParams();

  Object.entries(filter).forEach(([key, value]) => {
    if (value) params.append(key, String(value));
  });

  const response = await AxiosInstance.get<ListEmployees>(
    `/employees?${params.toString()}`,
  );

  return response.data;
}

export async function updateEmployee(employeeData: any) {
  const { id, avatar, createdDate, username, ...rest } = employeeData;

  const response = await AxiosInstance.put<any>(
    `/employees/${employeeData.id}`,
    {
      ...rest,
    },
  );

  return response.data;
}

export async function addEmployee(formData: any, controller?: AbortController) {
  const response = await AxiosInstance.post<any>(`/employees`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal: controller?.signal,
  });

  return response.data;
}

export async function toggleStatusEmployee(employeeId: any) {
  const response = await AxiosInstance.patch<any>(
    `/employees/${employeeId}/toggle-status`,
    {
      id: employeeId,
    },
  );

  return response.data;
}
