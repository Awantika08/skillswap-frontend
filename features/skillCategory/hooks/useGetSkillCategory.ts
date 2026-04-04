import { useQuery } from "@tanstack/react-query";
import { getSkillCategory } from "../api/getSkillCategory";
import { GetSkillCategoryResponse } from "@/types/skillCategory";

export const useGetSkillCategory = (id: string, enabled: boolean = true) => {
  return useQuery<GetSkillCategoryResponse, Error>({
    queryKey: ["skill-category", id],
    queryFn: () => getSkillCategory(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
