import api from "@/lib/api";
import { UpdateUserResponse } from "@/types/user";

export const updateUser = async (
  id: string,
  data: FormData,
): Promise<UpdateUserResponse> => {
  try {
    const response = await api.put<UpdateUserResponse>(`/users/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};
