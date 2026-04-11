"use client";

import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/changePassword";
import { ChangePasswordValues } from "../schemas/profileSchema";
import toast from "react-hot-toast";

export const useChangePassword = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: ChangePasswordValues) => changePassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password changed successfully!");
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to change password.");
    },
  });
};
