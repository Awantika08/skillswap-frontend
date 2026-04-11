"use client";

import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { ResetPasswordPayload, ResetPasswordResponse } from "../types/auth";
import toast from "react-hot-toast";

type ResetPasswordVariables = {
  token: string;
  data: ResetPasswordPayload;
};

export function useResetPassword() {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordVariables>({
    mutationFn: async ({ token, data }: ResetPasswordVariables): Promise<ResetPasswordResponse> => {
      try {
        const res = await api.post<ResetPasswordResponse>(`/auth/reset-password/${token}`, data);
        return res.data;
      } catch (err: any) {
        const message =
          err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          "Failed to reset password. The token might be invalid or expired.";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully. You can now log in.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to reset password.");
    },
  });
}
