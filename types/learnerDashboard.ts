export interface OverviewStats {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  totalLearningHours: number;
  averageSessionHours: number;
  totalMentors: number;
  totalSkills: number;
  totalReviewsGiven: number;
}

export interface SessionStats {
  pendingMatch: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  reported: number;
}

export interface LearningStats {
  totalLearningHours: number;
  averageSessionHours: number;
  completedSessions: number;
}

export interface FavoriteMentor {
  UserID: string;
  FullName: string;
  ProfileImageURL: string | null;
  sessionCount: number;
  completedCount: number;
  avgRating: number;
}

export interface MentorStats {
  totalMentors: number;
  completedWithMentors: number;
  upcomingWithMentors: number;
  favoriteMentors: FavoriteMentor[];
}

export interface PopularSkill {
  SkillID: string;
  Name: string;
  sessionCount: number;
  uniqueMentors: number;
  completedCount: number;
}

export interface SkillStats {
  totalSkills: number;
  completedSkills: number;
  popularSkills: PopularSkill[];
}

export interface ReviewStats {
  totalReviews: number;
  averageRatingGiven: number;
  distribution: {
    [key: string]: number;
  };
}

export interface UpcomingSession {
  SessionID: string;
  Title: string;
  ScheduledStart: string;
  ScheduledEnd: string;
  MentorName: string;
  MentorImage: string | null;
  SkillName: string;
}

export interface UpcomingStats {
  nextWeek: UpcomingSession[];
  count: number;
}

export interface LearnerStats {
  overview: OverviewStats;
  sessions: SessionStats;
  learning: LearningStats;
  mentors: MentorStats;
  skills: SkillStats;
  reviews: ReviewStats;
  upcoming: UpcomingStats;
  recent: {
    sessions: any[];
  };
  trends: {
    recentPerformance: any[];
    monthlyTrends: any[];
  };
}

export interface LearnerStatsResponse {
  success: boolean;
  data: LearnerStats;
}
