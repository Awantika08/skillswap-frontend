"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./types";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

function formatTime(ts: number) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function ChatPanel({
  messages,
  onSendMessage,
  myPeerId,
}: {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  myPeerId: string;
}) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const isSendDisabled = useMemo(() => text.trim().length === 0, [text]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="font-semibold text-foreground">Chat</div>
        <div className="text-xs text-muted-foreground">{messages.length} messages</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Waiting for messages...
          </div>
        ) : (
          messages.map((m) => {
            const isMine = m.senderPeerId === myPeerId;
            return (
              <div
                key={m.id}
                className={cn("flex flex-col", isMine ? "items-end" : "items-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 border",
                    isMine
                      ? "bg-primary text-primary-foreground border-primary/30"
                      : "bg-secondary text-secondary-foreground border-border",
                  )}
                >
                  <div className="text-[11px] opacity-80 mb-1">
                    {isMine ? "You" : m.senderName}
                  </div>
                  <div className="text-sm whitespace-pre-wrap wrap-break-word">{m.text}</div>
                </div>
                <div className={cn("text-[11px] text-muted-foreground mt-1", isMine ? "text-right" : "")}>
                  {formatTime(m.createdAt)}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="p-3 border-t border-border flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage(text);
          setText("");
        }}
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          aria-label="Chat message"
        />
        <Button
          type="submit"
          disabled={isSendDisabled}
          className="shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </div>
  );
}

