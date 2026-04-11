import api from "@/lib/api";
import { SingleNotificationResponse } from "@/types/notification";

export const markAsRead = async (
  notificationId: string,
): Promise<SingleNotificationResponse> => {
  try {
    const response = await api.patch<SingleNotificationResponse>(
      `/notifications/${notificationId}/read`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to mark notification as read",
    );
  }
};
