"use client";

import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { RegisterFormValues } from "../zod/auth";
import toast from "react-hot-toast";

export function useRegister() {
  return useMutation<boolean, Error, RegisterFormValues>({
    mutationFn: async (data: RegisterFormValues) => {
      try {
        const res = await api.post("/auth/register", data);
        return res.data.success;
      } catch (err: any) {
        const message =
          err.response?.data?.errors?.[0]?.message || "Registration failed";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      toast.success("Registered successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Registration failed!");
    },
  });
}
