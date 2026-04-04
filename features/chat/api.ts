import api from "@/lib/api";
import {
  ConversationsResponse,
  MessagesResponse,
  SendMessagePayload,
  ChatResponse,
  Message,
  Conversation,
} from "./types";

export const chatApi = {
  getConversations: async (page = 1, limit = 20) => {
    const response = await api.get<ConversationsResponse>(
      `/chat/conversations?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getOrCreateConversation: async (otherUserId: string) => {
    const response = await api.get<ChatResponse<{ conversation: Conversation; otherUser: any }>>(
      `/chat/conversations/${otherUserId}`
    );
    return response.data;
  },

  getMessages: async (conversationId: string, limit = 50, before?: string) => {
    const query = new URLSearchParams({ limit: limit.toString() });
    if (before) query.append("before", before);

    const response = await api.get<MessagesResponse>(
      `/chat/conversations/${conversationId}/messages?${query.toString()}`
    );
    return response.data;
  },

  sendMessage: async (conversationId: string, payload: SendMessagePayload) => {
    const response = await api.post<ChatResponse<Message>>(
      `/chat/conversations/${conversationId}/messages`,
      payload
    );
    return response.data;
  },

  searchUsers: async (query: string, limit = 20) => {
    const response = await api.get<ChatResponse<any[]>>(
      `/chat/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get<ChatResponse<{ unreadCount: number }>>('/chat/unread');
    return response.data;
  }
};
