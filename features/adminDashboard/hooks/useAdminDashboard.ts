import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getAdminAlerts,
  getUserGrowthData,
  getSessionTrendsData,
  getTopMentors,
  getPopularSkills,
  getAllSessionsAdmin,
  getActivityLogs
} from "../api/adminDashboard";

// Main Dashboard Hooks
export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getDashboardStats,
  });
};

export const useGetAdminAlerts = () => {
  return useQuery({
    queryKey: ["admin", "alerts"],
    queryFn: getAdminAlerts,
    refetchInterval: 30000,
  });
};

// Chart Data Hooks
export const useGetUserGrowth = () => {
  return useQuery({
    queryKey: ["admin", "charts", "user-growth"],
    queryFn: getUserGrowthData,
  });
};

export const useGetSessionTrends = () => {
  return useQuery({
    queryKey: ["admin", "charts", "session-trends"],
    queryFn: getSessionTrendsData,
  });
};

// List and Table Hooks
export const useGetTopMentors = () => {
  return useQuery({
    queryKey: ["admin", "top-mentors"],
    queryFn: getTopMentors,
  });
};

export const useGetPopularSkills = () => {
  return useQuery({
    queryKey: ["admin", "popular-skills"],
    queryFn: getPopularSkills,
  });
};

export const useGetAllSessionsAdmin = (params: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ["admin", "sessions", params],
    queryFn: () => getAllSessionsAdmin(params),
  });
};

export const useGetActivityLogs = (params: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["admin", "activity-logs", params],
    queryFn: () => getActivityLogs(params),
  });
};