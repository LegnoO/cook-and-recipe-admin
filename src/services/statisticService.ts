// ** Utils
import AxiosInstance from "@/utils/axios";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Config
import { statisticsEndpoints } from "@/config/endpoints";

export async function fetchUserTotalStatistics() {
  try {
    const response = await AxiosInstance.get(
      statisticsEndpoints.userTotalStatistics,
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function fetchRecipeTotalStatistics() {
  try {
    const response = await AxiosInstance.get(
      statisticsEndpoints.recipeTotalStatistics,
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function fetchCategoryTotalStatistics() {
  try {
    const response = await AxiosInstance.get(
      statisticsEndpoints.categoriesTotalStatistics,
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function fetchChefTotalStatistics() {
  try {
    const response = await AxiosInstance.get(
      statisticsEndpoints.chefTotalStatistics,
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function fetchCategoryStatistics() {
  try {
    const response = await AxiosInstance.get<CategoryChartData[]>(
      statisticsEndpoints.categoryChartStatistics,
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function fetchUserStatistics(searchParams: URLSearchParams) {
  const months = searchParams.get("user_months") || "3";

  try {
    const response = await AxiosInstance.get<UserChartData[]>(
      statisticsEndpoints.userChartStatistics(months),
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function fetchChefStatistics(searchParams: URLSearchParams) {
  const months = searchParams.get("chef_months") || "3";
  try {
    const response = await AxiosInstance.get<ChefChartData[]>(
      statisticsEndpoints.chefChartStatistics(months),
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function fetchRecipeStatistics(searchParams: URLSearchParams) {
  const months = searchParams.get("recipe_months") || "3";
  try {
    const response = await AxiosInstance.get<RecipeChartData[]>(
      statisticsEndpoints.recipeChartStatistics(months),
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
