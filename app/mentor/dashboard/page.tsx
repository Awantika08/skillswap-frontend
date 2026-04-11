"use client";

import StatsGrid from "@/components/mentorDashboardUI/StatsGrid";
import PendingSessionRequests from "@/components/mentorDashboardUI/PendingSessionRequests";
import UpcomingSessions from "@/components/mentorDashboardUI/UpcomingSessions";
import SkillsYouTeach from "@/components/mentorDashboardUI/SkillsYouTeach";
import RecentFeedback from "@/components/mentorDashboardUI/RecentFeedback";
import MentorTrendsChart from "@/components/mentorDashboardUI/MentorTrendsChart";
import DashboardSkeleton from "@/components/mentorDashboardUI/DashboardSkeleton";
import { useMentorStats } from "@/features/mentorDashboard/hooks/useMentorStats";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function MentorDashboardPage() {
  const { data: statsResponse, isLoading, error, refetch } = useMentorStats();
  const stats = statsResponse?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-8">
          <div className="flex flex-col gap-1">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
            <div className="h-4 w-96 bg-gray-100 dark:bg-gray-900 animate-pulse rounded mt-2" />
          </div>
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load dashboard statistics. Please try again.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-[1700px] mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Mentor Dashboard
              </h1>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border border-emerald-500/20">
                Live
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Welcome back! Here's what's happening with your sessions today.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid overview={stats?.overview} sessions={stats?.sessions} />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column (2/3 width on large screens) */}
          <div className="xl:col-span-2 space-y-10">
            {/* Trends Visualization */}
            {stats?.trends && (
              <MentorTrendsChart data={stats.trends.monthlyTrends} />
            )}
            
            <UpcomingSessions />
            <PendingSessionRequests />
          </div>
          
          {/* Right Column (1/3 width on large screens) */}
          <div className="xl:col-span-1 space-y-10">
             <SkillsYouTeach skills={stats?.skills?.popularSkills} />
             <RecentFeedback />
          </div>

        </div>
      </div>
    </div>
  );
}
