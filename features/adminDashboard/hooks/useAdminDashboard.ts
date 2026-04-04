import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getAdminAlerts,
  getUserGrowthData,
  getSessionTrendsData,
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
    refetchInterval: 30000, // Refetch every 30 seconds for real-time alerts
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