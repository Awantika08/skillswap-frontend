"use client";

import { Calendar, Clock, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types/profile";

interface ProfileInfoCardProps {
  profile: Profile;
}

export const ProfileInfoCard = ({ profile }: ProfileInfoCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.Bio && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Bio
            </label>
            <p className="mt-1 text-sm">{profile.Bio}</p>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Timezone
              </label>
              <p className="text-sm">{profile.Timezone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Joined
              </label>
              <p className="text-sm">{formatDate(profile.CreatedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <p className="text-sm">{formatDate(profile.UpdatedAt)}</p>
              <p className="text-xs text-muted-foreground">
                at {formatTime(profile.UpdatedAt)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
