"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { videoSessionService } from "../api/video-session.service";
import { SessionMeetingInfo } from "@/zod/video-session.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useVideoSession(sessionId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [duration, setDuration] = useState(0);
  const [isMeetingEnded, setIsMeetingEnded] = useState(false);

  // Fetch meeting info
  const { data: sessionInfo, isLoading, error } = useQuery({
    queryKey: ["video-session", sessionId],
    queryFn: () => videoSessionService.getSessionMeetingInfo(sessionId),
    enabled: !!sessionId,
  });

  // Start session mutation
  const startMutation = useMutation({
    mutationFn: () => videoSessionService.startSession(sessionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["video-session", sessionId] });
      toast.success("Session started officially");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to start session");
    },
  });

  // End session mutation
  const endMutation = useMutation({
    mutationFn: () => videoSessionService.endSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-session", sessionId] });
      setIsMeetingEnded(true);
      toast.success("Session ended");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to end session");
    },
  });

  // Timer logic - properly sync with server-side start time
  useEffect(() => {
    // Only tick when in progress
    if (sessionInfo?.data?.Status === "IN_PROGRESS") {
      // Calculate initial duration on join/load
      // We check for any field that might indicate when the session actually started
      const startTimeStr = (sessionInfo.data as any).ActualStartTime || 
                          (sessionInfo.data as any).StartedAt || 
                          sessionInfo.data.ScheduledStart;

      if (startTimeStr) {
        const calculateElapsed = () => {
          const start = new Date(startTimeStr).getTime();
          const now = Date.now();
          return Math.floor((now - start) / 1000);
        };
        
        // Set initial duration
        setDuration(Math.max(0, calculateElapsed()));
      }

      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      setDuration(0);
    }
  }, [sessionInfo?.data?.Status, sessionInfo?.data]); // Re-sync if session data updates

  const formatDuration = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ""}${mins < 10 && hrs > 0 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  }, []);

  return {
    sessionInfo: sessionInfo?.data as SessionMeetingInfo | undefined,
    isLoading,
    error,
    duration: formatDuration(duration),
    isMeetingEnded,
    startSession: startMutation.mutate,
    endSession: endMutation.mutate,
    isStarting: startMutation.isPending,
    isEnding: endMutation.isPending,
  };
}
