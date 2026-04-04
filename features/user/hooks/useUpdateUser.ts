"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../api/updateUser";
import { toast } from "react-hot-toast";

export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => updateUser(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["user", id] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success("User updated successfully");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });
};
