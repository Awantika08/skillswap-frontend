"use client";

export const runtime = 'edge';

import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { VideoChatRoom } from "@/components/video-chat/VideoChatRoom";

import { Suspense } from "react";

function VideoChatRoomContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);

  const roomId = useMemo(() => {
    const raw = params.roomId;
    if (typeof raw !== "string") return "";
    return decodeURIComponent(raw);
  }, [params.roomId]);

  const displayName = useMemo(() => {
    const queryName = searchParams.get("name");
    if (queryName && queryName.trim().length > 0) return queryName.trim();
    return user?.name ?? "Guest";
  }, [searchParams, user?.name]);

  if (!roomId) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        Invalid room id.
      </div>
    );
  }

  return <VideoChatRoom roomId={roomId} displayName={displayName} />;
}

export default function VideoChatRoomPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Joining video room...</p>
        </div>
      </div>
    }>
      <VideoChatRoomContent />
    </Suspense>
  );
}

