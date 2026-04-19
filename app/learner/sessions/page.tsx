"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Video,
  Loader2,
  CheckCircle2,
  Clock3,
  XCircle,
  Play,
  User,
  Check,
  MessageSquare,
  Star
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { chatApi } from "@/features/chat/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionSocket } from "@/features/videoSession/hooks/useSessionSocket";
import { ReviewModal } from "@/features/reviews/components/ReviewModal";

const statusConfig = {
  PENDING_MATCH: { label: "Requested", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock3 },
  SCHEDULED: { label: "Scheduled", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Calendar },
  IN_PROGRESS: { label: "Live", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse", icon: Play },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", icon: XCircle },
};

import { Suspense } from "react";

function LearnerSessionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "SCHEDULED");
  const [isSelecting, setIsSelecting] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState<string | null>(null);
  const [reviewingSession, setReviewingSession] = useState<{ id: string, name: string } | null>(null);

  // Hook into real-time session updates
  useSessionSocket();

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["learner", "sessions", activeTab],
    queryFn: async () => {
      const res = await api.get(`/learner/sessions?status=${activeTab}`);
      return res.data;
    },
  });

  const sessions = response?.data?.sessions || [];

  // Auto-open review modal if query param is present
  useEffect(() => {
    const reviewId = searchParams.get("review");
    if (reviewId && sessions.length > 0) {
      const session = sessions.find((s: any) => s.SessionID === reviewId);
      if (session && session.Status === 'COMPLETED') {
        setReviewingSession({ id: session.SessionID, name: session.MentorName });
        // Clear the query params without refreshing
        const newUrl = window.location.pathname;
        window.history.replaceState({ ...window.history.state }, "", newUrl);
      }
    }
  }, [searchParams, sessions]);

  const { data: timeSlotsData } = useQuery({
    queryKey: ["learner", "time-slots", sessions.filter((s: any) => s.Status === 'PENDING_MATCH').map((s: any) => s.SessionID)],
    queryFn: async () => {
      const results: Record<string, any[]> = {};
      for (const session of sessions) {
        if (session.Status === 'PENDING_MATCH') {
          const tsRes = await api.get(`/sessions/${session.SessionID}/time-slots`);
          results[session.SessionID] = tsRes.data?.data || [];
        }
      }
      return results;
    },
    enabled: sessions.length > 0 && activeTab === 'PENDING_MATCH'
  });

  const handleSelectSlot = async (sessionId: string, slotId: string) => {
    try {
      setIsSelecting(slotId);
      const res = await api.post(`/sessions/${sessionId}/time-slots/${slotId}/select`);
      if (res.data.success) {
        toast.success("Session scheduled successfully!");
        refetch();
      }
    } catch (error: any) {
      console.error("Select slot error", error);
      toast.error(error.response?.data?.errors?.[0]?.message || "Failed to select slot.");
    } finally {
      setIsSelecting(null);
    }
  };

  const handleChat = async (mentorId: string) => {
    try {
      setIsChatLoading(mentorId);
      const res = await chatApi.getOrCreateConversation(mentorId);
      if (res.success && res.data?.conversation) {
        router.push(`/chat?conversationId=${res.data.conversation.ConversationID}`);
      } else {
        toast.error("Failed to start conversation. Please try again.");
      }
    } catch (err: any) {
      console.error("Chat start error", err);
      toast.error(err.response?.data?.errors?.[0]?.message || "Failed to open chat.");
    } finally {
      setIsChatLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">My Learning Sessions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your requests and attend your scheduled classes.</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-1">
            <TabsTrigger value="SCHEDULED">Scheduled</TabsTrigger>
            <TabsTrigger value="PENDING_MATCH">Requested</TabsTrigger>
            <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
            <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : sessions.length === 0 ? (
              <Card className="p-20 text-center bg-white dark:bg-gray-900 border-dashed">
                <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No {activeTab.toLowerCase().replace('_', ' ')} sessions</h3>
                <p className="text-gray-500 mb-6">Find a mentor to start your learning journey.</p>
                <Button asChild>
                  <Link href="/skills">Find Mentors</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {sessions.map((session: any) => {
                  const config = statusConfig[session.Status as keyof typeof statusConfig] || statusConfig.CANCELLED;
                  const StatusIcon = config.icon;
                  const proposedSlots = timeSlotsData?.[session.SessionID] || [];

                  return (
                    <Card key={session.SessionID} className="p-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex items-center gap-4 md:border-r md:pr-6 border-gray-100 dark:border-gray-800 min-w-[250px]">
                          <Avatar className="h-16 w-16 ring-4 ring-primary/5">
                            <AvatarImage src={session.MentorImage} />
                            <AvatarFallback><User className="w-8 h-8 opacity-20" /></AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-bold">{session.MentorName}</h3>
                            <Badge className={cn("text-[10px] uppercase font-bold mt-1", config.color)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          <div>
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Session Detail</h4>
                            <h3 className="text-xl font-bold">{session.Title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{session.Description || "No description provided."}</p>
                          </div>

                          {session.Status === 'SCHEDULED' || session.Status === 'IN_PROGRESS' ? (
                            <div className="flex items-center gap-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                              <div className="text-center">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Date</p>
                                <p className="font-bold">{format(new Date(session.ScheduledStart), "MMM dd, yyyy")}</p>
                              </div>
                              <div className="h-8 w-px bg-primary/20" />
                              <div className="text-center">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Time</p>
                                <p className="font-bold">{format(new Date(session.ScheduledStart), "p")}</p>
                              </div>
                              <Button className="ml-auto" asChild>
                                <Link href={`/learner/video-call?sessionId=${session.SessionID}`}>
                                  <Video className="w-4 h-4 mr-2" />
                                  Join Meeting
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleChat(session.MentorID)}
                                disabled={isChatLoading === session.MentorID}
                              >
                                {isChatLoading === session.MentorID ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                )}
                                Message
                              </Button>
                            </div>
                          ) : session.Status === 'CANCELLED' ? (
                            <div className="flex justify-end gap-3 mt-4">
                              <Button
                                variant="outline"
                                onClick={() => handleChat(session.MentorID)}
                                disabled={isChatLoading === session.MentorID}
                              >
                                {isChatLoading === session.MentorID ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                )}
                                Message Mentor
                              </Button>
                            </div>
                          ) : null}

                          {session.Status === 'COMPLETED' && (
                            <div className="flex justify-end gap-3 mt-4">
                              <Button
                                onClick={() => setReviewingSession({ id: session.SessionID, name: session.MentorName })}
                                className="bg-primary shadow-lg shadow-primary/20"
                              >
                                <Star className="w-4 h-4 mr-2" />
                                Rate Mentor
                              </Button>
                            </div>
                          )}

                          {session.Status === 'PENDING_MATCH' && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Proposed Time Slots</h4>
                                {proposedSlots.length > 0 && (
                                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 animate-bounce">
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                              {proposedSlots.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {proposedSlots.map((slot) => (
                                    <Button
                                      key={slot.TimeSlotID}
                                      variant="outline"
                                      className="justify-between h-auto py-3 px-4 rounded-xl border-dashed hover:border-primary hover:bg-primary/5 group"
                                      onClick={() => handleSelectSlot(session.SessionID, slot.TimeSlotID)}
                                      disabled={!!isSelecting}
                                    >
                                      <div className="text-left">
                                        <p className="text-xs font-bold text-muted-foreground">{format(new Date(slot.StartTime), "EEE, MMM dd")}</p>
                                        <p className="text-sm font-bold">{format(new Date(slot.StartTime), "p")}</p>
                                      </div>
                                      {isSelecting === slot.TimeSlotID ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Check className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      )}
                                    </Button>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                  <Clock3 className="w-8 h-8 text-gray-300 mb-2 animate-pulse" />
                                  <p className="text-sm text-gray-500 font-medium italic">
                                    Waiting for mentor to propose time slots...
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {reviewingSession && (
        <ReviewModal
          isOpen={!!reviewingSession}
          onClose={() => setReviewingSession(null)}
          sessionId={reviewingSession.id}
          targetName={reviewingSession.name}
          onSuccess={() => {
            setReviewingSession(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

export default function LearnerSessionsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <LearnerSessionsContent />
    </Suspense>
  );
}
