export interface ChatUser {
  UserID: string;
  FullName: string;
  ProfileImageURL: string | null;
  Role: string;
  IsOnline: boolean;
}

export interface Conversation {
  ConversationID: string;
  Participant1ID: string;
  Participant2ID: string;
  LastMessage: string | null;
  LastMessageAt: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  otherUserId: string;
  otherUserName: string;
  otherUserImage: string | null;
  otherUserOnline: boolean;
  unreadCount?: string | number; // Backend returns count(CASE...)
}

export interface Message {
  MessageID: string;
  ConversationID: string;
  SenderID: string;
  ReceiverID: string;
  Content: string;
  MessageType: 'TEXT' | 'IMAGE' | 'FILE';
  ReplyToID: string | null;
  IsRead: boolean;
  ReadAt: string | null;
  IsEdited: boolean;
  EditedAt: string | null;
  IsDeleted: boolean;
  DeletedFor: string[] | null;
  CreatedAt: string;
  UpdatedAt: string;
  SenderName?: string;
  SenderImage?: string | null;
  SenderRole?: string;
}

export interface SendMessagePayload {
  content: string;
  messageType?: 'TEXT' | 'IMAGE' | 'FILE';
  replyToId?: string;
}

export interface ConversationsResponse {
  success: boolean;
  data: {
    conversations: Conversation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface MessagesResponse {
  success: boolean;
  data: Message[];
}

export interface ChatResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
