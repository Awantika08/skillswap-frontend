import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  UserCheck, 
  Award, 
  Star, 
  BookOpen,
  UserCircle,
  TrendingUp
} from "lucide-react";
import { DashboardStats } from "@/types/adminDashboard";

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
      trendLabel: "this month",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Active Users",
      value: stats?.users.active_users,
      icon: UserCheck,
      subtitle: `${stats?.users.active_users} active`,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Mentors",
      value: stats?.users.total_mentors,
      icon: Award,
      subtitle: `${stats?.skills.mentors_with_skills} with skills`,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Learners",
      value: stats?.users.total_learners,
      icon: UserCircle,
      subtitle: "Active learners",
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Avg Rating",
      value: stats?.reviews.avg_rating !== "0" ? stats?.reviews.avg_rating : "N/A",
      icon: Star,
      subtitle: "out of 5.0",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Total Skills",
      value: stats?.skills.total_skills,
      icon: BookOpen,
      subtitle: `${stats?.skills.total_categories} categories`,
      color: "from-pink-500 to-pink-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-9 w-20 mb-2" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((card, index) => (
        <Card 
          key={index} 
          className="p-5 hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary group bg-white dark:bg-gray-900"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {card.label}
            </p>
            <div className={`p-2 rounded-xl bg-gradient-to-br ${card.color} shadow-sm`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {card.value || "0"}
            </p>
            {card.trend && parseInt(card.trend) > 0 && (
              <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                +{card.trend}
              </span>
            )}
          </div>
          
          {card.subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {card.subtitle}
            </p>
          )}
          
          {card.trendLabel && card.trend && parseInt(card.trend) > 0 && (
            <p className="text-xs text-gray-400 mt-1">{card.trendLabel}</p>
          )}
        </Card>
      ))}
    </div>
  );
}