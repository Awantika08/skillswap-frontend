import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "./api";
import { SendMessagePayload } from "./types";

export function useConversations(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["conversations", page, limit],
    queryFn: () => chatApi.getConversations(page, limit),
  });
}

export function useGetOrCreateConversation(otherUserId: string | null) {
  return useQuery({
    queryKey: ["conversation", "by-user", otherUserId],
    queryFn: () => chatApi.getOrCreateConversation(otherUserId!),
    enabled: !!otherUserId,
  });
}

export function useMessages(conversationId: string | null, limit = 50, before?: string) {
  return useQuery({
    queryKey: ["messages", conversationId, limit, before],
    queryFn: () => chatApi.getMessages(conversationId!, limit, before),
    enabled: !!conversationId,
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) => chatApi.sendMessage(conversationId, payload),
    onSuccess: () => {
      // Invalidate messages query to load new messages if socket fails
      // Although realtime socket will handle the primary update.
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ["chatUsers", "search", query],
    queryFn: () => chatApi.searchUsers(query),
    enabled: !!query,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["chat", "unreadCount"],
    queryFn: () => chatApi.getUnreadCount(),
    refetchInterval: 60000, // optionally refetch every minute
  });
}
