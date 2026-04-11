"use client";

import { formatDistanceToNow } from "date-fns";
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  UserPlus, 
  XCircle, 
  CheckCircle2, 
  Star, 
  AlertCircle,
  Info 
} from "lucide-react";
import { Notification, NotificationType } from "@/types/notification";
import { cn } from "@/lib/utils";
import { useMarkNotificationRead } from "@/hooks/use-notifications";

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.SESSION_SCHEDULED:
    case NotificationType.SESSION_REMINDER:
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case NotificationType.NEW_MESSAGE:
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    case NotificationType.MENTOR_REQUEST:
    case NotificationType.LEARNER_REQUEST:
    case NotificationType.MATCH_FOUND:
      return <UserPlus className="h-4 w-4 text-purple-500" />;
    case NotificationType.SESSION_CANCELLED:
      return <XCircle className="h-4 w-4 text-red-500" />;
    case NotificationType.SESSION_COMPLETED:
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case NotificationType.REVIEW_RECEIVED:
      return <Star className="h-4 w-4 text-yellow-500" />;
    case NotificationType.REPORT_RESOLVED:
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    case NotificationType.SYSTEM:
      return <Info className="h-4 w-4 text-indigo-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const { mutate: markRead } = useMarkNotificationRead();

  const handleClick = () => {
    if (!notification.IsRead) {
      markRead(notification.NotificationID);
    }
    // Optionally handle navigation based on notification data
    if (onClose) onClose();
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-muted/50",
        !notification.IsRead && "bg-muted/30"
      )}
    >
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background border shadow-sm">
        {getNotificationIcon(notification.Type)}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className={cn(
            "text-sm font-medium leading-none",
            !notification.IsRead ? "text-foreground" : "text-muted-foreground"
          )}>
            {notification.Title}
          </p>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(notification.CreatedAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {notification.Content}
        </p>
      </div>
      {!notification.IsRead && (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </div>
  );
}
