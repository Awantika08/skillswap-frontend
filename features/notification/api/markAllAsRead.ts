import api from "@/lib/api";

export const markAllAsRead = async (): Promise<{
  success: boolean;
  message: string;
  data: { updatedCount: number };
}> => {
  try {
    const response = await api.patch("/notifications/read-all");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to mark all notifications as read",
    );
  }
};
