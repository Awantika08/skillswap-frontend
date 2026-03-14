"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSkillCategory } from "../api/createSkillCategory";
import {
  CreateSkillCategoryPayload,
  CreateSkillCategoryResponse,
} from "@/types/skillCategory";
import toast from "react-hot-toast";

interface UseCreateSkillCategoryOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCreateSkillCategory = (
  options?: UseCreateSkillCategoryOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateSkillCategoryResponse,
    Error,
    CreateSkillCategoryPayload
  >({
    mutationFn: (data: CreateSkillCategoryPayload) => createSkillCategory(data),

    onSuccess: (response) => {
      if (response.success) {
        toast.success("Skill category created successfully!");
        // Invalidate and refetch the skill categories list
        queryClient.invalidateQueries({ queryKey: ["skill-categories"] });

        // Call custom onSuccess callback if provided
        options?.onSuccess?.();
      }
    },

    onError: (error: any) => {
      const errorMessage = error.message || "Failed to create skill category";
      toast.error(errorMessage);
      options?.onError?.(error);
    },
  });
};
