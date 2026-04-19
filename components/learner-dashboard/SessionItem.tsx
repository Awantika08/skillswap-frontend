"use client";

import React from "react";
import { Clock, Video, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import Link from "next/link";

interface SessionItemProps {
  session: any;
  proposedSlots: any[];
  icon: React.ReactNode;
  iconBg: string;
}

export const SessionItem = ({
  session,
  proposedSlots,
  icon,
  iconBg,
}: SessionItemProps) => {
  const [isSelecting, setIsSelecting] = React.useState<string | null>(null);
  const router = React.useMemo(() => ({}), []); // Placeholder if needed, but we'll use window/hooks

  const handleSelectSlot = async (slotId: string) => {
    try {
      setIsSelecting(slotId);
      const res = await api.post(`/sessions/${session.SessionID}/time-slots/${slotId}/select`);
      if (res.data.success) {
        toast.success("Session scheduled successfully!");
        // We rely on socket to invalidate the dashboard query
      }
    } catch (error: any) {
      console.error("Select slot error", error);
      toast.error(error.response?.data?.errors?.[0]?.message || "Failed to select slot.");
    } finally {
      setIsSelecting(null);
    }
  };

  const isJoinable = session.Status === 'IN_PROGRESS' || session.Status === 'SCHEDULED';
  const showSlots = (session.Status === 'PENDING_MATCH' || session.Status === 'SCHEDULED') && proposedSlots.length > 0;
  const timeStr = session.ScheduledStart 
    ? format(new Date(session.ScheduledStart), "h:mm a, MMM dd")
    : "TBD";

  return (
    <div className="flex flex-col gap-3 p-4 rounded-3xl border border-border/40 hover:border-border transition-all bg-card/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${iconBg} bg-opacity-20 flex items-center justify-center`}>
            {icon}
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-foreground tracking-tight">
              {session.Title}
            </h4>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              with <span className="font-semibold text-foreground/80">{session.MentorName}</span>
            </p>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeStr}
              </span>
              <span className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                {session.MeetingProvider || "Video"}
              </span>
            </div>
          </div>
        </div>
        <div>
          {session.Status === 'IN_PROGRESS' ? (
            <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-5 h-8 text-[11px] font-bold shadow-lg shadow-rose-500/20" asChild>
                <Link href={`/learner/video-call?sessionId=${session.SessionID}`}>Join Now</Link>
            </Button>
          ) : session.Status === 'SCHEDULED' ? (
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] border-primary/20 text-primary px-3 py-1 rounded-full font-bold">Scheduled</Badge>
                <Button size="sm" variant="ghost" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-full px-4 h-8 text-[11px] font-bold" asChild>
                    <Link href={`/learner/video-call?sessionId=${session.SessionID}`}>Enter Room</Link>
                </Button>
            </div>
          ) : session.Status === 'PENDING_MATCH' ? (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-3 py-1 text-[10px] font-bold">
                    {proposedSlots.length > 0 ? "Action Required" : "Requested"}
                </Badge>
          ) : (
            <Button variant="outline" size="sm" className="rounded-full px-5 h-8 text-[11px] font-bold border-primary/20 hover:bg-primary/5 transition-all text-primary hover:border-primary/50">
              Details
            </Button>
          )}
        </div>
      </div>

      {showSlots && (
        <div className="pt-2 border-t border-dashed border-border/50">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
                {session.Status === 'SCHEDULED' ? "Change Time (Mentor's Other Slots):" : "Mentor Proposed Times:"}
            </p>
            <div className="flex flex-wrap gap-2">
                {proposedSlots.map((slot: any) => {
                    const isSelected = slot.IsSelected || (session.ScheduledStart && new Date(session.ScheduledStart).getTime() === new Date(slot.StartTime).getTime());
                    
                    return (
                        <Button 
                            key={slot.TimeSlotID}
                            variant={isSelected ? "outline" : "ghost"} 
                            size="sm"
                            className={`h-auto py-1.5 px-3 rounded-xl transition-all text-[10px] font-bold flex flex-col items-start gap-0 ${
                                isSelected 
                                ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 scale-105" 
                                : "bg-primary/5 hover:bg-primary/10 border border-primary/10 text-primary"
                            }`}
                            onClick={() => handleSelectSlot(slot.TimeSlotID)}
                            disabled={!!isSelecting || (isSelected && session.Status === 'SCHEDULED')}
                        >
                            <span className={`${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"} text-[8px] uppercase`}>
                                {format(new Date(slot.StartTime), "eee, MMM d")}
                            </span>
                            <span>{format(new Date(slot.StartTime), "h:mm a")}</span>
                            {isSelected && session.Status === 'SCHEDULED' && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                </span>
                            )}
                        </Button>
                    );
                })}
            </div>
        </div>
      )}
    </div>
  );
};
