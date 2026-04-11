import api from "@/lib/api";
import { LearnerStatsResponse } from "@/types/learnerDashboard";

export const getLearnerStats = async (): Promise<LearnerStatsResponse> => {
  try {
    const response = await api.get<LearnerStatsResponse>("/learner/stats");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch learner stats");
  }
};
