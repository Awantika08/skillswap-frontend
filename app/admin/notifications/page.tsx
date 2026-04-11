"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBroadcastNotification } from "@/hooks/useBroadcastNotification";
import {
  broadcastNotificationSchema,
  BroadcastNotificationFormData,
} from "@/zod/notification";
import { NotificationType } from "@/types/notification";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NotificationsPage() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BroadcastNotificationFormData>({
    resolver: zodResolver(broadcastNotificationSchema),
    defaultValues: {
      title: "",
      content: "",
      type: NotificationType.SESSION_SCHEDULED,
      userRole: "Mentor",
    },
  });

  const mutation = useBroadcastNotification(() => reset());

  const onSubmit = (data: BroadcastNotificationFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
      </div>

      <Card className="max-w-6xl">
        <CardHeader>
          <CardTitle>Broadcast Notification</CardTitle>
          <CardDescription>
            Send a notification to all users of a specific role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter notification title"
                {...register("title")}
                disabled={mutation.isPending}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Notification Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={mutation.isPending}
                  >
                    <SelectTrigger
                      className={errors.type ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(NotificationType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userRole">Recipient Role</Label>
              <Controller
                control={control}
                name="userRole"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={mutation.isPending}
                  >
                    <SelectTrigger
                      className={errors.userRole ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Users</SelectItem>
                      <SelectItem value="Mentor">Mentor</SelectItem>
                      <SelectItem value="Learner">Learner</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.userRole && (
                <p className="text-sm text-red-500">
                  {errors.userRole.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Enter notification message"
                {...register("content")}
                disabled={mutation.isPending}
                className={`min-h-[120px] resize-none ${errors.content ? "border-red-500" : ""}`}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
            >
              {mutation.isPending ? "Sending..." : "Send Broadcast"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
