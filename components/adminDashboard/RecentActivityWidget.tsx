import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  History,
  ArrowRight,
  UserPlus,
  Video,
  AlertTriangle,
  Loader2,
  Clock,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface RecentActivityWidgetProps {
  logs: any[];
  isLoading: boolean;
}

const logConfig: any = {
  user_registration: {
    icon: UserPlus,
    color: "text-blue-500",
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    label: "Registration"
  },
  session: {
    icon: Video,
    color: "text-purple-500",
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    label: "Session"
  },
  report: {
    icon: AlertTriangle,
    color: "text-rose-500",
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    label: "Incident"
  },
};

export default function RecentActivityWidget({ logs, isLoading }: RecentActivityWidgetProps) {
  return (
    <Card className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border-white/20 dark:border-gray-800/20 shadow-2xl rounded-[2rem] overflow-hidden flex flex-col h-[500px] ring-1 ring-white/10">
      <div className="p-5 border-b border-white/10 dark:border-gray-800/50 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-700 dark:text-gray-300">Live Activity</h3>
        </div>
        <Link href="/admin/activity-logs">
          <Button variant="ghost" size="sm" className="h-7 text-[9px] uppercase font-black tracking-widest text-primary hover:bg-primary/10 rounded-lg">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary opacity-50" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Intercepting stream...</p>
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="py-20 text-center">
            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200 dark:border-gray-700">
              <History className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm font-bold text-muted-foreground">Quiet in the sector.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.slice(0, 15).map((log, idx) => {
              const config = logConfig[log.type] || logConfig.session;
              const Icon = config.icon;

              return (
                <div key={idx} className="group p-3 flex gap-4 bg-transparent hover:bg-white/40 dark:hover:bg-gray-800/40 rounded-xl transition-all duration-300 border border-transparent hover:border-white/40 dark:hover:border-gray-700/40">
                  <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform", config.bg, config.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={cn("text-[8px] font-black uppercase tracking-wider", config.color)}>
                        {config.label}
                      </span>
                      <span className="text-[9px] text-muted-foreground font-medium flex items-center gap-1 opacity-60">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate tracking-tight">
                      {log.type === 'user_registration' && (
                        <span>New {log.role}: <span className="text-primary italic font-black">{log.name}</span></span>
                      )}
                      {log.type === 'session' && (
                        <span>"{log.title}" <span className="opacity-60">{log.status?.toLowerCase()}</span></span>
                      )}
                      {log.type === 'report' && `Report: ${log.title}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
