"use client";

import { useEffect } from "react";
import { useSocket } from "@/providers/SocketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export function useSessionSocket() {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // 1. New Session Request (for Mentor)
    const handleNewRequest = (data: { sessionId: string; learnerName: string }) => {
      if (user?.role === "Mentor") {
        toast.success(`New session request from ${data.learnerName}!`, {
          duration: 5000,
          icon: '📅'
        });
        queryClient.invalidateQueries({ queryKey: ["mentor", "sessions", "pending"] });
      }
    };

    // 2. Session Scheduled (for Both)
    const handleSessionScheduled = (data: { sessionId: string; title: string }) => {
      toast.success(`Session scheduled: ${data.title}`, {
        duration: 5000,
        icon: '✅'
      });
      // Invalidate both mentor and learner queries to be safe
      queryClient.invalidateQueries({ queryKey: ["mentor", "sessions"] });
      queryClient.invalidateQueries({ queryKey: ["learner", "sessions"] });
    };

    // 3. Session Started (for Learner)
    const handleSessionStarted = (data: { sessionId: string; title: string; roomId: string }) => {
      if (user?.role === "Learner") {
        toast(`Session started: ${data.title}. Join now!`, {
          duration: 10000,
          icon: '🚀',
        });
        queryClient.invalidateQueries({ queryKey: ["learner", "sessions"] });
      }
    };

    // 4. Session Cancelled (for Both)
    const handleSessionCancelled = (data: { sessionId: string }) => {
      toast.error("A session has been cancelled.", {
        icon: '❌'
      });
      queryClient.invalidateQueries({ queryKey: ["mentor", "sessions"] });
      queryClient.invalidateQueries({ queryKey: ["learner", "sessions"] });
    };

    // 5. Session Ended (for Both)
    const handleSessionEnded = (data: { sessionId: string }) => {
      toast.success("The session has ended.", {
        icon: '🏁'
      });
      queryClient.invalidateQueries({ queryKey: ["mentor", "sessions"] });
      queryClient.invalidateQueries({ queryKey: ["learner", "sessions"] });
    };

    // 6. New Time Slots Proposed (for Learner)
    const handleSlotsProposed = (data: { sessionId: string }) => {
      if (user?.role === "Learner") {
        toast.success("Mentor has proposed new time slots for your session!", {
          duration: 5000,
          icon: '📅'
        });
        queryClient.invalidateQueries({ queryKey: ["learner", "sessions"] });
      }
    };

    socket.on("session:new-request", handleNewRequest);
    socket.on("session:scheduled", handleSessionScheduled);
    socket.on("session:started", handleSessionStarted);
    socket.on("session:cancelled", handleSessionCancelled);
    socket.on("session:ended", handleSessionEnded);
    socket.on("session:slots-proposed", handleSlotsProposed);
    
    // Also listen to generic notifications that might contain session info
    socket.on("notification", (notification: any) => {
        if (notification.type === 'SESSION_SCHEDULED' || notification.type === 'SESSION_STARTED') {
             queryClient.invalidateQueries({ queryKey: ["mentor", "sessions"] });
             queryClient.invalidateQueries({ queryKey: ["learner", "sessions"] });
        }
    });

    return () => {
      socket.off("session:new-request", handleNewRequest);
      socket.off("session:scheduled", handleSessionScheduled);
      socket.off("session:started", handleSessionStarted);
      socket.off("session:cancelled", handleSessionCancelled);
      socket.off("session:ended", handleSessionEnded);
      socket.off("session:slots-proposed", handleSlotsProposed);
      socket.off("notification");
    };
  }, [socket, isConnected, queryClient, user?.role]);
}