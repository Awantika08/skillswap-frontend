import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Play, XCircle, AlertCircle, Activity, CheckCircle2 } from "lucide-react";
import { DashboardStats } from "@/types/adminDashboard";
import { cn } from "@/lib/utils";

interface SessionsOverviewProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function SessionsOverview({ stats, isLoading }: SessionsOverviewProps) {
  if (isLoading) {
    return (
      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-white/20 dark:border-gray-800/20 rounded-[2rem] p-6 space-y-4">
        <Skeleton className="h-6 w-32 rounded-full" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
        <Skeleton className="h-24 w-full rounded-2xl" />
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
    <Card className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border-white/20 dark:border-gray-800/20 shadow-2xl rounded-[2rem] overflow-hidden ring-1 ring-white/10">
      <CardHeader className="pb-4 border-b border-white/10 dark:border-gray-800/50 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-gray-500">
          <div className="h-6 w-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Activity className="h-3.5 w-3.5" />
          </div>
          Operational Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Key Indicators */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 p-3 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Total</p>
            <p className="text-xl font-black text-gray-900 dark:text-white">{totalSessions}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase mb-1">Rate</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{completionRate.toFixed(0)}%</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <p className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase mb-1">Avg</p>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">
              {stats?.sessions.avg_duration_minutes ? Math.round(parseFloat(stats.sessions.avg_duration_minutes)) : "0"}m
            </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/20 dark:bg-gray-800/20 rounded-xl group transition-all hover:bg-white/40">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Play className="h-3.5 w-3.5 fill-current" />
              </div>
              <span className="text-xs font-black uppercase tracking-tight text-gray-600 dark:text-gray-400">In Progress</span>
            </div>
            <span className="text-sm font-black text-gray-900 dark:text-white">{inProgress}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/20 dark:bg-gray-800/20 rounded-xl group transition-all hover:bg-white/40">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-black uppercase tracking-tight text-gray-600 dark:text-gray-400">Scheduled</span>
            </div>
            <span className="text-sm font-black text-gray-900 dark:text-white">{scheduled}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/20 dark:bg-gray-800/20 rounded-xl group transition-all hover:bg-white/40">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-black uppercase tracking-tight text-gray-600 dark:text-gray-400">Pending Match</span>
            </div>
            <span className="text-sm font-black text-gray-900 dark:text-white">{pendingMatch}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/20 dark:bg-gray-800/20 rounded-xl group transition-all hover:bg-white/40">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                <XCircle className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-black uppercase tracking-tight text-gray-600 dark:text-gray-400">Cancelled</span>
            </div>
            <span className="text-sm font-black text-gray-900 dark:text-white">{cancelled}</span>
          </div>
        </div>

        {/* Efficiency Bar */}
        <div className="pt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Efficiency
            </span>
            <span className="text-[10px] font-black text-gray-400">{completed} / {totalSessions}</span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5 border border-white/10">
             <div 
               className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"
               style={{ width: `${completionRate}%` }}
             />
          </div>
        </div>

        {stats && stats.sessions.reported !== "0" && (
          <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-tight">
              {stats.sessions.reported} Internal Incidents Flagged
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}