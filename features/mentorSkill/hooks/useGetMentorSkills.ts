"use client";

import { useQuery } from "@tanstack/react-query";
import { getMentorSkills } from "../api/getMentorSkills";

export const useGetMentorSkills = () => {
  return useQuery({
    queryKey: ["mentor-skills"],
    queryFn: getMentorSkills,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
