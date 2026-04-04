import api from "@/lib/api";
import { ProfileResponse } from "@/types/profile";

export const updateProfile = async (data: FormData): Promise<ProfileResponse> => {
  try {
    const response = await api.put<ProfileResponse>("/users/me", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update profile");
  }
};
