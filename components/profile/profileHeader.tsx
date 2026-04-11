"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Profile } from "@/types/profile";
import { getFullImageUrl } from "@/lib/utils";

interface ProfileHeaderProps {
  profile: Profile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "Suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
      <Avatar className="h-24 w-24">
        <AvatarImage
          src={getFullImageUrl(profile.ProfileImageURL)}
          alt={profile.FullName}
        />
        <AvatarFallback className="text-2xl">
          {profile.FullName?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{profile.FullName}</h1>
          <Badge className={getStatusColor(profile.Status)}>
            {profile.Status}
          </Badge>
        </div>
        <p className="text-muted-foreground">{profile.Email}</p>
        <Badge variant="outline" className="capitalize">
          {profile.Role}
        </Badge>
      </div>
    </div>
  );
};
