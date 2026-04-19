import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserCheck,
  Award,
  Star,
  BookOpen,
  UserCircle,
  TrendingUp,
  Activity
} from "lucide-react";
import { DashboardStats } from "@/types/adminDashboard";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function StatsGrid({ stats, isLoading }: StatsGridProps) {
  const statCards = [
    {
      label: "Total Users",
      value: stats?.users.total_users,
      icon: Users,
      trend: stats?.users.new_users_month,
      trendLabel: "recent growth",
      color: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/20",
    },
    {
      label: "Active Users",
      value: stats?.users.active_users,
      icon: UserCheck,
      subtitle: `${stats?.users.active_users} online this cycle`,
      color: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
    },
    {
      label: "Lead Mentors",
      value: stats?.users.total_mentors,
      icon: Award,
      subtitle: `${stats?.skills.mentors_with_skills} skill verified`,
      color: "from-purple-500 to-violet-600",
      shadow: "shadow-purple-500/20",
    },
    {
      label: "Learners",
      value: stats?.users.total_learners,
      icon: UserCircle,
      subtitle: "Platform students",
      color: "from-orange-500 to-amber-600",
      shadow: "shadow-orange-500/20",
    },
    {
      label: "Avg Rating",
      value: stats?.reviews.avg_rating && stats.reviews.avg_rating !== "0"
        ? parseFloat(stats.reviews.avg_rating).toFixed(1)
        : "N/A",
      icon: Star,
      subtitle: `${stats?.reviews.total_reviews} total reviews`,
      color: "from-yellow-400 to-orange-500",
      shadow: "shadow-yellow-500/20",
    },
    {
      label: "Library Skills",
      value: stats?.skills.total_skills,
      icon: BookOpen,
      subtitle: `${stats?.skills.available_skills} available`,
      color: "from-pink-500 to-rose-600",
      shadow: "shadow-pink-500/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="p-6 rounded-3xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-white/20 dark:border-gray-800/20">
            <Skeleton className="h-4 w-24 mb-4 rounded-full" />
            <Skeleton className="h-10 w-20 mb-3 rounded-xl" />
            <Skeleton className="h-3 w-32 rounded-full" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statCards.map((card, index) => (
        <Card
          key={index}
          className="relative p-6 hover:shadow-2xl transition-all duration-500 border-none group bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-[2rem] overflow-hidden group hover:-translate-y-1 ring-1 ring-white/20 dark:ring-gray-800/20"
        >
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 rotate-12">
            <card.icon className="h-24 w-24" />
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
              {card.label}
            </p>
            <div className={cn("p-2.5 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform duration-500", card.color, card.shadow)}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
              {card.value || "0"}
            </p>
            {card.trend && parseInt(card.trend) > 0 && (
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/10">
                <TrendingUp className="h-3 w-3" />
                {card.trend}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            {card.subtitle && (
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter opacity-80">
                {card.subtitle}
              </p>
            )}

            {card.trendLabel && card.trend && parseInt(card.trend) > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className="h-1 w-1 rounded-full bg-emerald-500" />
                <p className="text-[9px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest">{card.trendLabel}</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}