"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../api/getAllUsers";
import { GetAllUsersParams } from "@/types/user";

export const useGetAllUsers = (params?: GetAllUsersParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getAllUsers(params),
  });
};
