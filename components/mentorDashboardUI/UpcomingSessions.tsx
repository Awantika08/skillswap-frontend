"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function UpcomingSessions() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["mentor", "sessions", "upcoming"],
    queryFn: async () => {
      const response = await api.get("/mentor/sessions?status=SCHEDULED");
      return response.data?.data?.sessions || [];
    },
  });

  if (isLoading) {
    return (
      <Card className="p-8 flex items-center justify-center border-dashed">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed bg-gray-50/50 dark:bg-gray-900/20">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">No upcoming sessions</h3>
        <p className="text-xs text-gray-500 mt-1">When students book time with you, they'll appear here.</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/mentor/availability">Set Availability</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Upcoming Sessions
        </h2>
        <Button variant="ghost" size="sm" className="text-xs" asChild>
          <Link href="/mentor/sessions">
            View all <ChevronRight className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session: any) => (
          <Card key={session.SessionID} className="p-5 overflow-hidden group hover:border-primary/50 transition-colors bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-gray-50 dark:ring-gray-800">
                  <AvatarImage src={session.LearnerImage} />
                  <AvatarFallback>{session.LearnerName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                    {session.LearnerName}
                  </h4>
                  <p className="text-xs text-primary font-medium">{session.SkillName}</p>
                </div>
              </div>
              <div className={cn(
                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                session.Status === 'IN_PROGRESS' ? "bg-red-100 text-red-600 animate-pulse" : "bg-blue-100 text-blue-600"
              )}>
                {session.Status === 'IN_PROGRESS' ? 'Live Now' : 'Scheduled'}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {session.ScheduledStart ? format(new Date(session.ScheduledStart), "PPP") : "TBD"}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {session.ScheduledStart ? format(new Date(session.ScheduledStart), "p") : "TBD"}
              </div>
            </div>

            <Button className="w-full shadow-sm" asChild>
              <Link href={`/mentor/video-call/${session.SessionID}`}>
                <Video className="w-4 h-4 mr-2" />
                Join Session
              </Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}