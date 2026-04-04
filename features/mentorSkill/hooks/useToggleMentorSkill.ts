import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleMentorSkillAvailability } from "../api/toggleMentorSkillAvailability";
import { toast } from "sonner";
import { ToggleMentorSkillAvailabilityPayload } from "@/types/skill";

/**
 * Hook for toggling mentor skill availability
 */
export const useToggleMentorSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ToggleMentorSkillAvailabilityPayload) =>
      toggleMentorSkillAvailability(payload.skillId, payload),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Skill availability updated successfully");
        // Invalidate mentor skills query to refresh the list
        queryClient.invalidateQueries({ queryKey: ["mentor-skills"] });
      } else {
        toast.error("Failed to update skill availability");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });
};
