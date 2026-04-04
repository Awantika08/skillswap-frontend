export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
}

export interface Profile {
  UserID: string;
  FullName: string;
  Email: string;
  Role: "Mentor" | "Student" | "Admin";
  Status: "Active" | "Inactive" | "Suspended";
  Bio: string | null;
  ProfileImageURL: string | null;
  Timezone: string;
  NotificationPreferences: NotificationPreferences;
  CreatedAt: string; // ISO date string
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
