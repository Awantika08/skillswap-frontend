"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatSidebar } from "@/features/chat/components/ChatSidebar";
import { ChatWindow } from "@/features/chat/components/ChatWindow";
import { MessageSquare } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useGlobalChatListener } from "@/features/chat/useGlobalChatListener";

import { Suspense } from "react";

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationIdParam = searchParams.get("conversationId");
  const { user } = useAuthStore((state) => state);

  // Add global chat listener for notifications
  useGlobalChatListener();

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(conversationIdParam);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Sync state with URL param
  useEffect(() => {
    if (conversationIdParam) {
      setSelectedConversationId(conversationIdParam);
    }
  }, [conversationIdParam]);

  const handleSelectConversation = (id: string, user: any) => {
    setSelectedConversationId(id);
    setSelectedUser(user);
    router.push(`/chat?conversationId=${id}`, { scroll: false });
  };

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!user) {
      const timeout = setTimeout(() => {
        if (!useAuthStore.getState().user) {
          router.push("/login");
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [user, router]);

  return (
    <div className="flex h-[calc(100vh-var(--header-height,5rem))] w-full bg-background overflow-hidden relative">
      <ChatSidebar
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
      />

      <div
        className={`flex-1 flex flex-col h-full bg-muted/10 ${
          selectedConversationId ? "flex" : "hidden sm:flex"
        }`}
      >
        {selectedConversationId && selectedUser ? (
          <ChatWindow
            conversationId={selectedConversationId}
            otherUser={selectedUser}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center h-full">
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-primary/40" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your Messages
            </h2>
            <p className="max-w-md text-sm md:text-base text-muted-foreground">
              Select a conversation from the sidebar to view messages or connect
              with a new mentor to start learning.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Loading chat...</p>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
