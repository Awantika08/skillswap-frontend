import api from "@/lib/api";
import { MentorAvailabilityResponse, UpdateMentorAvailabilityRequest } from "@/types/mentorAvailability";

export const updateMentorAvailability = async (
  data: UpdateMentorAvailabilityRequest
): Promise<MentorAvailabilityResponse> => {
  const response = await api.post("/mentor/availability/weekly", data);
  return response.data;
};
