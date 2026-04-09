"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MentorAvatar from "@/components/MentorAvatar";
import {
  ArrowLeft,
  Star,
  MessageSquare,
  MessageSquarePlus,
  Share2,
  BookOpen,
  Clock,
  Calendar,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { useMentorById } from "@/features/learner/hooks/useMentorById";
import { useMentorAvailability } from "@/features/learner/hooks/useMentorAvailability";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { chatApi } from "@/features/chat/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { SessionRequestModal } from "@/features/videoSession/components/SessionRequestModal";

export default function MentorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: response, isLoading, error } = useMentorById(id);
  const { data: availabilityResponse } = useMentorAvailability(id);
  const availability = availabilityResponse?.data;
  
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleChat = async () => {
    try {
      setIsChatLoading(true);
      const res = await chatApi.getOrCreateConversation(id);
      if (res.success && res.data?.conversation) {
        router.push(`/chat?conversationId=${res.data.conversation.ConversationID}`);
      } else {
        toast.error("Failed to start conversation. Please try again.");
      }
    } catch (err: any) {
      console.error("Chat start error", err);
      toast.error(err.response?.data?.errors?.[0]?.message || "Please log in to chat with a mentor.");
    } finally {
      setIsChatLoading(false);
    }
  };

  const DAYS_MAP = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minutes} ${ampm}`;
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-semibold text-foreground animate-pulse">
          Loading Mentor Profile...
        </h2>
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold">!</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Mentor Not Found
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            We couldn't find the mentor you were looking for. They might have
            changed their profile or no longer be available.
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/skills")}
            className="rounded-xl px-8 w-full sm:w-auto text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Browse Other Mentors
          </Button>
        </div>
      </div>
    );
  }

  const mentor = response.data;
  const initials = mentor.FullName.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  const colors = [
    "blue",
    "green",
    "purple",
    "pink",
    "amber",
    "teal",
    "indigo",
    "rose",
  ];
  // Deterministic color based on user ID length or simple hash so it doesn't flicker
  const colorIndex = mentor.UserID.charCodeAt(0) % colors.length;
  const mentorColor = colors[colorIndex];

  const getFullImageUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 pb-24">
      {/* Dynamic Background Header */}
      <div className="h-64 md:h-80 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40 opacity-70" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-40 relative z-10">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-background/50 hover:bg-background/80 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-foreground transition-all mb-6 font-medium text-sm shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>

        {/* Profile Header Card */}
        <Card className="rounded-[2rem] border-0 shadow-2xl shadow-primary/5 overflow-hidden bg-background/95 backdrop-blur-xl mb-10">
          <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-primary/30 rounded-full blur-md opacity-30" />
              {mentor.ProfileImageURL ? (
                <img
                  src={getFullImageUrl(mentor.ProfileImageURL)}
                  alt={mentor.FullName}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-background shadow-xl relative z-10"
                />
              ) : (
                <div className="relative z-10 shadow-xl rounded-full border-4 border-background overflow-hidden">
                  <MentorAvatar
                    initials={initials}
                    color={mentorColor}
                    size="lg"
                  />
                </div>
              )}
              {/* Optional verified badge */}
              <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-blue-500 text-white p-1.5 rounded-full border-2 border-background shadow-lg z-20">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-grow w-full">
              <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
                    {mentor.FullName}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5 bg-primary/5 text-primary px-3 py-1 rounded-full border border-primary/10">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-bold text-foreground">
                        {mentor.avgRating}
                      </span>
                      <span>({mentor.totalReviews} Reviews)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      {mentor.skillCount} Skills
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      Remote
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full shadow-sm"
                  >
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                  </Button>

                  {availability && availability.weekly.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-full shadow-sm border-primary/20 text-primary hover:bg-primary cursor-pointer"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          View Schedule
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 rounded-2xl shadow-xl border-border/50 p-4">
                        <div className="mb-4">
                          <h4 className="font-bold text-foreground flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            Weekly Availability
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Available times for coaching sessions.
                          </p>
                        </div>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                          {availability.weekly.map((slot: any) => (
                            <div
                              key={slot.AvailabilityID}
                              className="flex items-center justify-between bg-muted/30 p-2.5 rounded-xl border border-border/30"
                            >
                              <span className="font-semibold text-sm w-12">
                                {DAYS_MAP[slot.DayOfWeek]}
                              </span>
                              <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-1 rounded-md">
                                {formatTime(slot.StartTime)} -{" "}
                                {formatTime(slot.EndTime)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}

                  <Button 
                    onClick={handleChat}
                    disabled={isChatLoading}
                    variant="secondary"
                    className="rounded-full shadow-lg shadow-primary/10 px-6 text-base font-semibold group flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {isChatLoading ? (
                      <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    {isChatLoading ? "Opening..." : "Chat"}
                  </Button>

                  <Button 
                    onClick={() => setIsRequestModalOpen(true)}
                    className="grow rounded-full shadow-lg shadow-primary/20 px-8 text-base font-semibold group flex items-center gap-2"
                  >
                    <MessageSquarePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Connect
                  </Button>
                </div>
              </div>

              {isRequestModalOpen && (
                <SessionRequestModal
                  isOpen={isRequestModalOpen}
                  onClose={() => setIsRequestModalOpen(false)}
                  mentorId={id}
                  mentorName={mentor.FullName}
                  skills={mentor.skills}
                />
              )}

              {/* Bio */}
              <div className="mt-6 pt-6 border-t border-border/40">
                <h3 className="text-lg font-bold text-foreground mb-3">
                  About Me
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
                  {mentor.Bio ||
                    "Hi there! I'm an experienced professional passionate about sharing my knowledge and helping others grow in their careers. Check out my skills below to see how I can help you achieve your goals."}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Areas of Expertise / Skills */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-3">
              <span className="bg-primary/10 text-primary p-2 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </span>
              Areas of Expertise
            </h2>
          </div>

          {mentor.skills.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 bg-muted/10 rounded-[2rem]">
              <p className="text-lg text-muted-foreground font-medium">
                This mentor hasn't listed any specific skills yet.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentor.skills.map((skill) => (
                <Card
                  key={skill.SkillID}
                  className="group rounded-[1.5rem] overflow-hidden border-border/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {skill.Name}
                        </h3>
                        {/* Assuming SkillCategoryID holds category name for now, or display general badge */}
                        <Badge
                          variant="secondary"
                          className="bg-muted text-muted-foreground"
                        >
                          Skill Level:{" "}
                          {skill.ExperienceLevel > 3
                            ? "Advanced"
                            : skill.ExperienceLevel > 1
                              ? "Intermediate"
                              : "Beginner"}
                        </Badge>
                      </div>
                      <Badge
                        className={
                          skill.IsAvailable
                            ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
                            : "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20"
                        }
                      >
                        {skill.IsAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-grow">
                      {skill.Description}
                    </p>

                    <div className="space-y-4 border-t border-border/40 pt-4 mt-auto">
                      {skill.DetailedContent && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                            What you'll learn
                          </h4>
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {skill.DetailedContent}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Approach
                          </span>
                          <span className="text-sm font-semibold capitalize bg-secondary w-fit px-2 py-0.5 rounded-md">
                            {skill.TeachingStyle}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}