"use client";

import { useGetProfile } from "@/features/profile/hooks/useGetProfile";
import { useProfileStore } from "@/store/profileStore";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { ProfileSkeleton } from "@/components/profile/profileSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";

const AdminProfile = () => {
  const { profile, isLoading, error } = useProfileStore();
  const { refetch } = useGetProfile();

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

  // if (error) {
  //   return (
  //     <div className="container mx-auto p-6">
  //       <Alert variant="destructive">
  //         <AlertDescription>
  //           {error}
  //           <Button
  //             variant="outline"
  //             size="sm"
  //             className="ml-4"
  //             onClick={() => refetch()}
  //           >
  //             Try Again
  //           </Button>
  //         </AlertDescription>
  //       </Alert>
  //     </div>
  //   );
  // }

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-4 w-4" />
            Profile
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

        <TabsContent value="security" className="pt-4 max-w-2xl">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProfile;
