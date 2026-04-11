import api from "@/lib/api";
import {
  BroadcastNotificationPayload,
  BroadcastNotificationResponse,
} from "@/types/notification";

export const broadcastNotification = async (
  data: BroadcastNotificationPayload,
): Promise<BroadcastNotificationResponse> => {
  try {
    const payload = {
      ...data,
      userRole: data.userRole === "All" ? undefined : data.userRole,
    };
    const response = await api.post<BroadcastNotificationResponse>(
      "/notifications/broadcast",
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to broadcast notification",
    );
  }
};
