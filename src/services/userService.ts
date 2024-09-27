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

export async function getFilterEmployee(paginate: Paginate) {
  const { index, size } = paginate;
  const response = await AxiosInstance.get<ListEmployees>(
    `/employees?index=${index}&size=${size}`,
  );

  return response.data;
}

export async function updateEmployee(employeeData: any) {
  console.log("🚀 ~ updateEmployee ~ employeeData:", employeeData);
  const { id, avatar, createdDate, username, ...rest } = employeeData;

  const response = await AxiosInstance.put<any>(
    `/employees/${employeeData.id}`,
    {
      ...rest,
    },
  );

  return response.data;
}

export async function addEmployee(formData: any) {
  const response = await AxiosInstance.post<any>(`/employees`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
