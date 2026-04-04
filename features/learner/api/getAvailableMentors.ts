import api from "@/lib/api";
import { GetAvailableMentorsResponse } from "@/types/learner";

export interface GetAvailableMentorsParams {
  page?: number;
  limit?: number;
  search?: string;
  skillCategoryId?: string;
}

export const getAvailableMentors = async (
  params?: GetAvailableMentorsParams,
): Promise<GetAvailableMentorsResponse> => {
  try {
    const response = await api.get<GetAvailableMentorsResponse>(
      "/learner/mentors",
      { params },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch available mentors",
    );
  }
};
