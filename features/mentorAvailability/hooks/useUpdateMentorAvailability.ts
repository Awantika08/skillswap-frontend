import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMentorAvailability } from "../api/updateMentorAvailability";
import { UpdateMentorAvailabilityRequest } from "@/types/mentorAvailability";
import toast from "react-hot-toast";

export const useUpdateMentorAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMentorAvailabilityRequest) => updateMentorAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorAvailability"] });
      toast.success("Availability updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update availability");
    },
  });
};
