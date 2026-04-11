"use client";

import { useQuery } from "@tanstack/react-query";
import { getMentorStats } from "../api/getMentorStats";

export const useMentorStats = () => {
  return useQuery({
    queryKey: ["mentor", "stats"],
    queryFn: getMentorStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
