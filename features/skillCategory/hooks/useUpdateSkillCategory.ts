import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSkillCategory } from "../api/updateSkillCategory";
import {
  UpdateSkillCategoryPayload,
  UpdateSkillCategoryResponse,
} from "@/types/skillCategory";
import toast from "react-hot-toast";

export const useUpdateSkillCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateSkillCategoryResponse,
    Error,
    { id: string; data: UpdateSkillCategoryPayload }
  >({
    mutationFn: ({ id, data }) => updateSkillCategory(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Skill category updated successfully");
        queryClient.invalidateQueries({ queryKey: ["skill-categories"] });
        queryClient.invalidateQueries({
          queryKey: ["skill-category", response.data.SkillCategoryID],
        });
      } else {
        toast.error("Failed to update skill category");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred while updating category");
    },
  });
};
