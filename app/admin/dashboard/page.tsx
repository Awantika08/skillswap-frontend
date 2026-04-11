"use client";

import React, { useState, useEffect } from "react";
import { useGetDashboardStats, useGetAdminAlerts, useGetUserGrowth, useGetSessionTrends } from "@/features/adminDashboard/hooks/useAdminDashboard";
import StatsGrid from "@/components/adminDashboard/StatsGrid";
import AlertsSection from "@/components/adminDashboard/AlertsSection";
import UserGrowthChart from "@/components/adminDashboard/UserGrowthChart";
import SessionTrendsChart from "@/components/adminDashboard/SessionTrendChart";
import SessionsOverview from "@/components/adminDashboard/SessionOverview";
import ReviewsSection from "@/components/adminDashboard/ReviewsSection";
import ReportsSection from "@/components/adminDashboard/ReportsSection";
import SkillsOverview from "@/components/adminDashboard/SkillsOverview";

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStats();
  const { data: alertsData, isLoading: alertsLoading } = useGetAdminAlerts();
  const { data: userGrowthData, isLoading: userGrowthLoading = true } = useGetUserGrowth();
  const { data: sessionTrendsData, isLoading: sessionTrendsLoading = true } = useGetSessionTrends();

  const stats = statsData?.data;
  const alerts = alertsData?.data;
  const userGrowth = userGrowthData?.data;
  const sessionTrends = sessionTrendsData?.data;

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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Platform overview and key metrics
            </p>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Last updated: {mounted ? new Date().toLocaleDateString() : "Loading..."}
          </div>
        </div>

        {/* Alerts Section */}
        <AlertsSection alerts={alerts} isLoading={alertsLoading} />

        {/* Stats Grid - Key Metrics */}
        <StatsGrid stats={stats} isLoading={statsLoading} />

        {/* Charts Section - First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserGrowthChart data={userGrowth} isLoading={userGrowthLoading} />
          <SessionTrendsChart data={sessionTrends} isLoading={sessionTrendsLoading} />
        </div>

        {/* Second Row - Detailed Views */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SessionsOverview stats={stats} isLoading={statsLoading} />
          <SkillsOverview stats={stats} isLoading={statsLoading} />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReviewsSection stats={stats} isLoading={statsLoading} />
          <div className="space-y-6">
            <ReportsSection stats={stats} isLoading={statsLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
