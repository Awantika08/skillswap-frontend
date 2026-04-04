import api from "@/lib/api";
import { GetSkillCategoryResponse } from "@/types/skillCategory";

// Get single skill category by ID
export const getSkillCategory = async (
  id: string,
): Promise<GetSkillCategoryResponse> => {
  try {
    const response = await api.get<GetSkillCategoryResponse>(
      `/skill-categories/${id}`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch skill category",
    );
  }
};
