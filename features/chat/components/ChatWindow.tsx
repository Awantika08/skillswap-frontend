import React, { useEffect, useRef, useState, useCallback } from "react";
import { useMessages, useSendMessage } from "../hooks";
import { useChatSocket } from "../useChatSocket";
import { useAuthStore } from "@/store/authStore";
import { Message } from "../types";
import { Button } from "@/components/ui/button";
import { User, Send, Loader2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

interface ChatWindowProps {
  conversationId: string;
  otherUser: {
    UserID: string;
    FullName: string;
    ProfileImageURL: string | null;
    IsOnline: boolean;
  };
}

export function ChatWindow({ conversationId, otherUser }: ChatWindowProps) {
  const { user } = useAuthStore((state) => state);
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [isTypingRemote, setIsTypingRemote] = useState(false);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]); // Fast-track bridge state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading, refetch } = useMessages(conversationId, 50);
  const { mutate: sendMessageREST, isPending: isSendingRest } =
    useSendMessage(conversationId);

  // Normalize current user ID
  const currentUserId = user?.UserID || user?.id;

  const {
    isConnected,
    sendMessage: sendSocketMessage,
    startTyping,
    stopTyping,
    markAsRead,
  } = useChatSocket({
    conversationId,
    onNewMessage: useCallback((msg: Message) => {
      // FAST-TRACK: Add to local bridge state immediately
      setRecentMessages((prev) => {
        if (prev.some((m) => m.MessageID === msg.MessageID)) return prev;
        // Filter out optimistic placeholders that match this content
        const filtered = prev.filter(
          (m) =>
            !m.MessageID.toString().startsWith("optimistic-") ||
            m.Content !== msg.Content,
        );
        return [...filtered, msg];
      });
    }, []),
    onTyping: useCallback(
      (data: { userId: string; fullName: string; isTyping: boolean }) => {
        if (data.userId !== currentUserId) {
          setIsTypingRemote(data.isTyping);
        }
      },
      [currentUserId],
    ),
  });

  // Derived messages state (Merged cache + bridge state)
  const cachedMessages = data?.data || [];
  const messages = [
    ...cachedMessages,
    ...recentMessages.filter(
      (rm) => !cachedMessages.some((cm) => cm.MessageID === rm.MessageID),
    ),
  ];

  // Sync logic: When cache updates, we remove successfully synced messages from the bridge
  useEffect(() => {
    if (cachedMessages.length > 0 && recentMessages.length > 0) {
      setRecentMessages((prev) =>
        prev.filter(
          (rm) => !cachedMessages.some((cm) => cm.MessageID === rm.MessageID),
        ),
      );
    }
  }, [cachedMessages]);

  useEffect(() => {
    if (!conversationId) return;
    const interval = setInterval(() => {
      refetch();
    }, 15000);
    return () => clearInterval(interval);
  }, [conversationId, refetch]);

  // Handle marking messages as read
  useEffect(() => {
    if (!currentUserId || !isConnected || messages.length === 0) return;

    const unreadIds = messages
      .filter((m) => m.SenderID !== currentUserId && !m.IsRead)
      .map((m) => m.MessageID);

    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  }, [messages, currentUserId, isConnected, markAsRead]);

  // Scroll to bottom when messages or typing indicator changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTypingRemote]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = content.trim();
    if (!text) return;

    // Optimistic UI: Add to bridge state instantly for zero lag
    const optimisticMsg: Message = {
      MessageID: `optimistic-${Date.now()}`,
      ConversationID: conversationId,
      SenderID: currentUserId || "",
      ReceiverID: otherUser.UserID,
      Content: text,
      MessageType: "TEXT",
      ReplyToID: null,
      IsRead: false,
      ReadAt: null,
      IsEdited: false,
      EditedAt: null,
      IsDeleted: false,
      DeletedFor: null,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };

    setRecentMessages((prev) => [...prev, optimisticMsg]);

    // Also update global cache as fallback
    queryClient.setQueryData(
      ["messages", conversationId, 50, undefined],
      (oldData: any) => ({
        ...oldData,
        data: [...(oldData?.data || []), optimisticMsg],
      }),
    );

    setContent("");
    stopTyping();
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    if (isConnected) {
      sendSocketMessage(text);
    } else {
      sendMessageREST(
        { content: text },
        {
          onError: () => {
            setRecentMessages((prev) =>
              prev.filter((m) => m.MessageID !== optimisticMsg.MessageID),
            );
            queryClient.setQueryData(
              ["messages", conversationId, 50, undefined],
              (oldData: any) => ({
                ...oldData,
                data:
                  oldData?.data?.filter(
                    (m: any) => m.MessageID !== optimisticMsg.MessageID,
                  ) || [],
              }),
            );
          },
        },
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend(e as any);
      return;
    }
    startTyping();
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => stopTyping(), 2000);
  };

  const handleBlur = () => {
    stopTyping();
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  };

  const getFullImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const imageUrl = getFullImageUrl(otherUser.ProfileImageURL);

  const isConsecutive = (idx: number) => {
    if (idx === 0) return false;
    return messages[idx].SenderID === messages[idx - 1].SenderID;
  };
  const isLastInGroup = (idx: number) => {
    if (idx === messages.length - 1) return true;
    return messages[idx].SenderID !== messages[idx + 1].SenderID;
  };

  return (
    <div className="flex flex-col h-full w-full bg-background relative flex-1">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card/95 backdrop-blur-md px-5 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <div className="relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={otherUser.FullName}
              className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-background"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-2 border-background shadow-sm">
              <User className="w-5 h-5 text-primary" />
            </div>
          )}
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
              otherUser.IsOnline ? "bg-green-500" : "bg-zinc-400"
            }`}
          />
        </div>
        <div>
          <h2 className="font-bold text-base text-foreground leading-tight">
            {otherUser.FullName}
          </h2>
          <p
            className={`text-xs font-medium ${otherUser.IsOnline ? "text-green-500" : "text-muted-foreground"}`}
          >
            {otherUser.IsOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 scroll-smooth">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-7 h-7 animate-spin text-primary/40" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-primary/30" />
            </div>
            <p className="text-base font-semibold text-foreground">
              Start the conversation
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Say hello to {otherUser.FullName} 👋
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {messages.map((msg, idx) => {
              const isMe = msg.SenderID === currentUserId;
              const consecutive = isConsecutive(idx);
              const lastInGroup = isLastInGroup(idx);
              const isOptimistic =
                msg.MessageID.toString().startsWith("optimistic-");
              const showDate =
                idx === 0 ||
                format(new Date(messages[idx - 1].CreatedAt), "yyyy-MM-dd") !==
                  format(new Date(msg.CreatedAt), "yyyy-MM-dd");

              return (
                <React.Fragment key={msg.MessageID}>
                  {showDate && (
                    <div className="flex justify-center my-6">
                      <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                        {format(new Date(msg.CreatedAt), "MMMM d, yyyy")}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"} ${consecutive ? "mt-0.5" : "mt-4"}`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 shrink-0 mb-0.5">
                        {lastInGroup ? (
                          imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={otherUser.FullName}
                              className="w-8 h-8 rounded-full object-cover border-none shadow-sm"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center shadow-sm">
                              <span className="text-zinc-500 text-[10px] font-bold">
                                {otherUser.FullName[0]?.toUpperCase()}
                              </span>
                            </div>
                          )
                        ) : (
                          <div className="w-8 h-8" />
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] md:max-w-[65%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={[
                          "px-4 py-2.5 text-[15px] leading-snug whitespace-pre-wrap break-words transition-all",
                          isOptimistic ? "opacity-70" : "opacity-100",
                          isMe
                            ? `bg-[#0084FF] text-white
                               ${!consecutive ? "rounded-[20px] rounded-br-[4px]" : "rounded-[20px] rounded-br-[4px]"}
                               ${lastInGroup ? "rounded-br-[20px]" : "rounded-br-[4px]"}`
                            : `bg-[#E4E6EB] text-[#050505]
                               ${!consecutive ? "rounded-[20px] rounded-bl-[4px]" : "rounded-[20px] rounded-bl-[4px]"}
                               ${lastInGroup ? "rounded-bl-[20px]" : "rounded-bl-[4px]"}`,
                        ].join(" ")}
                      >
                        {msg.Content}
                      </div>

                      {lastInGroup && (
                        <div className="mt-1 px-1">
                          <span className="text-[10px] text-muted-foreground/50 font-medium">
                            {format(new Date(msg.CreatedAt), "h:mm a")}
                            {isMe && (
                              <span className="ml-1.5 opacity-80">
                                {msg.IsRead ? "Seen" : "Sent"}
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {isTypingRemote && (
              <div className="flex gap-2 mt-4 items-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 shrink-0 mb-0.5">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      className="w-8 h-8 rounded-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center">
                      <span className="text-zinc-500 text-[10px] font-bold">
                        {otherUser.FullName[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="bg-[#E4E6EB] rounded-[20px] px-4 py-3.5 flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} className="h-6" />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-background border-t border-border">
        <form
          onSubmit={handleSend}
          className="flex gap-2 max-w-5xl mx-auto items-center"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder="Aa"
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-full px-5 py-2.5 focus:outline-none focus:ring-0 text-[15px] placeholder:text-muted-foreground/60 transition-colors"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!content.trim() || isSendingRest}
            variant="ghost"
            className="rounded-full w-10 h-10 shrink-0 text-[#0084FF] hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"
          >
            <Send className="w-5 h-5 fill-current" />
          </Button>
        </form>
      </div>
    </div>
  );
}
