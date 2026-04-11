export interface OverviewStats {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  totalTeachingHours: number;
  averageSessionHours: number;
  averageRating: number;
  totalLearners: number;
  activeSkills: number;
}

export interface SessionStats {
  pendingMatch: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  reported: number;
}

export interface TeachingStats {
  totalTeachingHours: number;
  averageSessionHours: number;
  completedSessions: number;
}

export interface PopularSkill {
  SkillID: string;
  Name: string;
  IsAvailable: boolean;
  sessionCount: string; // API returns string
  uniqueLearners: string; // API returns string
}

export interface SkillStats {
  totalSkills: number;
  availableSkills: number;
  unavailableSkills: number;
  popularSkills: PopularSkill[];
}

export interface WeeklyDistribution {
  DayOfWeek: number;
  slotsCount: string;
}

export interface AvailabilityStats {
  weeklySlots: number;
  upcomingSpecificSlots: number;
  totalActiveSlots: number;
  weeklyDistribution?: WeeklyDistribution[];
}

export interface LearnerStats {
  totalUniqueLearners: number;
  completedWithLearners: number;
  upcomingWithLearners: number;
}

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  positiveRatings: number;
  excellentRatings: number;
}

export interface RecentPerformanceTrend {
  date: string;
  sessionsCount: string;
  completedCount: string;
}

export interface MonthlyTrend {
  month: string;
  totalSessions: string;
  completedSessions: string;
}

export interface MentorTrends {
  recentPerformance: RecentPerformanceTrend[];
  monthlyTrends: MonthlyTrend[];
}

export interface MentorStats {
  overview: OverviewStats;
  sessions: SessionStats;
  teaching: TeachingStats;
  skills: SkillStats;
  availability: AvailabilityStats;
  learners: LearnerStats;
  ratings: RatingStats;
  trends: MentorTrends;
}

export interface MentorStatsResponse {
  success: boolean;
  data: MentorStats;
}
