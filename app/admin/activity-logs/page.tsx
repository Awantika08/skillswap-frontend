"use client";

import React, { useState } from "react";
import { useGetActivityLogs } from "@/features/adminDashboard/hooks/useAdminDashboard";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  UserPlus,
  Video,
  AlertTriangle,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Database,
  Search,
  RefreshCcw,
  User,
  ShieldCheck
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const logIcons: any = {
  user_registration: {
    icon: UserPlus,
    color: "from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700",
    shadow: "shadow-blue-500/20",
    label: "Onboarding"
  },
  session: {
    icon: Video,
    color: "from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700",
    shadow: "shadow-purple-500/20",
    label: "Session Event"
  },
  report: {
    icon: AlertTriangle,
    color: "from-red-500 to-orange-600 dark:from-red-600 dark:to-orange-700",
    shadow: "shadow-red-500/20",
    label: "Platform Safety"
  }
};

export default function AdminActivityLogsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const { data: logsResponse, isLoading, refetch } = useGetActivityLogs({ page, limit });

  const logs = logsResponse?.data?.logs || [];
  const pagination = logsResponse?.data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-6 md:p-10">
      <div className="max-w-[1100px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
              <ShieldCheck className="w-3 h-3" /> Audit Monitor
            </div>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-[2rem] bg-white dark:bg-gray-900 flex items-center justify-center text-primary shadow-2xl shadow-primary/10 border border-gray-100 dark:border-gray-800">
                <Database className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white drop-shadow-sm">Log Repository</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Real-time audit of platform interactions and system events.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} className="bg-white dark:bg-gray-900 rounded-xl h-11 px-4 font-bold">
              <RefreshCcw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Global Stats/Filters Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-white/20 dark:border-gray-800/20 shadow-xl shadow-blue-500/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">U</div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Registrations</p>
                <p className="text-xl font-black">{pagination?.total || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-white/20 dark:border-gray-800/20 shadow-xl shadow-purple-500/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 font-bold">S</div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Live Sessions</p>
                <p className="text-xl font-black">Active</p>
              </div>
            </div>
          </Card>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Filter logs by keyword..."
              className="h-full bg-white dark:bg-gray-900 border-none shadow-xl pl-12 rounded-2xl font-medium"
            />
          </div>
        </div>

        {/* Main Logs Container */}
        <Card className="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-2xl border-white/40 dark:border-gray-800/40 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-800 to-transparent hidden md:block" />

          <div className="p-4 md:p-8 space-y-6">
            {isLoading ? (
              <div className="py-32 text-center space-y-4">
                <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse mx-auto">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <p className="text-sm font-bold text-muted-foreground tracking-widest uppercase">Deciphering audit stream...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="py-32 text-center">
                <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-400">Silence in the Logs</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-2">No activities have been recorded in the platform's audit trail yet.</p>
              </div>
            ) : (
              logs.map((log: any, idx: number) => {
                const config = logIcons[log.type] || logIcons.session;
                const Icon = config.icon;

                return (
                  <div key={`${log.id}-${idx}`} className="relative flex gap-6 md:gap-10 group">
                    {/* Timeline Node */}
                    <div className="hidden md:flex flex-shrink-0 items-center justify-center w-8 z-10">
                      <div className={cn("h-4 w-4 rounded-full border-4 border-white dark:border-gray-900 transition-all group-hover:scale-150 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.5)]",
                        log.type === 'user_registration' ? 'bg-blue-500' :
                          log.type === 'session' ? 'bg-purple-500' : 'bg-red-500'
                      )} />
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 min-w-0 transition-transform hover:-translate-x-1 duration-300">
                      <div className="bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 p-6 rounded-[2rem] hover:shadow-2xl hover:bg-white dark:hover:bg-gray-800 transition-all flex flex-col md:flex-row gap-6">

                        <div className={cn("h-16 w-16 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg bg-gradient-to-br", config.color, config.shadow)}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-[9px] font-black uppercase tracking-wider text-gray-500">
                                {config.label}
                              </span>
                              <span className="h-1 w-1 rounded-full bg-gray-300" />
                              <span className="text-[10px] font-bold text-primary uppercase">ID: {log.id.slice(0, 8)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground whitespace-nowrap">
                              {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                            </div>
                          </div>

                          <div className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            {log.type === 'user_registration' && (
                              <span>New <span className="text-blue-500 border-b-2 border-blue-500/20 pb-0.5">{log.role}</span> Onboarded: <span className="text-primary font-black italic">{log.name}</span></span>
                            )}
                            {log.type === 'session' && (
                              <span>Session "<span className={cn("px-2 py-0.5 rounded-lg", log.status === 'COMPLETED' ? 'bg-green-500/10 text-green-600' : 'bg-primary/10 text-primary')}>{log.title}</span>" {log.status?.toLowerCase() === 'completed' ? 'Successfully Finalized' : 'Transitioned to ' + log.status?.toLowerCase()}</span>
                            )}
                            {log.type === 'report' && (
                              <span>Report alert triggered by <span className="text-red-500">{log.name}</span> for <span className="italic">"{log.title}"</span></span>
                            )}
                          </div>

                          {log.type === 'session' && (
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 px-3 py-1.5 rounded-xl border border-white/20 dark:border-gray-800/20">
                                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-black text-primary uppercase">M</div>
                                <span className="text-xs font-black text-gray-700 dark:text-gray-300">{log.mentor_name || 'System Auto'}</span>
                              </div>
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 px-3 py-1.5 rounded-xl border border-white/20 dark:border-gray-800/20">
                                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-black text-blue-600 uppercase">L</div>
                                <span className="text-xs font-black text-gray-700 dark:text-gray-300">{log.learner_name}</span>
                              </div>
                            </div>
                          )}

                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-2">
                            Commit Timestamp: {format(new Date(log.created_at), "PPP p")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.pages > 1 && (
            <div className="p-8 border-t border-white/20 dark:border-gray-800/20 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
              <div className="hidden md:block">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest space-x-4">
                  <span>Cluster: Audit-Chain-01</span>
                  <span>|</span>
                  <span>Active Nodes: {pagination.total}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="rounded-xl h-11 px-6 font-black bg-white dark:bg-gray-900 border-none shadow-xl disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> RECALL
                </Button>
                <div className="h-11 px-6 flex items-center justify-center font-black text-xs bg-primary text-white rounded-xl shadow-2xl shadow-primary/30">
                  {page} / {pagination.pages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === pagination.pages}
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-xl h-11 px-6 font-black bg-white dark:bg-gray-900 border-none shadow-xl disabled:opacity-30"
                >
                  NEXT <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
