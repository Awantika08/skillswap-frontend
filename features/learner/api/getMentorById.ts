import api from "@/lib/api";
import { GetMentorByIdResponse } from "@/types/learner";

export const getMentorById = async (
  id: string,
): Promise<GetMentorByIdResponse> => {
  try {
    const response = await api.get<GetMentorByIdResponse>(
      `/learner/mentors/${id}`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch mentor details",
    );
  }
};
