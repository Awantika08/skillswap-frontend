import api from "@/lib/api";
import { GetUserResponse } from "@/types/user";

export const getUserById = async (id: string): Promise<GetUserResponse> => {
  try {
    const response = await api.get<GetUserResponse>(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
};
