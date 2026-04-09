"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Check, X, Loader2, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { ProposeSlotsModal } from "@/features/videoSession/components/ProposeSlotsModal";

export default function PendingSessionRequests() {
  const [selectedSession, setSelectedSession] = useState<{ id: string, learnerName: string } | null>(null);

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["mentor", "sessions", "pending"],
    queryFn: async () => {
      const res = await api.get("/mentor/sessions?status=PENDING_MATCH");
      return res.data;
    },
  });

  const sessions = response?.data?.sessions || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed bg-muted/20">
        <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm text-muted-foreground font-medium">No pending requests at the moment.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Pending Session Requests
        </h2>
        <span className="bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
          {sessions.length} New
        </span>
      </div>

      <Card className="p-0 border-0 shadow-none bg-transparent space-y-4">
        {sessions.map((session: any) => (
          <Card
            key={session.SessionID}
            className="p-5 border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900"
          >
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12 border border-gray-100 dark:border-gray-800">
                <AvatarImage
                  src={session.LearnerImage}
                  alt={session.LearnerName}
                />
                <AvatarFallback>{session.LearnerName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {session.LearnerName}
                </h3>
                <p className="text-sm text-primary font-medium mb-1">
                  {session.SkillName || "Requested Skill"}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Requested: {format(new Date(session.CreatedAt), "MMM dd")}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800 mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{session.Title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                {session.Description || "No additional details provided."}
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => setSelectedSession({ id: session.SessionID, learnerName: session.LearnerName })}
                className="flex-1 bg-primary hover:bg-primary/90 text-white border-0"
              >
                <Check className="h-4 w-4 mr-2" />
                Review & Propose Slots
              </Button>
               <Button variant="outline" className="px-3" title="Decline">
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </Card>

      {selectedSession && (
        <ProposeSlotsModal
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
          sessionId={selectedSession.id}
          learnerName={selectedSession.learnerName}
          onSuccess={() => {
            setSelectedSession(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}