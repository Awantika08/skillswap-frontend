"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    value: string;
    type: "positive" | "negative" | "neutral";
  };
  statusBadge?: string;
}

export const StatCard = ({
  label,
  value,
  icon: Icon,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
  trend,
  statusBadge,
}: StatCardProps) => {
  return (
    <Card className="border-none shadow-sm bg-card hover:bg-card/80 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-lg ${iconBgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          {trend && (
            <Badge
              variant="secondary"
              className={`text-xs font-medium ${
                trend.type === "positive"
                  ? "bg-green-100 text-green-700"
                  : trend.type === "negative"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {trend.value}
            </Badge>
          )}
          {statusBadge && (
            <Badge
              variant="outline"
              className="text-xs font-medium bg-green-50 text-emerald-700 border-emerald-100"
            >
              {statusBadge}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
};
