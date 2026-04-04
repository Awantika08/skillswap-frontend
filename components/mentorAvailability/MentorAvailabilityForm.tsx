"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mentorAvailabilitySchema, MentorAvailabilitySchemaType } from "@/zod/mentorAvailability";
import { useGetMentorAvailability } from "@/features/mentorAvailability/hooks/useGetMentorAvailability";
import { useUpdateMentorAvailability } from "@/features/mentorAvailability/hooks/useUpdateMentorAvailability";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Globe, CheckCircle2 } from "lucide-react";

const DAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

export const MentorAvailabilityForm = () => {
  const { data: currentAvailability, isLoading: isFetching } = useGetMentorAvailability();
  const updateMutation = useUpdateMentorAvailability();
  const [globalStartTime, setGlobalStartTime] = useState("09:00");
  const [globalEndTime, setGlobalEndTime] = useState("17:00");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      days: DAYS.map((day) => ({
        dayOfWeek: day.value,
        isActive: false,
        startTime: "09:00",
        endTime: "17:00",
      })),
    },
  });

  const handleApplyGlobalTime = () => {
    DAYS.forEach((_, index) => {
      setValue(`days.${index}.startTime`, globalStartTime, { shouldDirty: true });
      setValue(`days.${index}.endTime`, globalEndTime, { shouldDirty: true });
    });
  };

  // Sync with current availability from API
  useEffect(() => {
    const weeklyData = currentAvailability?.data?.weekly;
    
    if (weeklyData) {
      const updatedDays = DAYS.map((day) => {
        const found = weeklyData.find((a: any) => a.DayOfWeek === day.value);
        return {
          dayOfWeek: day.value,
          isActive: !!found,
          startTime: found?.StartTime || "09:00",
          endTime: found?.EndTime || "17:00",
        };
      });
      reset({ days: updatedDays });
    }
  }, [currentAvailability, reset]);

  const onSubmit = (data: any) => {
    const activeDays = data.days
      .filter((d: any) => d.isActive)
      .map((d: any) => ({
        dayOfWeek: d.dayOfWeek,
        startTime: d.startTime,
        endTime: d.endTime,
      }));

    updateMutation.mutate({ availability: activeDays });
  };

  if (isFetching) {
    return (
      <div className="space-y-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-20 w-full animate-pulse rounded-lg bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Weekly Schedule</CardTitle>
        <CardDescription>
          Configure your availability. Days that are toggled "ON" will be visible to students for booking.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Global Settings */}
          <div className="rounded-xl border bg-primary/5 p-4 transition-all hover:bg-primary/10">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Bulk Time Editor</h3>
            </div>
            <div className="flex flex-wrap items-end gap-6">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Default Start</Label>
                <Input
                  type="time"
                  value={globalStartTime}
                  onChange={(e) => setGlobalStartTime(e.target.value)}
                  className="w-32 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Default End</Label>
                <Input
                  type="time"
                  value={globalEndTime}
                  onChange={(e) => setGlobalEndTime(e.target.value)}
                  className="w-32 bg-background"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleApplyGlobalTime}
                className="gap-2 border-primary/20 hover:border-primary"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Apply to all days
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {DAYS.map((day, index) => {
              const isActive = watch(`days.${index}.isActive`);
              return (
                <div
                  key={day.value}
                  className={`flex flex-col space-y-4 rounded-xl border p-4 transition-all md:flex-row md:items-center md:justify-between md:space-y-0 ${
                    isActive 
                      ? "border-primary/20 bg-primary/5 shadow-sm" 
                      : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) => setValue(`days.${index}.isActive`, checked, { shouldDirty: true })}
                    />
                    <Label className={`w-24 font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {day.label}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                      <Label htmlFor={`start-${index}`} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Start</Label>
                      <Input
                        id={`start-${index}`}
                        type="time"
                        className={`w-32 h-10 transition-all ${!isActive ? "opacity-50 grayscale" : "border-primary/20"}`}
                        disabled={!isActive}
                        {...register(`days.${index}.startTime`)}
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Label htmlFor={`end-${index}`} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">End</Label>
                      <Input
                        id={`end-${index}`}
                        type="time"
                        className={`w-32 h-10 transition-all ${!isActive ? "opacity-50 grayscale" : "border-primary/20"}`}
                        disabled={!isActive}
                        {...register(`days.${index}.endTime`)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sticky bottom-0 bg-background/80 pt-4 backdrop-blur-sm">
            <div className="flex justify-end border-t pt-4">
              <Button
                type="submit"
                disabled={updateMutation.isPending || !isDirty}
                className="min-w-[160px] gap-2 shadow-lg transition-all active:scale-95"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {updateMutation.isPending ? "Saving..." : "Save Availability"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
