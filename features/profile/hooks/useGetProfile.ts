"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/getProfile";
import { useProfileStore } from "@/store/profileStore";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export const useGetProfile = () => {
  const { setProfile, setLoading, setError } = useProfileStore();
  const user = useAuthStore((state) => state.user);

  const query = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!user?.id,
  });

  useEffect(() => {
    setLoading(query.isLoading);
    if (query.error) {
      setError(query.error.message);
    }
    if (query.data?.data) {
      setProfile(query.data.data);
    }
  }, [
    query.data,
    query.isLoading,
    query.error,
    setProfile,
    setLoading,
    setError,
  ]);

  return query;
};