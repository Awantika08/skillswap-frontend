"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/getUserById";

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};
