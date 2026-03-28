// ---------- Mentor Skill Interface ----------
export interface MentorSkill {
  SkillID: string;
  Name: string;
  Description: string;
  SkillCategoryID: string;
  DetailedContent: string;
  IsAvailable: boolean;
  ExperienceLevel: number;
  TeachingStyle: string;
  AddedAt: string; // ISO date string
  CategoryName: string;
  CategoryId: string;
}

// ---------- Get Mentor Skills ----------
export interface MentorSkillsResponse {
  success: boolean;
  data: MentorSkill[];
  fromCache: boolean;
}

// ---------- Add Mentor Skill ----------
export interface AddMentorSkillPayload {
  name: string;
  description: string;
  detailedContent: string;
  skillCategoryId: string;
  experienceLevel: string;
  teachingStyle: string;
}

export interface AddMentorSkillResponse {
  success: boolean;
  data: MentorSkill;
}

// ---------- Update Mentor Skill ----------
export interface UpdateMentorSkillPayload {
  name?: string;
  description?: string;
  detailedContent?: string;
  skillCategoryId?: string;
  experienceLevel?: string;
  teachingStyle?: string;
}

export interface UpdateMentorSkillResponse {
  success: boolean;
  data: MentorSkill;
}
