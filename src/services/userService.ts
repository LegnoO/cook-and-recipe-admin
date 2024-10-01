// ** Utils
import AxiosInstance from "@/utils/axios";
import { createSearchParams } from "@/utils/helpers";

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
  const { total, ...restFilter } = filter;

  const params = createSearchParams(restFilter);

  const response = await AxiosInstance.get<ListEmployees>(
    `/employees?${params.toString()}`,
  );

  return response.data;
}

export async function updateEmployee(
  employeeData: FormData,
  employeeId: string,
  controller?: AbortController,
) {
  const response = await AxiosInstance.put(
    `/employees/${employeeId}`,
    employeeData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal: controller?.signal,
    },
  );

  return response.data;
}

export async function getEmployeeDetail(employeeId: string) {
  const response = await AxiosInstance.get<Employee>(
    `/employees/${employeeId}`,
  );

  return response.data;
}

export async function addEmployee(
  formData: FormData,
  controller?: AbortController,
) {
  const response = await AxiosInstance.post(`/employees`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal: controller?.signal,
  });

  return response.data;
}

export async function toggleStatusEmployee(employeeId: string) {
  const response = await AxiosInstance.patch(
    `/employees/${employeeId}/toggle-status`,
    {
      id: employeeId,
    },
  );

  return response.data;
}
