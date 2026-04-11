import api from "@/lib/api";
import { MentorStatsResponse } from "@/types/mentorDashboard";

export const getMentorStats = async (): Promise<MentorStatsResponse> => {
  try {
    const response = await api.get<MentorStatsResponse>("/mentor/stats");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch mentor stats");
  }
};
