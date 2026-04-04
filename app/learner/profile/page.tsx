"use client";

import React from "react";
import { useGetProfile } from "@/features/profile/hooks/useGetProfile";
import { useProfileStore } from "@/store/profileStore";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { NotificationPreferences } from "@/components/profile/notificationPreference";
import { ProfileSkeleton } from "@/components/profile/profileSkeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LearnerProfile = () => {
  const router = useRouter();
  const { profile, isLoading, error } = useProfileStore();
  const { refetch } = useGetProfile();

  const handleToggleNotification = async (
    type: "email" | "inApp",
    value: boolean,
  ) => {
    // For now, just showing a toast
    toast.success(
      `${type === "email" ? "Email" : "In-App"} notifications ${value ? "enabled" : "disabled"}`,
    );
    // TODO: Implement API call to update preferences
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
      {/* Editable Profile Form */}
      <EditProfileForm profile={profile} />

      {/* Notification Preferences */}
      <NotificationPreferences
        profile={profile}
        onToggle={handleToggleNotification}
      />

      {/* Account Actions */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/learner/profile/change-password")}
        >
          Change Password
        </Button>
      </div>
    </div>
  );
};

export default LearnerProfile;
