"use client";

import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { ForgotPasswordPayload, ForgotPasswordResponse } from "../types/auth";
import toast from "react-hot-toast";

export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: async (data: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
      try {
        const res = await api.post<ForgotPasswordResponse>("/auth/forgot-password", data);
        return res.data;
      } catch (err: any) {
        const message =
          err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          "Failed to send reset email. Please try again.";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password reset link sent to your email.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send reset email.");
    },
  });
}
