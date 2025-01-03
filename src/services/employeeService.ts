// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";
import { createSearchParams } from "@/utils/helpers";

// ** Config
import { employeeEndpoints } from "@/config/endpoints";

export async function updateProfileEmployee(formData: FormData) {
  const response = await AxiosInstance.put<any>(
    employeeEndpoints.updateProfileEmployee,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export async function queryEmployees(filter: FilterEmployees) {
  const { total, ...rest } = filter;
  try {
    const params = createSearchParams(rest);
    const response = await AxiosInstance.get<ListEmployees>(
      employeeEndpoints.queryEmployees(params.toString()),
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function updateEmployee(
  employeeData: FormData,
  employeeId: string,
  controller?: AbortController,
) {
  const response = await AxiosInstance.put(
    employeeEndpoints.updateEmployee(employeeId),
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
  const response = await AxiosInstance.get<EmployeeDetail>(
    employeeEndpoints.getDetailEmployee(employeeId),
  );

  return response.data;
}

export async function createEmployee(
  formData: FormData,
  controller?: AbortController,
) {
  const response = await AxiosInstance.post(
    employeeEndpoints.createEmployee,
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

export async function toggleStatusEmployee(employeeId: string) {
  try {
    const response = await AxiosInstance.patch(
      employeeEndpoints.toggleStatusEmployee(employeeId),
      {
        id: employeeId,
      },
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function updateAllGroupEmployees(
  data: {
    currentGroup: string;
    newGroup: string;
  },
  controller?: AbortController,
) {
  const response = await AxiosInstance.put(
    employeeEndpoints.updateAllGroupEmployees,
    data,
    {
      signal: controller?.signal,
    },
  );

  return response.data;
}
