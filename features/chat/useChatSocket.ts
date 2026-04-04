// features/chat/useChatSocket.ts
import { useEffect, useCallback } from "react";
import { useSocket } from "@/providers/SocketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

interface UseChatSocketProps {
  conversationId?: string;
  onNewMessage?: (message: any) => void;
  onTyping?: (data: {
    userId: string;
    fullName: string;
    isTyping: boolean;
  }) => void;
  onReadReceipt?: (data: {
    messageIds: string[];
    readBy: string;
    readAt: string;
  }) => void;
}

export function useChatSocket({
  conversationId,
  onNewMessage,
  onTyping,
  onReadReceipt,
}: UseChatSocketProps = {}) {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const { user } = useAuthStore((state) => state);
  const currentUserId = user?.UserID || user?.id;

  /**
   * Helper to update the sidebar conversation list preview.
   */
  const updateConversationPreview = useCallback(
    (message: any) => {
      const queryKeys = [
        ["conversations", 1, 100],
        ["conversations", 1, 20],
      ];

      queryKeys.forEach((queryKey) => {
        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData?.data?.conversations) return oldData;

          const conversations = [...oldData.data.conversations];
          const index = conversations.findIndex(
            (c: any) =>
              String(c.ConversationID) === String(message.ConversationID),
          );

          if (index !== -1) {
            const conv = { ...conversations[index] };
            conv.LastMessage = message.Content;
            conv.LastMessageAt = message.CreatedAt;

            if (
              String(message.SenderID) !== String(currentUserId) &&
              String(message.ConversationID) !== String(conversationId)
            ) {
              conv.unreadCount = Number(conv.unreadCount || 0) + 1;
            }

            conversations.splice(index, 1);
            conversations.unshift(conv);

            return { ...oldData, data: { ...oldData.data, conversations } };
          }
          return oldData;
        });
      });
    },
    [queryClient, currentUserId, conversationId],
  );

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message: any) => {
      const msgConvId = String(message.ConversationID || "").toLowerCase();
      const activeConvId = String(conversationId || "").toLowerCase();

      // 1. FAST-TRACK FOR ACTIVE CHAT WINDOW
      if (activeConvId && msgConvId === activeConvId) {
        // Trigger UI callback immediately (hits the bridge state)
        if (onNewMessage) onNewMessage(message);

        // Update messages cache
        queryClient.setQueryData(
          ["messages", conversationId, 50, undefined],
          (oldData: any) => {
            if (!oldData?.data) return oldData;
            const exists = oldData.data.some(
              (m: any) => String(m.MessageID) === String(message.MessageID),
            );
            if (exists) return oldData;
            return { ...oldData, data: [...oldData.data, message] };
          },
        );

        // INDEPENDENT FAST FETCH: Force refetch for perfect consistency
        queryClient.refetchQueries({ queryKey: ["messages", conversationId] });
      }

      // 2. SIDEBAR UPDATE
      updateConversationPreview(message);

      // Force fresh sidebar fetch
      queryClient.refetchQueries({ queryKey: ["conversations"] });
      queryClient.refetchQueries({ queryKey: ["chat", "unreadCount"] });
    };

    const handleMessageSent = (message: any) => {
      if (
        conversationId &&
        String(message.ConversationID) === String(conversationId)
      ) {
        if (onNewMessage) onNewMessage(message);
        queryClient.refetchQueries({ queryKey: ["messages", conversationId] });
      }
      updateConversationPreview(message);
      queryClient.refetchQueries({ queryKey: ["conversations"] });
    };

    const handleTyping = (data: any) => {
      if (
        conversationId &&
        String(data.conversationId) === String(conversationId) &&
        onTyping
      ) {
        onTyping(data);
      }
    };

    const handleReadReceipt = (data: any) => {
      if (onReadReceipt) onReadReceipt(data);
      if (conversationId) {
        queryClient.refetchQueries({ queryKey: ["messages", conversationId] });
      }
    };

    socket.on("chat:new", handleNewMessage);
    socket.on("chat:sent", handleMessageSent);
    socket.on("chat:typing", handleTyping);
    socket.on("chat:read-receipt", handleReadReceipt);

    return () => {
      socket.off("chat:new", handleNewMessage);
      socket.off("chat:sent", handleMessageSent);
      socket.off("chat:typing", handleTyping);
      socket.off("chat:read-receipt", handleReadReceipt);
    };
  }, [
    socket,
    isConnected,
    conversationId,
    onNewMessage,
    onTyping,
    onReadReceipt,
    queryClient,
    updateConversationPreview,
  ]);

  // Command handlers
  const sendMessage = useCallback(
    (content: string, replyToId?: string, messageType = "TEXT") => {
      if (!socket || !isConnected || !conversationId) return false;
      socket.emit("chat:send", {
        conversationId,
        content,
        messageType,
        replyToId,
      });
      return true;
    },
    [socket, isConnected, conversationId],
  );

  const startTyping = useCallback(() => {
    if (!socket || !isConnected || !conversationId) return;
    socket.emit("chat:typing:start", { conversationId });
  }, [socket, isConnected, conversationId]);

  const stopTyping = useCallback(() => {
    if (!socket || !isConnected || !conversationId) return;
    socket.emit("chat:typing:stop", { conversationId });
  }, [socket, isConnected, conversationId]);

  const markAsRead = useCallback(
    (messageIds: string[]) => {
      if (!socket || !isConnected || !conversationId || messageIds.length === 0)
        return;
      socket.emit("chat:read", { conversationId, messageIds });
    },
    [socket, isConnected, conversationId],
  );

  return { isConnected, sendMessage, startTyping, stopTyping, markAsRead };
}
