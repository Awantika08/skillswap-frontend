"use client";

import { Calendar, Globe, Mail, User, Shield, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types/profile";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfileInfoCardProps {
  profile: Profile;
}

export const ProfileInfoCard = ({ profile }: ProfileInfoCardProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Full Name & Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input id="fullName" value={profile.FullName} readOnly className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <Input id="email" value={profile.Email} readOnly className="bg-muted/50" />
          </div>
        </div>

        {/* Role & Status */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Role
            </Label>
            <Input id="role" value={profile.Role} readOnly className="bg-muted/50 capitalize" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Status
            </Label>
            <Input id="status" value={profile.Status} readOnly className="bg-muted/50" />
          </div>
        </div>

        {/* Timezone & Joined */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="timezone" className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Timezone
            </Label>
            <Input id="timezone" value={profile.Timezone} readOnly className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="joined" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Joined
            </Label>
            <Input id="joined" value={formatDate(profile.CreatedAt)} readOnly className="bg-muted/50" />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profile.Bio || "No bio provided."}
            readOnly
            className="min-h-[100px] resize-none bg-muted/50"
          />
        </div>
      </CardContent>
    </Card>
  );
};
