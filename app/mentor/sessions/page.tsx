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
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  Video, 
  Loader2, 
  MoreVertical,
  Mail,
  CheckCircle2,
  Clock3,
  XCircle,
  Play
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { chatApi } from "@/features/chat/api";
import { toast } from "react-hot-toast";
import { useSessionSocket } from "@/features/videoSession/hooks/useSessionSocket";
import { MessageSquare, Star, Check } from "lucide-react";
import { ReviewModal } from "@/features/reviews/components/ReviewModal";
import { ProposeSlotsModal } from "@/features/videoSession/components/ProposeSlotsModal";

const statusConfig = {
  PENDING_MATCH: { label: "Requested", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock3 },
  SCHEDULED: { label: "Scheduled", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Calendar },
  IN_PROGRESS: { label: "In Progress", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse", icon: Play },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", icon: XCircle },
};

export default function MentorSessionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "SCHEDULED");
  const [isChatLoading, setIsChatLoading] = useState<string | null>(null);
  const [reviewingSession, setReviewingSession] = useState<{ id: string, name: string } | null>(null);
  const [selectedSession, setSelectedSession] = useState<{ id: string, learnerName: string } | null>(null);

  // Hook into real-time session updates
  useSessionSocket();

  const { data: sessions, isLoading, refetch } = useQuery({
    queryKey: ["mentor", "sessions", activeTab],
    queryFn: async () => {
      const response = await api.get(`/mentor/sessions?status=${activeTab}`);
      return response.data?.data?.sessions || [];
    },
  });

  // Auto-open review modal if query param is present
  useEffect(() => {
    const reviewId = searchParams.get("review");
    if (reviewId && sessions && sessions.length > 0) {
      const session = sessions.find((s: any) => s.SessionID === reviewId);
      if (session && session.Status === 'COMPLETED') {
        setReviewingSession({ id: session.SessionID, name: session.LearnerName });
        // Clear the query params without refreshing
        const newUrl = window.location.pathname;
        window.history.replaceState({ ...window.history.state }, "", newUrl);
      }
    }
  }, [searchParams, sessions]);

  const handleChat = async (learnerId: string) => {
    try {
      setIsChatLoading(learnerId);
      const res = await chatApi.getOrCreateConversation(learnerId);
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">My Sessions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and attend your teaching sessions.</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-1">
            <TabsTrigger value="SCHEDULED">Scheduled</TabsTrigger>
            <TabsTrigger value="PENDING_MATCH">Requests</TabsTrigger>
            <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
            <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : sessions?.length === 0 ? (
              <Card className="p-20 text-center bg-white dark:bg-gray-900 border-dashed">
                <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No {activeTab.toLowerCase().replace('_', ' ')} sessions</h3>
                <p className="text-gray-500 mb-6">You don't have any sessions in this category yet.</p>
                <Button asChild>
                  <Link href="/mentor/dashboard">Back to Dashboard</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {sessions.map((session: any) => {
                  const config = statusConfig[session.Status as keyof typeof statusConfig] || statusConfig.CANCELLED;
                  const StatusIcon = config.icon;

                  return (
                    <Card key={session.SessionID} className="p-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                        <div className="flex items-center gap-5">
                          <Avatar className="h-14 w-14 ring-4 ring-gray-50 dark:ring-gray-800">
                             <AvatarImage src={session.LearnerImage} />
                             <AvatarFallback className="text-lg">{session.LearnerName?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{session.LearnerName}</h3>
                              <Badge className={cn("text-[10px] font-bold px-2 py-0.5 uppercase", config.color)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-primary">{session.SkillName}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium pt-1">
                               <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {session.ScheduledStart ? format(new Date(session.ScheduledStart), "PPP") : "TBD"}</span>
                               <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {session.ScheduledStart ? format(new Date(session.ScheduledStart), "p") : "TBD"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                          {session.Status === 'SCHEDULED' || session.Status === 'IN_PROGRESS' ? (
                            <Button size="lg" className="flex-1 md:flex-none" asChild>
                              <Link href={`/mentor/video-call/${session.SessionID}`}>
                                <Video className="w-5 h-5 mr-2" />
                                Join Call
                              </Link>
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="lg" 
                              className="flex-1 md:flex-none"
                              onClick={() => handleChat(session.LearnerID)}
                              disabled={isChatLoading === session.LearnerID}
                            >
                              {isChatLoading === session.LearnerID ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <MessageSquare className="w-5 h-5 mr-2" />
                              )}
                              Message
                            </Button>
                          )}
                          {session.Status === 'PENDING_MATCH' && (
                            <Button 
                              onClick={() => setSelectedSession({ id: session.SessionID, learnerName: session.LearnerName })}
                              className="bg-primary flex-1 md:flex-none shadow-lg shadow-primary/20"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Review & Propose Slots
                            </Button>
                          )}
                          {session.Status === 'COMPLETED' && (
                            <Button 
                              onClick={() => setReviewingSession({ id: session.SessionID, name: session.LearnerName })}
                              className="bg-primary flex-1 md:flex-none shadow-lg shadow-primary/20"
                            >
                                <Star className="w-4 h-4 mr-2" />
                                Rate Learner
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full border border-gray-100 dark:border-gray-800">
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </Button>
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