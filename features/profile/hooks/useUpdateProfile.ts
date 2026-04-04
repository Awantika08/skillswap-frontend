"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/updateProfile";
import toast from "react-hot-toast";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => updateProfile(data),
    onSuccess: (response) => {
      toast.success("Profile updated successfully!");
      // Invalidate both generic profile and user-specific profile query
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      // Depending on how auth store updates its self context, you might need to handle it.
      // Usually, invalidating "profile" is enough to re-trigger useGetProfile which updates the store.
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile.");
    },
  });
};
