"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVideoSession } from "@/features/videoSession/hooks/useVideoSession";
import { VideoRoom } from "@/features/videoSession/components/VideoRoom";
import { useAuthStore } from "@/store/authStore";
import { Loader2, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MentorVideoCallPage() {
  const { sessionId } = useParams() as { sessionId: string };
  const { user } = useAuthStore();
  const router = useRouter();
  
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
      router.push(`/mentor/sessions?tab=COMPLETED&review=${sessionId}`);
    }
  }, [isMeetingEnded, router, sessionId]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-zinc-400">Loading session room...</p>
      </div>
    );
  }

  if (error || !sessionInfo) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error joining session</h1>
        <p className="text-zinc-400 mb-8 max-w-md">
          {error instanceof Error ? error.message : "Failed to load session details."}
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  // Mentor MUST start the session if it's not yet in progress
  if (sessionInfo.Status === "SCHEDULED") {
    return (
       <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
          <Play className="w-10 h-10 text-primary fill-current" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Ready to Start?</h1>
        <p className="text-zinc-400 mb-8 max-w-md">
          Your session for {sessionInfo.learnerName} is ready. 
          Click the button below to start the meeting and notify the learner.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.back()}>Not Now</Button>
          <Button size="lg" onClick={() => startSession()} disabled={isStarting}>
            {isStarting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            Start Session
          </Button>
        </div>
      </div>
    );
  }

  const currentUser = {
    id: user?.UserID || user?.id || "",
    fullName: user?.FullName || "Mentor"
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