import api from "@/lib/api";
import { ProfileResponse } from "@/types/profile";

export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await api.get<ProfileResponse>("/auth/profile");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
};
