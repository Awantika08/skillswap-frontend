"use client";

import StatsGrid from "@/components/mentorDashboardUI/StatsGrid";
import PendingSessionRequests from "@/components/mentorDashboardUI/PendingSessionRequests";
import SkillsYouTeach from "@/components/mentorDashboardUI/SkillsYouTeach";
import RecentFeedback from "@/components/mentorDashboardUI/RecentFeedback";

export default function MentorDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Mentor Dashboard
            </h1>
            <span className="bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Active Mentor
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your teaching sessions and help students grow
          </p>
        </div>

        {/* Stats Grid */}
        <StatsGrid />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column (2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <PendingSessionRequests />
          </div>
          
          {/* Right Column (1/3 width on large screens) */}
          <div className="lg:col-span-1 space-y-8">
             <SkillsYouTeach />
             <RecentFeedback />
          </div>

        </div>
      </div>
    </div>
  );
}
