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

// Session List Types
export interface AdminSession {
  SessionID: string;
  Title: string;
  Description: string;
  Status: string;
  ScheduledStart: string;
  mentorName: string;
  mentorEmail: string;
  learnerName: string;
  learnerEmail: string;
  review_count: string;
  report_count: string;
  CreatedAt: string;
}

export interface AdminSessionsResponse {
  success: boolean;
  data: {
    sessions: AdminSession[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Activity Log Types
export interface ActivityLog {
  type: 'session' | 'user_registration' | 'report';
  id: string;
  title?: string;
  status?: string;
  created_at: string;
  mentor_name?: string;
  learner_name?: string;
  name?: string;
  role?: string;
}

export interface ActivityLogsResponse {
  success: boolean;
  data: {
    logs: ActivityLog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Mentor/Skill Metrics
export interface TopMentor {
  UserID: string;
  FullName: string;
  Email: string;
  ProfileImageURL: string;
  total_sessions: string;
  completed_sessions: string;
  avg_rating: string;
  total_reviews: string;
}

export interface PopularSkill {
  SkillID: string;
  Name: string;
  CategoryName: string;
  mentor_count: string;
  session_count: string;
  completed_sessions: string;
}