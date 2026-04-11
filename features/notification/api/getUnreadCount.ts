import api from "@/lib/api";
import { UnreadCountResponse } from "@/types/notification";

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  try {
    const response = await api.get<UnreadCountResponse>(
      "/notifications/unread-count",
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch unread count",
    );
  }
};
