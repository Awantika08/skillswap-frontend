import api from "@/lib/api";
import { ChangePasswordValues } from "../schemas/profileSchema";

export const changePassword = async (data: ChangePasswordValues): Promise<{ message: string }> => {
  try {
    const { currentPassword, newPassword } = data;
    const response = await api.patch("/users/me/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to change password"
    );
  }
};
