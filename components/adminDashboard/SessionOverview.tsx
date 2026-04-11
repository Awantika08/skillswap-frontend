import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Play, XCircle, AlertCircle } from "lucide-react";
import { DashboardStats } from "@/types/adminDashboard";

interface SessionsOverviewProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function SessionsOverview({ stats, isLoading }: SessionsOverviewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalSessions = parseInt(stats?.sessions.total_sessions || "0");
  const completed = parseInt(stats?.sessions.completed || "0");
  const scheduled = parseInt(stats?.sessions.scheduled || "0");
  const pendingMatch = parseInt(stats?.sessions.pending_match || "0");
  const inProgress = parseInt(stats?.sessions.in_progress || "0");
  const cancelled = parseInt(stats?.sessions.cancelled || "0");

  const completionRate = totalSessions > 0 ? (completed / totalSessions) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Sessions Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Sessions</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{totalSessions}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400">Completion Rate</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {completionRate.toFixed(0)}%
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400">Avg Duration</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {stats?.sessions.avg_duration_minutes ? parseFloat(stats.sessions.avg_duration_minutes).toFixed(1) : "0.0"}m
            </p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Play className="h-3 w-3 text-blue-500" />
              In Progress
            </span>
            <span className="font-medium">{inProgress}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-purple-500" />
              Scheduled
            </span>
            <span className="font-medium">{scheduled}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-yellow-500" />
              Pending Match
            </span>
            <span className="font-medium">{pendingMatch}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-red-500" />
              Cancelled
            </span>
            <span className="font-medium">{cancelled}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Completed Sessions</span>
            <span>{completed}/{totalSessions}</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {stats && stats.sessions.reported !== "0" && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-950/30 p-2 rounded">
            <AlertCircle className="h-3 w-3" />
            {stats.sessions.reported} reported sessions need attention
          </div>
        )}
      </CardContent>
    </Card>
  );
}