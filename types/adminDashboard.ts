// Dashboard Stats Types
export interface DashboardStats {
  users: {
    total_users: string;
    total_mentors: string;
    total_learners: string;
    active_users: string;
    inactive_users: string;
    banned_users: string;
    new_users_week: string;
    new_users_month: string;
  };
  sessions: {
    total_sessions: string;
    pending_match: string;
    scheduled: string;
    in_progress: string;
    completed: string;
    cancelled: string;
    reported: string;
    new_sessions_week: string;
    new_sessions_month: string;
    avg_duration_minutes: string;
  };
  skills: {
    total_skills: string;
    available_skills: string;
    total_categories: string;
    mentors_with_skills: string;
  };
  reviews: {
    total_reviews: string;
    avg_rating: string;
    sessions_reviewed: string;
    five_star: string;
    four_star: string;
    three_star: string;
    two_star: string;
    one_star: string;
  };
  reports: {
    total_reports: string;
    pending: string;
    reviewed: string;
    resolved: string;
    dismissed: string;
    new_reports_week: string;
  };
  notifications: {
    total_notifications: string;
    unread_notifications: string;
  };
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

// User Growth Chart Types
export interface UserGrowthData {
  date: string;
  new_users: string;
  new_mentors: string;
  new_learners: string;
}

export interface UserGrowthResponse {
  success: boolean;
  data: UserGrowthData[];
}

// Session Trends Chart Types
export interface SessionTrendData {
  date: string;
  total_sessions: string;
  completed: string;
  cancelled: string;
  avg_duration: string;
}

export interface SessionTrendResponse {
  success: boolean;
  data: SessionTrendData[];
}

// Alerts Types
export interface AdminAlerts {
  pendingReports: number;
  inactiveMentors: number;
  reportedSessions: number;
  missingMeetingLinks: number;
  flaggedUsers: any[];
}

export interface AdminAlertsResponse {
  success: boolean;
  data: AdminAlerts;
}