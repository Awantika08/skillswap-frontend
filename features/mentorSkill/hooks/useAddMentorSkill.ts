"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMentorSkill } from "../api/addMentorSkill";
import { AddMentorSkillPayload, AddMentorSkillResponse } from "@/types/skill";
import toast from "react-hot-toast";

interface UseAddMentorSkillOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useAddMentorSkill = (options?: UseAddMentorSkillOptions) => {
  const queryClient = useQueryClient();

  return useMutation<AddMentorSkillResponse, Error, AddMentorSkillPayload>({
    mutationFn: (data: AddMentorSkillPayload) => addMentorSkill(data),

    onSuccess: (response) => {
      if (response.success) {
        toast.success("Skill added successfully!");
        queryClient.invalidateQueries({ queryKey: ["mentor-skills"] });
        options?.onSuccess?.();
      }
    },

    onError: (error: any) => {
      const errorMessage = error.message || "Failed to add skill";
      toast.error(errorMessage);
      options?.onError?.(error);
    },
  });
};
