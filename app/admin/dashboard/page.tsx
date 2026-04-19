"use client";

import React, { useState, useEffect } from "react";
import {
  useGetDashboardStats,
  useGetAdminAlerts,
  useGetUserGrowth,
  useGetSessionTrends,
  useGetTopMentors,
  useGetPopularSkills,
  useGetActivityLogs
} from "@/features/adminDashboard/hooks/useAdminDashboard";
import StatsGrid from "@/components/adminDashboard/StatsGrid";
import AlertsSection from "@/components/adminDashboard/AlertsSection";
import UserGrowthChart from "@/components/adminDashboard/UserGrowthChart";
import SessionTrendsChart from "@/components/adminDashboard/SessionTrendChart";
import SessionsOverview from "@/components/adminDashboard/SessionOverview";
import SkillsOverview from "@/components/adminDashboard/SkillsOverview";
import RecentActivityWidget from "@/components/adminDashboard/RecentActivityWidget";

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStats();
  const { data: alertsData, isLoading: alertsLoading } = useGetAdminAlerts();
  const { data: userGrowthData, isLoading: userGrowthLoading = true } = useGetUserGrowth();
  const { data: sessionTrendsData, isLoading: sessionTrendsLoading = true } = useGetSessionTrends();
  const { data: mentorsData, isLoading: mentorsLoading } = useGetTopMentors();
  const { data: skillsData, isLoading: skillsLoading } = useGetPopularSkills();
  const { data: logsData, isLoading: logsLoading } = useGetActivityLogs({ page: 1, limit: 10 });

  const stats = statsData?.data;
  const alerts = alertsData?.data;
  const userGrowth = userGrowthData?.data;
  const sessionTrends = sessionTrendsData?.data;
  const recentLogs = logsData?.data?.logs;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Command Center
            </h1>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">
              Platform Intelligence & Core Auditing
            </p>
          </div>
          <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-white/50 dark:bg-gray-900/50 px-3 py-1.5 rounded-full border border-white/20">
            Node Refresh: {mounted ? new Date().toLocaleTimeString() : "Syncing..."}
          </div>
        </div>

        {/* Alerts Section */}
        <AlertsSection alerts={alerts} isLoading={alertsLoading} />

        {/* Stats Grid - Key Metrics */}
        <StatsGrid stats={stats} isLoading={statsLoading} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Charts & Primary Intel (Left) */}
          <div className="xl:col-span-2 space-y-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UserGrowthChart data={userGrowth} isLoading={userGrowthLoading} />
              <SessionTrendsChart data={sessionTrends} isLoading={sessionTrendsLoading} />
            </div>

            {/* Overview Row - Fixed to fill empty space */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SessionsOverview stats={stats} isLoading={statsLoading} />
              <SkillsOverview stats={stats} isLoading={statsLoading} />
            </div>
          </div>

          {/* Real-time Signals Column (Right) */}
          <div className="space-y-6 h-full">
            <RecentActivityWidget logs={recentLogs || []} isLoading={logsLoading} />

            {/* Supplementary information or quick links could go here if needed */}
            <div className="p-6 bg-primary/10 border border-primary/20 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-primary/20 transition-all">
              <div>
                <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">System Health</p>
                <p className="text-sm font-bold">100% Operational</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
