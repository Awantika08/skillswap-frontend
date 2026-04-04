import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkCreateSkillCategory } from "../api/bulkCreateSkillCategory";
import {
  BulkCreateSkillCategoryPayload,
  BulkCreateSkillCategoryResponse,
} from "@/types/skillCategory";
import toast from "react-hot-toast";

export const useBulkCreateSkillCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BulkCreateSkillCategoryResponse,
    Error,
    BulkCreateSkillCategoryPayload
  >({
    mutationFn: bulkCreateSkillCategory,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Skill categories created successfully");
        queryClient.invalidateQueries({ queryKey: ["skill-categories"] });
      } else {
        toast.error(response.message || "Failed to create skill categories");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred during bulk creation");
    },
  });
};
