"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, UpdateProfileValues } from "@/features/profile/schemas/profileSchema";
import { Profile } from "@/types/profile";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload, X, Shield, Activity, Calendar, Globe, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditProfileFormProps {
  profile: Profile;
}

const getFullImageUrl = (url: string | null) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

export const EditProfileForm = ({ profile }: EditProfileFormProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(
    getFullImageUrl(profile.ProfileImageURL)
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: profile.FullName || "",
      bio: profile.Bio || "",
    },
  });

  const updateMutation = useUpdateProfile();
  const isSubmitting = updateMutation.isPending;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profileImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue("profileImage", null);
    setPreviewImage(null);
  };

  const onSubmit = (values: UpdateProfileValues) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    if (values.bio !== undefined && values.bio !== null) {
      formData.append("bio", values.bio);
    }

    if (values.profileImage instanceof File) {
      formData.append("profileImage", values.profileImage);
    }

    updateMutation.mutate(formData);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full shadow-md border-primary/10">
      <CardHeader className="bg-primary/5 rounded-t-lg border-b pb-6">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          Profile Settings
          {isSubmitting && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
        </CardTitle>
        <CardDescription>
          Update your personal details.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-muted/20 rounded-xl border border-dashed border-primary/20">
            <div className="relative group shrink-0">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl transition-transform duration-300">
                <AvatarImage src={previewImage || ""} className="object-cover" />
                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                  {getInitials(profile.FullName)}
                </AvatarFallback>
              </Avatar>
              {previewImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <h3 className="font-semibold text-lg">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">
                We recommend a square image, maximum 2MB in size.
              </p>
              <Input
                type="file"
                id="profileImage"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button
                type="button"
                variant="outline"
                className="mt-2 rounded-full hover:bg-primary/5 border-primary/20 transition-all"
                onClick={() => document.getElementById("profileImage")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload New Image
              </Button>
              {errors.profileImage && (
                <p className="text-sm text-destructive font-medium mt-2">
                  {errors.profileImage.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold">Full Name</Label>
              <Input
                id="fullName"
                placeholder="e.g. John Doe"
                className="focus-visible:ring-primary/30 h-11 border-primary/10"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive font-medium">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email (Read Only) */}
            <div className="space-y-2 text-muted-foreground/80">
              <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email Address
              </Label>
              <Input id="email" value={profile.Email || ""} disabled className="bg-muted/50 border-transparent h-11 cursor-not-allowed italic" />
            </div>

            {/* Role (Read Only) */}
            <div className="space-y-2 text-muted-foreground/80">
              <Label htmlFor="role" className="text-sm font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" /> Role
              </Label>
              <Input id="role" value={profile.Role || ""} disabled className="bg-muted/50 border-transparent h-11 cursor-not-allowed italic capitalize" />
            </div>

            {/* Status (Read Only) */}
            <div className="space-y-2 text-muted-foreground/80">
              <Label htmlFor="status" className="text-sm font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" /> Status
              </Label>
              <Input id="status" value={profile.Status || ""} disabled className="bg-muted/50 border-transparent h-11 cursor-not-allowed italic" />
            </div>

            {/* Timezone (Read Only - we could make this editable but followed current spec) */}
            <div className="space-y-2 text-muted-foreground/80">
              <Label htmlFor="timezone" className="text-sm font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4" /> Timezone
              </Label>
              <Input id="timezone" value={profile.Timezone || "UTC"} disabled className="bg-muted/50 border-transparent h-11 cursor-not-allowed italic" />
            </div>

            {/* Joined Date (Read Only) */}
            <div className="space-y-2 text-muted-foreground/80">
              <Label htmlFor="joined" className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Joined
              </Label>
              <Input id="joined" value={formatDate(profile.CreatedAt)} disabled className="bg-muted/50 border-transparent h-11 cursor-not-allowed italic" />
            </div>

          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-semibold">Biography</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a little bit about yourself..."
              rows={5}
              className="resize-none focus-visible:ring-primary/30 border-primary/10"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-sm text-destructive font-medium">{errors.bio.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 border-t border-primary/10">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-11 px-8 rounded-lg shadow-md transition-all duration-300"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
