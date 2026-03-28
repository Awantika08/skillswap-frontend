// app/mentor/profile/page.tsx
"use client";

import React, { useEffect } from "react";
import { useGetProfile } from "@/features/profile/hooks/useGetProfile";
import { useProfileStore } from "@/store/profileStore";
import { ProfileHeader } from "@/components/profile/profileHeader";
import { ProfileInfoCard } from "@/components/profile/profileInfoCard";
import { NotificationPreferences } from "@/components/profile/notificationPreference";
import { ProfileSkeleton } from "@/components/profile/profileSkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AdminProfile = () => {
  const router = useRouter();
  const { profile, isLoading, error } = useProfileStore();
  const { refetch } = useGetProfile();

  const handleEditProfile = () => {
    router.push("/mentor/profile/edit");
  };

  const handleToggleNotification = async (
    type: "email" | "inApp",
    value: boolean,
  ) => {
    // Here you would make an API call to update notification preferences
    // For now, just showing a toast
    toast.success(
      `${type === "email" ? "Email" : "In-App"} notifications ${value ? "enabled" : "disabled"}`,
    );

    // TODO: Implement API call to update preferences
    // await updateNotificationPreferences({ [type]: value });
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header with Edit Button */}
      <div className="flex items-start justify-between">
        <ProfileHeader profile={profile} />
        <Button onClick={handleEditProfile} variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Information */}
      <ProfileInfoCard profile={profile} />

      {/* Notification Preferences */}
      <NotificationPreferences
        profile={profile}
        onToggle={handleToggleNotification}
      />

      {/* Optional: Account Actions */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/mentor/profile/change-password")}
        >
          Change Password
        </Button>
      </div>
    </div>
  );
};

export default AdminProfile;
