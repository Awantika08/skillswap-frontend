import api from "@/lib/api";
import { AddMentorSkillPayload, AddMentorSkillResponse } from "@/types/skill";

// Add a new mentor skill
export const addMentorSkill = async (
  data: AddMentorSkillPayload,
): Promise<AddMentorSkillResponse> => {
  try {
    const response = await api.post<AddMentorSkillResponse>(
      "/mentor/skills",
      data,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to add mentor skill",
    );
  }
};
