// features/chat/hooks/useGlobalChatListener.ts
import { useEffect } from "react";
import { useSocket } from "@/providers/SocketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

export function useGlobalChatListener() {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!socket || !isConnected || !user) return;

    const handleNewMessage = (message: any) => {
      console.log("[Global] New message received:", message);

      // Always refresh conversations when any new message arrives
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["chat", "unreadCount"] });

      // ALSO update the messages cache for this conversation if it exists
      if (message.ConversationID) {
        queryClient.setQueryData(
          ["messages", message.ConversationID, 50, undefined],
          (oldData: any) => {
            if (!oldData?.data) return oldData;

            // Check if message already exists
            const messageExists = oldData.data.some(
              (m: any) => m.MessageID === message.MessageID,
            );
            if (messageExists) return oldData;

            console.log(
              "[Global] Adding message to cache for conversation:",
              message.ConversationID,
            );
            return {
              ...oldData,
              data: [...oldData.data, message],
            };
          },
        );

        // Also invalidate to ensure consistency
        queryClient.invalidateQueries({
          queryKey: ["messages", message.ConversationID],
        });
      }

      // If the message is not from the current user, show notification
      if (message.SenderID !== user.UserID) {
        console.log(
          `New message from ${message.SenderName || "Someone"}: ${message.Content}`,
        );

        // Optional: Play sound
        // const audio = new Audio("/notification.mp3");
        // audio.play().catch(console.error);

        // Optional: Show browser notification (requires user permission)
        if (Notification.permission === "granted" && document.hidden) {
          new Notification("New Message", {
            body: `${message.SenderName || "Someone"}: ${message.Content}`,
            icon: "/logo.png",
          });
        }
      }
    };

    socket.on("chat:new", handleNewMessage);

    return () => {
      socket.off("chat:new", handleNewMessage);
    };
  }, [socket, isConnected, user, queryClient]);
}
