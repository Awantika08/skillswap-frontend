// ---------- Skill Category Interface ----------
export interface SkillCategory {
  SkillCategoryID: string;
  Name: string;
  Description: string;
}

// ---------- Create Skill Category ----------
export interface CreateSkillCategoryPayload {
  name: string;
  description: string;
}

export interface CreateSkillCategoryResponse {
  success: boolean;
  data: SkillCategory;
}

// ---------- Get All Skill Categories ----------
export interface GetAllSkillCategoriesResponse {
  success: boolean;
  data: {
    categories: SkillCategory[];
    pagination: PaginationInfo;
  };
  fromCache?: boolean;
}

// ---------- Get Single Skill Category ----------
export interface GetSkillCategoryResponse {
  success: boolean;
  data: SkillCategory;
}

// ---------- Update Skill Category ----------
export interface UpdateSkillCategoryPayload {
  name?: string;
  description?: string;
}

export interface UpdateSkillCategoryResponse {
  success: boolean;
  data: SkillCategory;
}

// ---------- Delete Skill Category ----------
export interface DeleteSkillCategoryResponse {
  success: boolean;
  message?: string;
}

// ---------- Pagination Interface ----------
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ---------- Query Parameters for Get All ----------
export interface GetAllSkillCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
