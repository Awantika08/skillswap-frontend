export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
}

export interface Profile {
  UserID: string;
  FullName: string;
  Email: string;
  PasswordHash: string;
  Role: "Mentor" | "Student" | "Admin"; // Add other roles as needed
  Bio: string | null;
  ProfileImageURL: string | null;
  CreatedAt: string; // ISO date string
  PasswordResetToken: string | null;
  PasswordResetExpires: string | null; // ISO date string or null
  Status: "Active" | "Inactive" | "Suspended"; // Add other statuses as needed
  UpdatedAt: string; // ISO date string
  NotificationPreferences: NotificationPreferences;
  Timezone: string;
}

export interface ProfileResponse {
  success: boolean;
  data: Profile;
  fromCache: boolean;
}

// Optional: For updating profile
export interface UpdateProfilePayload {
  FullName?: string;
  Bio?: string | null;
  ProfileImageURL?: string | null;
  NotificationPreferences?: Partial<NotificationPreferences>;
  Timezone?: string;
}

// Optional: For changing password
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Optional: For updating notification preferences
export interface UpdateNotificationPreferencesPayload {
  email?: boolean;
  inApp?: boolean;
}
