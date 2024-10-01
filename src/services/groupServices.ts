// ** Utils
import AxiosInstance from "@/utils/axios";

export async function getAllGroups() {
  const response = await AxiosInstance.get<Role[]>("/groups"); // dev test - use groups active api 

  return response.data;
}

// export async function getAllGroups() {
//   const response = await AxiosInstance.get<Role[]>("/groups"); // dev test - use groups active api 

//   return response.data;
// }
