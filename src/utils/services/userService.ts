// ** Utils
import AxiosInstance from "@/utils/axios";

// ** Types
import { ListEmployees } from "@/types/user";

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

export async function getFilterEmployee() {
  const response = await AxiosInstance.get<ListEmployees[]>("/employees");

  return response.data;
}

export async function updateEmployeeData(employeeData: any) {
  console.log("🚀 ~ updateEmployeeData ~ employeeData:", employeeData);
  const { id, avatar, createdDate, username, ...rest } = employeeData;

  const response = await AxiosInstance.put<any>(
    `/employees/${employeeData.id}`,
    {
      ...rest,
    },
  );

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
