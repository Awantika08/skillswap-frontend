import api from "@/lib/api";
import { GetAllUsersResponse, GetAllUsersParams } from "@/types/user";

export const getAllUsers = async (
  params?: GetAllUsersParams,
): Promise<GetAllUsersResponse> => {
  try {
    const response = await api.get<GetAllUsersResponse>("/users", {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};
