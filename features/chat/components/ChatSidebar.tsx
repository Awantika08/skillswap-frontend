// features/chat/components/ChatSidebar.tsx
import React, { useEffect } from "react";
import { useConversations } from "../hooks";
import { useChatSocket } from "../useChatSocket";
import { formatDistanceToNow } from "date-fns";
import { User, MessageSquare } from "lucide-react";

interface ChatSidebarProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string, user: any) => void;
}

export function ChatSidebar({
  selectedConversationId,
  onSelectConversation,
}: ChatSidebarProps) {
  const { data, isLoading, refetch } = useConversations(1, 100);

  // Register global socket listeners to update sidebar/unread counts
  useChatSocket();

  // Debug: Log when conversations data changes
  useEffect(() => {
    console.log(
      "[ChatSidebar] Conversations updated:",
      data?.data?.conversations?.length,
    );
  }, [data]);

  // Manual refetch on visibility change as fallback
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log(
          "[ChatSidebar] Page became visible, refetching conversations",
        );
        refetch();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refetch]);

  const getFullImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted-foreground flex-1 flex items-center justify-center">
        Loading conversations...
      </div>
    );
  }

  const conversations = data?.data?.conversations || [];

  return (
    <div className="flex flex-col h-full w-full sm:w-80 border-r border-border bg-card overflow-hidden flex-shrink-0">
      <div className="p-4 border-b border-border shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Messages
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No active conversations yet. Find a mentor and start learning!
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {conversations.map((conv) => {
              const isActive = conv.ConversationID === selectedConversationId;
              const imageUrl = getFullImageUrl(conv.otherUserImage);
              const unreadCount = Number(conv.unreadCount || 0);

              return (
                <li key={conv.ConversationID}>
                  <button
                    onClick={() =>
                      onSelectConversation(conv.ConversationID, {
                        UserID: conv.otherUserId,
                        FullName: conv.otherUserName,
                        ProfileImageURL: conv.otherUserImage,
                        IsOnline: conv.otherUserOnline,
                      })
                    }
                    className={`w-full text-left p-4 flex gap-3 items-center transition-colors hover:bg-muted/50 ${isActive
                      ? "bg-primary/5 border-l-4 border-primary"
                      : "border-l-4 border-transparent"
                      }`}
                  >
                    <div className="relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={conv.otherUserName}
                          className="w-12 h-12 rounded-full object-cover border shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border shadow-sm">
                          <User className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      {conv.otherUserOnline && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="font-semibold text-sm truncate pr-2 text-foreground">
                          {conv.otherUserName}
                        </h3>
                        {conv.LastMessageAt && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(conv.LastMessageAt), {
                              addSuffix: true,
                            }).replace("about ", "")}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <p
                          className={`text-sm truncate ${unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}
                        >
                          {conv.LastMessage || "Started a conversation"}
                        </p>
                        {unreadCount > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
