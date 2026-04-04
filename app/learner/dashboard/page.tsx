"use client";

import React, { useState } from "react";
import { WelcomeHeader } from "@/components/learner-dashboard/WelcomeHeader";
import { StatCard } from "@/components/learner-dashboard/StatCard";
import { DashboardTabs } from "@/components/learner-dashboard/DashboardTabs";
import { SessionsSection } from "@/components/learner-dashboard/SessionsSection";
import { QuickActions } from "@/components/learner-dashboard/QuickActions";
import { useAuthStore } from "@/store/authStore";
import { BookOpen, Users, Calendar, Star } from "lucide-react";

export default function LearnerDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      label: "Skills Learning",
      value: 8,
      icon: BookOpen,
      iconBgColor: "bg-rose-50",
      iconColor: "text-rose-500",
      trend: { value: "+12%", type: "positive" as const },
    },
    {
      label: "Skills Teaching",
      value: 5,
      icon: Users,
      iconBgColor: "bg-emerald-50",
      iconColor: "text-emerald-500",
      trend: { value: "+5", type: "positive" as const },
    },
    {
      label: "Upcoming Sessions",
      value: 3,
      icon: Calendar,
      iconBgColor: "bg-indigo-50",
      iconColor: "text-indigo-500",
      statusBadge: "Today",
    },
    {
      label: "Average Rating",
      value: 4.9,
      icon: Star,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-500",
      statusBadge: "Excellent",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <WelcomeHeader name={user?.name || "Learner"} />

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

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
