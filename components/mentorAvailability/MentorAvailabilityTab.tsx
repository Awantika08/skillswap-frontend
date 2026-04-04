"use client";

import React from "react";
import { MentorAvailabilityForm } from "./MentorAvailabilityForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const MentorAvailabilityTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Availability</h2>
      </div>

      <div className="grid gap-6">
        <MentorAvailabilityForm />
      </div>
    </div>
  );
};
