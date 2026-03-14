"use client";

import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { LoginPayload, LoginResponse } from "../types/auth";
import toast from "react-hot-toast";

// Define the actual API response structure
interface ApiLoginResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    user: {
      UserID: string;
      FullName: string;
      Email: string;
      Role: string;
      Bio: string | null;
      ProfileImageURL: string | null;
      CreatedAt: string;
      PasswordResetToken: string | null;
      PasswordResetExpires: string | null;
      Status: string;
    };
  };
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (data: LoginPayload): Promise<LoginResponse> => {
      try {
        const res = await api.post<ApiLoginResponse>("/auth/login", data);

        // Transform the API response to match your expected LoginResponse format
        const apiData = res.data.data;

        return {
          success: res.data.success,
          token: apiData.token,
          refreshToken: apiData.refreshToken,
          user: {
            id: apiData.user.UserID,
            name: apiData.user.FullName,
            email: apiData.user.Email,
            role: apiData.user.Role,
          },
        };
      } catch (err: any) {
        const message =
          err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          "Login failed";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      setAuth(data.token, data.refreshToken, data.user);
      toast.success("Logged in successfully!");
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.errors?.[0]?.message ||
        err?.message ||
        "Login failed";
      toast.error(message);
    },
  });
}
