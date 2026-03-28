"use client";

import { useProfileStore } from "@/store/profileStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();
  const [formData, setFormData] = useState({
    FullName: profile?.FullName || "",
    Bio: profile?.Bio || "",
    Timezone: profile?.Timezone || "UTC",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update profile
    updateProfile(formData);
    toast.success("Profile updated successfully");
    router.push("/mentor/profile");
  };

  if (!profile) return null;

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={formData.FullName}
                onChange={(e) =>
                  setFormData({ ...formData, FullName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={formData.Bio || ""}
                onChange={(e) =>
                  setFormData({ ...formData, Bio: e.target.value })
                }
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <Input
                value={formData.Timezone}
                onChange={(e) =>
                  setFormData({ ...formData, Timezone: e.target.value })
                }
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit">Save Changes</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
