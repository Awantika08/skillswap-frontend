"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, UpdateUserValues } from "@/zod/user";
import { User } from "@/types/user";
import { useUpdateUser } from "@/features/user/hooks/useUpdateUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UpdateUserFormProps {
  user: User;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const timezones = [
  "UTC",
  "GMT",
  "EST",
  "PST",
  "CET",
  "IST",
  "JST",
  "AEST",
  "Asia/Kathmandu",
  "Asia/Kolkata",
  "America/New_York",
  "Europe/London",
];

const getFullImageUrl = (url: string | null) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

export const UpdateUserForm = ({
  user,
  onCancel,
  onSuccess,
}: UpdateUserFormProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(
    getFullImageUrl(user.ProfileImageURL),
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: user.FullName,
      bio: user.Bio || "",
      timezone: user.Timezone || "UTC",
      status: user.Status,
    },
  });

  const updateMutation = useUpdateUser(user.UserID);
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

  const onSubmit = (values: UpdateUserValues) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    if (values.bio) formData.append("bio", values.bio);
    formData.append("timezone", values.timezone);
    formData.append("status", values.status);
    if (values.profileImage instanceof File) {
      formData.append("profileImage", values.profileImage);
    }

    updateMutation.mutate(formData, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="mx-auto max-w-6xl shadow-lg border-primary/10">
      <CardHeader className="bg-primary/5 rounded-t-lg border-b mb-6">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <span>Edit Profile</span>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center gap-4 bg-muted/30 p-6 rounded-xl border border-dashed border-primary/20">
            <Label className="text-muted-foreground font-medium uppercase tracking-wider text-xs">Profile Picture</Label>
            <div className="relative group">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl scale-100 group-hover:scale-105 transition-transform duration-300">
                <AvatarImage src={previewImage || ""} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {getInitials(user.FullName)}
                </AvatarFallback>
              </Avatar>
              {previewImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -right-1 -top-1 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              )}
            </div>
            
            <div className="flex flex-col items-center gap-2">
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
                size="sm"
                className="rounded-full px-6 bg-background hover:bg-primary/5 border-primary/20 transition-all hover:border-primary/50"
                onClick={() => document.getElementById("profileImage")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload New Image
              </Button>
              <p className="text-[10px] text-muted-foreground italic">Recommended: Square image, max 2MB</p>
            </div>
            {errors.profileImage && (
              <p className="text-sm text-destructive font-medium animate-pulse">
                {errors.profileImage.message as string}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
              <Input id="email" value={user.Email} disabled className="bg-muted/50 border-transparent h-11 cursor-not-allowed italic" />
              <p className="text-[11px] font-medium flex items-center gap-1 opacity-70">
                <span className="h-1 w-1 rounded-full bg-orange-400" /> Note: Email is managed by identity provider
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold">Account Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value: any) => setValue("status", value)}
              >
                <SelectTrigger className="h-11 border-primary/10 transition-all focus:ring-primary/20">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="border-primary/10">
                  <SelectItem value="Active" className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50">Active</SelectItem>
                  <SelectItem value="Inactive" className="text-slate-600 focus:text-slate-700 focus:bg-slate-50">Inactive</SelectItem>
                  <SelectItem value="Suspended" className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 font-medium">Suspended</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive font-medium">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-sm font-semibold">Timezone</Label>
              <Select
                value={watch("timezone")}
                onValueChange={(value) => setValue("timezone", value)}
              >
                <SelectTrigger className="h-11 border-primary/10 transition-all focus:ring-primary/20">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-60 border-primary/10">
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timezone && (
                <p className="text-sm text-destructive font-medium">
                  {errors.timezone.message}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-semibold">Biography</Label>
            <Textarea
              id="bio"
              placeholder="Provide a brief background or expertise summary..."
              rows={4}
              className="resize-none focus-visible:ring-primary/30 border-primary/10 min-h-[120px]"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-sm text-destructive font-medium">{errors.bio.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-primary/10">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="h-11 px-8 rounded-lg hover:bg-muted/50 border-primary/10 transition-all"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-11 px-10 rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
