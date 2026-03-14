"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllSkillCategories } from "../api/getAllSkillCategory";
import { GetAllSkillCategoriesParams } from "@/types/skillCategory";

export const useGetAllSkillCategories = (
  initialParams?: GetAllSkillCategoriesParams,
) => {
  const [params, setParams] = useState<GetAllSkillCategoriesParams>({
    page: 1,
    limit: 20,
    search: "",
    sortBy: "name",
    sortOrder: "asc",
    ...initialParams,
  });

  const query = useQuery({
    queryKey: ["skill-categories", params],
    queryFn: () => getAllSkillCategories(params),
  });

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearch = (search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleSort = (sortBy: string, sortOrder: "asc" | "desc") => {
    setParams((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  const handleLimitChange = (limit: number) => {
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  };

  return {
    ...query,
    params,
    setParams,
    handlePageChange,
    handleSearch,
    handleSort,
    handleLimitChange,
  };
};
