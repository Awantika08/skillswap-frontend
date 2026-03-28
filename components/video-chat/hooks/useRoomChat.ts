"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatMessage } from "../types";
import { getRoomChatChannelName } from "../utils";

type IncomingChatMessage =
  | {
      type: "chat-message";
      message: ChatMessage;
    }
  | {
      type: "chat-system";
      message: {
        id: string;
        roomId: string;
        senderPeerId: string;
        senderName: string;
        text: string;
        createdAt: number;
      };
    };

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useRoomChat({
  roomId,
  senderPeerId,
  senderName,
}: {
  roomId: string;
  senderPeerId: string;
  senderName: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messageIdsRef = useRef<Set<string>>(new Set());
  const bcRef = useRef<BroadcastChannel | null>(null);

  const chatChannelName = useMemo(
    () => getRoomChatChannelName(roomId),
    [roomId],
  );

  useEffect(() => {
    const bc = new BroadcastChannel(chatChannelName);
    bcRef.current = bc;

    const handler = (event: MessageEvent<unknown>) => {
      const data = event.data as IncomingChatMessage | undefined;
      if (!data) return;

      if (data.type === "chat-message") {
        const msg = data.message;
        if (msg.roomId !== roomId) return;
        if (messageIdsRef.current.has(msg.id)) return;
        messageIdsRef.current.add(msg.id);
        setMessages((prev) => [...prev, msg].sort((a, b) => a.createdAt - b.createdAt));
      }

      if (data.type === "chat-system") {
        const msg = data.message;
        if (msg.roomId !== roomId) return;
        if (messageIdsRef.current.has(msg.id)) return;
        messageIdsRef.current.add(msg.id);
        setMessages((prev) => [
          ...prev,
          msg as ChatMessage,
        ].sort((a, b) => a.createdAt - b.createdAt));
      }
    };

    bc.addEventListener("message", handler);

    // Lightweight "join" system message (UI only).
    const joinMessage: ChatMessage = {
      id: createId(),
      roomId,
      senderPeerId,
      senderName,
      text: "joined the room",
      createdAt: Date.now(),
    };
    messageIdsRef.current.add(joinMessage.id);
    setMessages((prev) => [...prev, joinMessage]);
    bc.postMessage({ type: "chat-system", message: joinMessage } satisfies IncomingChatMessage);

    return () => {
      bc.removeEventListener("message", handler);
      bc.close();
      bcRef.current = null;
    };
  }, [chatChannelName, roomId, senderName, senderPeerId]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const msg: ChatMessage = {
        id: createId(),
        roomId,
        senderPeerId,
        senderName,
        text: trimmed,
        createdAt: Date.now(),
      };

      messageIdsRef.current.add(msg.id);
      setMessages((prev) => [...prev, msg].sort((a, b) => a.createdAt - b.createdAt));

      bcRef.current?.postMessage({ type: "chat-message", message: msg } satisfies IncomingChatMessage);
    },
    [roomId, senderName, senderPeerId],
  );

  return { messages, sendMessage };
}

