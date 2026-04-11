export enum NotificationType {
  SESSION_SCHEDULED = "SESSION_SCHEDULED",
  SESSION_REMINDER = "SESSION_REMINDER",
  NEW_MESSAGE = "NEW_MESSAGE",
  MATCH_FOUND = "MATCH_FOUND",
  SESSION_CANCELLED = "SESSION_CANCELLED",
  SESSION_COMPLETED = "SESSION_COMPLETED",
  REVIEW_RECEIVED = "REVIEW_RECEIVED",
  REPORT_RESOLVED = "REPORT_RESOLVED",
  MENTOR_REQUEST = "MENTOR_REQUEST",
  LEARNER_REQUEST = "LEARNER_REQUEST",
  SYSTEM = "SYSTEM",
}

export interface Notification {
  NotificationID: string;
  UserID: string;
  Type: NotificationType;
  Title: string;
  Content: string;
  Data: any;
  IsRead: boolean;
  ReadAt: string | null;
  CreatedAt: string;
}

export interface BroadcastNotificationPayload {
  title: string;
  content: string;
  type: NotificationType;
  userRole?: "Mentor" | "Learner" | "Admin" | "All";
}

export interface BroadcastNotificationResponse {
  message: string;
  data: {
    recipientsCount: number;
  };
}

export interface PaginatedNotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    unreadCount: number | null;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}

export interface SingleNotificationResponse {
  success: boolean;
  data: Notification;
  message?: string;
}
