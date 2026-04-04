import api from "@/lib/api";
import {
  DashboardStatsResponse,
  AdminAlertsResponse,
  UserGrowthResponse,
  SessionTrendResponse,
} from "@/types/adminDashboard";

// Main Dashboard
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  try {
    const response = await api.get<DashboardStatsResponse>("/admin/stats");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch dashboard stats");
  }
};

export const getAdminAlerts = async (): Promise<AdminAlertsResponse> => {
  try {
    const response = await api.get<AdminAlertsResponse>("/admin/alerts");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch admin alerts");
  }
};

// Chart Data APIs
export const getUserGrowthData = async (): Promise<UserGrowthResponse> => {
  try {
    const response = await api.get<UserGrowthResponse>("/admin/charts/user-growth");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch user growth data");
  }
};

export const getSessionTrendsData = async (): Promise<SessionTrendResponse> => {
  try {
    const response = await api.get<SessionTrendResponse>("/admin/charts/session-trends");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch session trends data");
  }
};