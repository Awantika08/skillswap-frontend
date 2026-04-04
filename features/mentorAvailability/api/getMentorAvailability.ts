import api from "@/lib/api";
import { MentorAvailabilityResponse } from "@/types/mentorAvailability";

export const getMentorAvailability = async (): Promise<MentorAvailabilityResponse> => {
  const response = await api.get("/mentor/availability");
  return response.data;
};
