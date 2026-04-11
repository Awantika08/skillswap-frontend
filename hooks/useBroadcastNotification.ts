import { useMutation } from "@tanstack/react-query";
import { broadcastNotification } from "@/features/notification/api/broadcastNotification";
import toast from "react-hot-toast";

export function useBroadcastNotification(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: broadcastNotification,
    onSuccess: () => {
      toast.success("Notification broadcasted successfully!");
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to broadcast notification.");
    },
  });
};
