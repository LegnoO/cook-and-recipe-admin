// ** Utils
import AxiosInstance from "@/utils/axios";

// ** Config
import { recipeEndpoints } from "@/config/endpoints";

export async function queryRecipe(params: string) {
  const response = await AxiosInstance.get(recipeEndpoints.queryRecipe(params));

  return response.data;
}

export async function queryRecipePending(params: string) {
  const response = await AxiosInstance.get(
    recipeEndpoints.queryRecipePending(params),
  );

  return response.data;
}

export async function getDetailRecipe(recipeId: string) {
  const response = await AxiosInstance.get<any>(
    recipeEndpoints.getDetailRecipe(recipeId),
  );

  return response.data;
}

export async function toggleRecipeRequest(recipeId: string, status: boolean) {
  const response = await AxiosInstance.patch(
    recipeEndpoints.toggleRecipeRequest(recipeId),
    {
      approveOrReject: status,
    },
  );
  return response.data;
}

export async function revokeApprovalRecipe(recipeId: string) {
  const response = await AxiosInstance.patch(
    recipeEndpoints.revokeApprovalRecipe(recipeId),
  );

  return response.data;
}

export async function privateRecipe(recipeId: string) {
  const response = await AxiosInstance.patch(
    recipeEndpoints.privateRecipe(recipeId),
  );

  return response.data;
}
