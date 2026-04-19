import api from "@/lib/api";
import {
  DashboardStatsResponse,
  AdminAlertsResponse,
  UserGrowthResponse,
  SessionTrendResponse,
  TopMentor,
  PopularSkill,
  AdminSessionsResponse,
  ActivityLogsResponse
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

// Lists and Data Tables
export const getTopMentors = async (): Promise<{ success: boolean; data: TopMentor[] }> => {
  try {
    const response = await api.get("/admin/top-mentors");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch top mentors");
  }
};

export const getPopularSkills = async (): Promise<{ success: boolean; data: PopularSkill[] }> => {
  try {
    const response = await api.get("/admin/popular-skills");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch popular skills");
  }
};

export const getAllSessionsAdmin = async (params: { page?: number; limit?: number; status?: string }): Promise<AdminSessionsResponse> => {
  try {
    const response = await api.get<AdminSessionsResponse>("/admin/sessions", { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch sessions");
  }
};

export const getActivityLogs = async (params: { page?: number; limit?: number }): Promise<ActivityLogsResponse> => {
  try {
    const response = await api.get<ActivityLogsResponse>("/admin/activity-logs", { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch activity logs");
  }
};