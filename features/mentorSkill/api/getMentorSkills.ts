import api from "@/lib/api";
import { MentorSkillsResponse } from "@/types/skill";

// Get all mentor skills
export const getMentorSkills = async (): Promise<MentorSkillsResponse> => {
  try {
    const response = await api.get<MentorSkillsResponse>("/mentor/skills");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch mentor skills",
    );
  }
};
