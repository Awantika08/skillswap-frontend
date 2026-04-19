"use client";

import React from "react";
import { SessionItem } from "./SessionItem";
import { Button } from "@/components/ui/button";
import { Code, Languages, Video, Calendar, Loader2, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useSessionSocket } from "@/features/videoSession/hooks/useSessionSocket";

export const SessionsSection = () => {
  useSessionSocket();

  const { data: response, isLoading } = useQuery({
    queryKey: ["learner", "sessions", "dashboard"],
    queryFn: async () => {
      // Fetching both Scheduled and Pending to show action requirements
      const [scheduledRes, pendingRes] = await Promise.all([
        api.get("/learner/sessions?status=SCHEDULED"),
        api.get("/learner/sessions?status=PENDING_MATCH")
      ]);
      
      const scheduled = scheduledRes.data?.data?.sessions || [];
      const pending = pendingRes.data?.data?.sessions || [];
      
      return [...scheduled, ...pending].slice(0, 5); // Show top 5
    },
  });

  const sessions = response || [];

  const { data: timeSlotsData } = useQuery({
    queryKey: ["learner", "dashboard-slots", sessions.filter(s => ['PENDING_MATCH', 'SCHEDULED'].includes(s.Status)).map(s => s.SessionID)],
    queryFn: async () => {
        const results: Record<string, any[]> = {};
        for (const session of sessions) {
            if (['PENDING_MATCH', 'SCHEDULED'].includes(session.Status)) {
                const tsRes = await api.get(`/sessions/${session.SessionID}/time-slots`);
                results[session.SessionID] = tsRes.data?.data || [];
            }
        }
        return results;
    },
    enabled: sessions.length > 0
  });

  const getIcon = (skillName: string) => {
    const name = skillName.toLowerCase();
    if (name.includes('code') || name.includes('react') || name.includes('javascript')) 
      return <Code className="w-5 h-5 text-rose-500" />;
    if (name.includes('spanish') || name.includes('english') || name.includes('language'))
      return <Languages className="w-5 h-5 text-emerald-500" />;
    return <Video className="w-5 h-5 text-indigo-500" />;
  };

  const getIconBg = (skillName: string) => {
    const name = skillName.toLowerCase();
    if (name.includes('code')) return "bg-rose-500";
    if (name.includes('spanish')) return "bg-emerald-500";
    return "bg-indigo-500";
  };

  return (
    <div className="bg-card border-none shadow-sm rounded-3xl p-8 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Today's Sessions</h2>
        <Button variant="link" className="text-rose-500 hover:text-rose-600 text-sm font-semibold p-0 h-auto">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
                <p className="text-xs text-muted-foreground animate-pulse">Syncing your sessions...</p>
            </div>
        ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 bg-muted/10 rounded-2xl border border-dashed">
                <Calendar className="w-8 h-8 text-muted-foreground opacity-20" />
                <p className="text-sm text-muted-foreground font-medium italic">No sessions scheduled for today.</p>
            </div>
        ) : (
            sessions.map((session, index) => (
                <SessionItem 
                    key={session.SessionID} 
                    session={session}
                    proposedSlots={timeSlotsData?.[session.SessionID] || []}
                    icon={getIcon(session.SkillName || "")}
                    iconBg={getIconBg(session.SkillName || "")}
                />
            ))
        )}
      </div>
    </div>
  );
};
