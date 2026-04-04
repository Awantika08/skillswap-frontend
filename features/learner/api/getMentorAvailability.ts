import api from "@/lib/api";
import { GetMentorAvailabilityResponse } from "@/types/learner";

export const getMentorAvailability = async (
  id: string,
): Promise<GetMentorAvailabilityResponse> => {
  try {
    const response = await api.get<GetMentorAvailabilityResponse>(
      `/mentor/availability/${id}`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch mentor availability",
    );
  }
};
