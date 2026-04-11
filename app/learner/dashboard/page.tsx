"use client";

import React, { useState, useMemo } from "react";
import { WelcomeHeader } from "@/components/learner-dashboard/WelcomeHeader";
import { StatCard } from "@/components/learner-dashboard/StatCard";
import { DashboardTabs } from "@/components/learner-dashboard/DashboardTabs";
import { SessionsSection } from "@/components/learner-dashboard/SessionsSection";
import { QuickActions } from "@/components/learner-dashboard/QuickActions";
import { useAuthStore } from "@/store/authStore";
import { BookOpen, Users, Calendar, Star, Timer, GraduationCap, RefreshCcw } from "lucide-react";
import { useLearnerStats } from "@/features/learner/hooks/useLearnerStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function LearnerDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: statsResponse, isLoading, error, refetch } = useLearnerStats();

  const stats = useMemo(() => {
    if (!statsResponse?.data) return [];

    const d = statsResponse.data;
    return [
      {
        label: "Sessions Completed",
        value: d.overview.completedSessions,
        icon: GraduationCap,
        iconBgColor: "bg-rose-50",
        iconColor: "text-rose-500",
      },
      {
        label: "Learning Hours",
        value: d.overview.totalLearningHours.toFixed(1),
        icon: Timer,
        iconBgColor: "bg-emerald-50",
        iconColor: "text-emerald-500",
      },
      {
        label: "Nearby Sessions",
        value: d.sessions.scheduled + d.sessions.inProgress,
        icon: Calendar,
        iconBgColor: "bg-indigo-50",
        iconColor: "text-indigo-500",
        statusBadge: d.sessions.inProgress > 0 ? "Live Now" : "Upcoming",
      },
      {
        label: "Active Mentors",
        value: d.overview.totalMentors,
        icon: Users,
        iconBgColor: "bg-amber-50",
        iconColor: "text-amber-500",
        statusBadge: "Connected",
      },
    ];
  }, [statsResponse]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <WelcomeHeader name={user?.name || "Learner"} />

      {/* Stats Cards Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load your statistics.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      )}

      {/* Navigation Tabs */}
      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "overview" && <SessionsSection />}
          {activeTab === "sessions" && (
            <div className="bg-card p-12 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 border-none shadow-sm h-[400px]">
              <div className="p-4 bg-muted/20 rounded-full">
                <Calendar className="w-12 h-12 text-muted-foreground opacity-50" />
              </div>
              <p className="text-muted-foreground font-medium italic">
                Manage your full session schedule here.
              </p>
            </div>
          )}
          {activeTab === "skills" && (
            <div className="bg-card p-12 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 border-none shadow-sm h-[400px]">
              <div className="p-4 bg-muted/20 rounded-full">
                <BookOpen className="w-12 h-12 text-muted-foreground opacity-50" />
              </div>
              <p className="text-muted-foreground font-medium italic">
                Track your learning and teaching skills.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Sidebar Container */}
        <div className="space-y-8">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
