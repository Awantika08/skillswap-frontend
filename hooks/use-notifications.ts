import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications } from "@/features/notification/api/getNotifications";
import { getUnreadCount } from "@/features/notification/api/getUnreadCount";
import { markAsRead } from "@/features/notification/api/markAsRead";
import { markAllAsRead } from "@/features/notification/api/markAllAsRead";
import { toast } from "sonner";

export const useNotifications = (page = 1, limit = 10, unreadOnly = false) => {
  return useQuery({
    queryKey: ["notifications", { page, limit, unreadOnly }],
    queryFn: () => getNotifications(page, limit, unreadOnly),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark notification as read");
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
      if (data.data.updatedCount > 0) {
        toast.success(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark all notifications as read");
    },
  });
};
