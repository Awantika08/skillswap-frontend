"use client";

import React from "react";
import { useGetProfile } from "@/features/profile/hooks/useGetProfile";
import { useProfileStore } from "@/store/profileStore";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { NotificationPreferences } from "@/components/profile/notificationPreference";
import { ProfileSkeleton } from "@/components/profile/profileSkeleton";
import { MentorSkillTab } from "@/components/mentorSkill/MentorSkillTab";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BookOpen, Clock, Star, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MentorAvailabilityTab } from "@/components/mentorAvailability/MentorAvailabilityTab";
import { useGetMyReviews } from "@/features/reviews/hooks/useReviews";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { ReviewStatsOverview } from "@/features/reviews/components/ReviewStats";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";

const MentorProfile = () => {
  const router = useRouter();
  const { profile, isLoading, error } = useProfileStore();
  const { refetch } = useGetProfile();

  const [reviewPage, setReviewPage] = React.useState(1);
  const { data: reviewsData, isLoading: isLoadingReviews } = useGetMyReviews(
    reviewPage,
    10
  );

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
          <TabsTrigger value="availability" className="gap-1.5">
            <Clock className="h-4 w-4" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="reviews" className="gap-1.5">
            <Star className="h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 pt-4">
          {/* Editable Profile Form */}
          <EditProfileForm profile={profile} />
        </TabsContent>

        <TabsContent value="skills" className="pt-4">
          <MentorSkillTab />
        </TabsContent>

        <TabsContent value="availability" className="pt-4">
          <MentorAvailabilityTab />
        </TabsContent>

        <TabsContent value="reviews" className="pt-4 space-y-8 animate-in fade-in slide-in-from-bottom-4">
          {isLoadingReviews ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : reviewsData?.data?.stats ? (
            <>
              <ReviewStatsOverview stats={reviewsData.data.stats} />
              <div className="pt-2">
                <h3 className="text-xl font-bold mb-4">Recent Reviews</h3>
                <ReviewList
                  data={reviewsData}
                  isLoading={isLoadingReviews}
                  onPageChange={setReviewPage}
                />
              </div>
            </>
          ) : null}
        </TabsContent>

        <TabsContent value="security" className="pt-4 max-w-2xl">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorProfile;
