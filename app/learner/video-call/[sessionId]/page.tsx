"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVideoSession } from "@/features/videoSession/hooks/useVideoSession";
import { VideoRoom } from "@/features/videoSession/components/VideoRoom";
import { useAuthStore } from "@/store/authStore";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LearnerVideoCallPage() {
  const { sessionId } = useParams() as { sessionId: string };
  const { user } = useAuthStore();
  const router = useRouter();
  
  const { 
    sessionInfo, 
    isLoading, 
    error, 
    duration, 
    endSession, 
    isEnding,
    isMeetingEnded 
  } = useVideoSession(sessionId);

  useEffect(() => {
    if (isMeetingEnded) {
      router.push(`/learner/sessions?tab=COMPLETED&review=${sessionId}`);
    }
  }, [isMeetingEnded, router, sessionId]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-zinc-400 animate-pulse">Joining session...</p>
      </div>
    );
  }

  if (error || !sessionInfo) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Failed to join session</h1>
        <p className="text-zinc-400 mb-8 max-w-md">
          {error instanceof Error ? error.message : "The session might have ended or you don't have access."}
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const currentUser = {
    id: user?.UserID || user?.id || "",
    fullName: user?.FullName || "Learner"
  };

  return (
    <VideoRoom
      sessionInfo={sessionInfo}
      currentUser={currentUser}
      duration={duration}
      onEndSession={endSession}
      isEnding={isEnding}
    />
  );
}