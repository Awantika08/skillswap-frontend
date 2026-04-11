import api from "@/lib/api";
import { PaginatedNotificationResponse } from "@/types/notification";

export const getNotifications = async (
  page = 1,
  limit = 10,
  unreadOnly = false,
): Promise<PaginatedNotificationResponse> => {
  try {
    const response = await api.get<PaginatedNotificationResponse>(
      "/notifications",
      {
        params: {
          page,
          limit,
          unreadOnly,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch notifications",
    );
  }
};
