"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { VideoChatRoom } from "@/components/video-chat/VideoChatRoom";

export default function VideoChatRoomPage() {
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

