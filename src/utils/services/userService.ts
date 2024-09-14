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
