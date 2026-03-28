"use client";

import React from "react";
import { useGetProfile } from "@/features/profile/hooks/useGetProfile";
import { useProfileStore } from "@/store/profileStore";
import { ProfileHeader } from "@/components/profile/profileHeader";
import { ProfileInfoCard } from "@/components/profile/profileInfoCard";
import { NotificationPreferences } from "@/components/profile/notificationPreference";
import { ProfileSkeleton } from "@/components/profile/profileSkeleton";
import { MentorSkillTab } from "@/components/mentorSkill/MentorSkillTab";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, User, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const MentorProfile = () => {
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
    toast.success(
      `${type === "email" ? "Email" : "In-App"} notifications ${value ? "enabled" : "disabled"}`,
    );
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

      {/* Tabs: Profile & Skills */}
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="skills" className="gap-1.5">
            <BookOpen className="h-4 w-4" />
            Skills
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 pt-4">
          {/* Profile Information */}
          <ProfileInfoCard profile={profile} />

          {/* Notification Preferences */}
          <NotificationPreferences
            profile={profile}
            onToggle={handleToggleNotification}
          />

          {/* Account Actions */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/mentor/profile/change-password")}
            >
              Change Password
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="pt-4">
          <MentorSkillTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorProfile;
