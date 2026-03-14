import api from "@/lib/api";
import {
  GetAllSkillCategoriesResponse,
  GetAllSkillCategoriesParams,
} from "@/types/skillCategory";

// Get all skill categories with pagination
export const getAllSkillCategories = async (
  params?: GetAllSkillCategoriesParams,
): Promise<GetAllSkillCategoriesResponse> => {
  try {
    const response = await api.get<GetAllSkillCategoriesResponse>(
      "/skill-categories",
      {
        params,
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch skill categories",
    );
  }
};
