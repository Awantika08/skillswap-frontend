import api from "@/lib/api";
import {
  BulkCreateSkillCategoryPayload,
  BulkCreateSkillCategoryResponse,
} from "@/types/skillCategory";

// Bulk create skill categories
export const bulkCreateSkillCategory = async (
  data: BulkCreateSkillCategoryPayload,
): Promise<BulkCreateSkillCategoryResponse> => {
  try {
    const response = await api.post<BulkCreateSkillCategoryResponse>(
      "/skill-categories/bulk",
      data,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to bulk create skill categories",
    );
  }
};
