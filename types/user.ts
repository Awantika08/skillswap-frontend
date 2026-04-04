// types/user.ts

// ---------- User Interface ----------
export interface User {
  UserID: string;
  FullName: string;
  Email: string;
  Role: "Admin" | "Mentor" | "Learner";
  Status: "Active" | "Inactive" | "Suspended";
  Bio: string | null;
  ProfileImageURL: string | null;
  Timezone: string;
  NotificationPreferences: {
    email: boolean;
    inApp: boolean;
  };
  CreatedAt: string;
}

// ---------- Pagination Interface ----------
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ---------- Get All Users Response ----------
export interface GetAllUsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: PaginationInfo;
  };
  fromCache?: boolean;
}

// ---------- Get User By ID Response ----------
export interface GetUserResponse {
  success: boolean;
  data: User;
}

// ---------- Query Parameters for Get All Users ----------
export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: "Admin" | "Mentor" | "Learner";
  status?: "Active" | "Inactive" | "Suspended";
  sortBy?: "FullName" | "Email" | "Role" | "Status" | "CreatedAt";
  sortOrder?: "asc" | "desc";
}

// ---------- Update User Status Payload ----------
export interface UpdateUserStatusPayload {
  status: "Active" | "Inactive" | "Suspended";
}

export interface UpdateUserStatusResponse {
  success: boolean;
  data: User;
}

// ---------- Delete User Response ----------
export interface DeleteUserResponse {
  success: boolean;
  message?: string;
}

// ---------- Update User Interface ----------
export interface UpdateUserPayload {
  fullName?: string;
  bio?: string;
  profileImage?: File | null;
  timezone?: string;
  status?: "Active" | "Inactive" | "Suspended";
}

export interface UpdateUserResponse {
  success: boolean;
  data: User;
}

