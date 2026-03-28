import api from "@/lib/api";
import { UpdateMentorSkillPayload, UpdateMentorSkillResponse } from "@/types/skill";

// Update a mentor skill
export const updateMentorSkill = async (
  skillId: string,
  data: UpdateMentorSkillPayload,
): Promise<UpdateMentorSkillResponse> => {
  try {
    const response = await api.put<UpdateMentorSkillResponse>(
      `/mentor/skills/${skillId}`,
      data,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update mentor skill",
    );
  }
};
