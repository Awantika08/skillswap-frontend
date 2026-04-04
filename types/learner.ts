export interface LearnerSkill {
  SkillID: string;
  Name: string;
  Description: string;
  SkillCategoryID: string;
  DetailedContent: string;
  IsAvailable: boolean;
  ExperienceLevel: number;
  TeachingStyle: string;
}

export interface LearnerMentor {
  UserID: string;
  FullName: string;
  Bio: string | null;
  ProfileImageURL: string | null;
  CreatedAt: string;
  avgRating: string;
  totalReviews: string;
  skillCount: string;
  skills: LearnerSkill[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface GetAvailableMentorsResponse {
  success: boolean;
  data: {
    mentors: LearnerMentor[];
    pagination: Pagination;
  };
}

export interface GetMentorByIdResponse {
  success: boolean;
  data: LearnerMentor;
}

export interface MentorAvailabilityItem {
  AvailabilityID: string;
  UserID: string;
  DayOfWeek: number;
  StartTime: string;
  EndTime: string;
  IsRecurring: boolean;
  SpecificDate: string | null;
  CreatedAt: string;
  IsActive: boolean;
  UpdatedAt: string;
}

export interface GetMentorAvailabilityResponse {
  success: boolean;
  data: {
    weekly: MentorAvailabilityItem[];
    specific: MentorAvailabilityItem[];
  };
}
