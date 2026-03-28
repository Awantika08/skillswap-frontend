"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMentorSkill } from "../api/updateMentorSkill";
import { UpdateMentorSkillPayload, UpdateMentorSkillResponse } from "@/types/skill";
import toast from "react-hot-toast";

interface UseUpdateMentorSkillOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useUpdateMentorSkill = (options?: UseUpdateMentorSkillOptions) => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateMentorSkillResponse,
    Error,
    { skillId: string; data: UpdateMentorSkillPayload }
  >({
    mutationFn: ({ skillId, data }) => updateMentorSkill(skillId, data),

    onSuccess: (response) => {
      if (response.success) {
        toast.success("Skill updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["mentor-skills"] });
        options?.onSuccess?.();
      }
    },

    onError: (error: any) => {
      const errorMessage = error.message || "Failed to update skill";
      toast.error(errorMessage);
      options?.onError?.(error);
    },
  });
};
