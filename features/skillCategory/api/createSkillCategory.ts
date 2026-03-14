import api from "@/lib/api";
import {
  CreateSkillCategoryPayload,
  CreateSkillCategoryResponse,
} from "@/types/skillCategory";

// Create new skill category
export const createSkillCategory = async (
  data: CreateSkillCategoryPayload,
): Promise<CreateSkillCategoryResponse> => {
  try {
    const response = await api.post<CreateSkillCategoryResponse>(
      "/skill-categories",
      data,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create skill category",
    );
  }
};
