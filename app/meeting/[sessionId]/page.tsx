"use client";

export const runtime = 'edge';

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVideoSession } from "@/features/videoSession/hooks/useVideoSession";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/authStore";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSessionSocket } from "@/features/videoSession/hooks/useSessionSocket";

const VideoRoom = dynamic(
  () => import("@/features/videoSession/components/VideoRoom").then((m) => m.VideoRoom),
  { ssr: false, loading: () => (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-zinc-950 text-white gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-zinc-400 font-medium">Loading meeting room...</p>
    </div>
  )}
);


export default function MeetingPage() {
  const { sessionId } = useParams() as { sessionId: string };
  const { user } = useAuthStore();
  const router = useRouter();

  // Initialize session sockets for real-time updates
  useSessionSocket();

  const {
    sessionInfo,
    isLoading,
    error,
    duration,
    startSession,
    isStarting,
    endSession,
    isEnding,
    isMeetingEnded
  } = useVideoSession(sessionId);

  useEffect(() => {
    if (isMeetingEnded) {
      const isMentor = sessionInfo?.mentorId === (user?.UserID || user?.id);
      const role = isMentor ? "mentor" : "learner";
      router.push(`/${role}/sessions?tab=COMPLETED&review=${sessionId}`);
    }
  }, [isMeetingEnded, router, sessionId, sessionInfo?.mentorId, user?.UserID, user?.id]);

  if (isLoading) {
    return (
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-zinc-950 text-white gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-zinc-400 font-medium">Joining meeting...</p>
      </div>
    );
  }

  if (error || !sessionInfo) {
    return (
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Connection Error</h1>
        <p className="text-zinc-400 mb-8 max-w-md">
          {error instanceof Error ? error.message : "We couldn't reach the meeting server. Please check your connection."}
        </p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  const isMentor = sessionInfo.mentorId === (user?.UserID || user?.id);

  const currentUser = {
    id: user?.UserID || user?.id || "",
    fullName: user?.FullName || (isMentor ? "Mentor" : "Learner")
  };

  return (
    <VideoRoom
      sessionInfo={sessionInfo}
      currentUser={currentUser}
      duration={duration}
      onEndSession={endSession}
      isEnding={isEnding}
      onStartSession={startSession}
      isStarting={isStarting}
    />
  );
}
