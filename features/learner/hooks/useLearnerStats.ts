"use client";

import { useQuery } from "@tanstack/react-query";
import { getLearnerStats } from "../api/getLearnerStats";

export const useLearnerStats = () => {
  return useQuery({
    queryKey: ["learner", "stats"],
    queryFn: getLearnerStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
