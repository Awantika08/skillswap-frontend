// components/profile/NotificationPreferences.tsx
"use client";

import { Bell, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Profile } from "@/types/profile";

interface NotificationPreferencesProps {
  profile: Profile;
  onToggle: (type: "email" | "inApp", value: boolean) => void;
}

export const NotificationPreferences = ({
  profile,
  onToggle,
}: NotificationPreferencesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
          </div>
          <Switch
            checked={profile.NotificationPreferences.email}
            onCheckedChange={(checked) => onToggle("email", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">In-App Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications within the app
              </p>
            </div>
          </div>
          <Switch
            checked={profile.NotificationPreferences.inApp}
            onCheckedChange={(checked) => onToggle("inApp", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
