import api from "@/lib/api";
import {
  ToggleMentorSkillAvailabilityPayload,
  ToggleMentorSkillAvailabilityResponse,
} from "@/types/skill";

/**
 * Toggle mentor skill availability
 * @param skillId - The ID of the skill to toggle
 * @param payload - The availability payload
 * @returns The updated mentor skill
 */
export const toggleMentorSkillAvailability = async (
  skillId: string,
  payload: ToggleMentorSkillAvailabilityPayload,
): Promise<ToggleMentorSkillAvailabilityResponse> => {
  try {
    const response = await api.patch<ToggleMentorSkillAvailabilityResponse>(
      `/mentor/skills/${skillId}/toggle`,
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to toggle skill availability",
    );
  }
};
