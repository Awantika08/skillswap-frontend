import api from "@/lib/api";
import {
  UpdateSkillCategoryPayload,
  UpdateSkillCategoryResponse,
} from "@/types/skillCategory";

// Update skill category by ID
export const updateSkillCategory = async (
  id: string,
  data: UpdateSkillCategoryPayload,
): Promise<UpdateSkillCategoryResponse> => {
  try {
    const response = await api.put<UpdateSkillCategoryResponse>(
      `/skill-categories/${id}`,
      data,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update skill category",
    );
  }
};
