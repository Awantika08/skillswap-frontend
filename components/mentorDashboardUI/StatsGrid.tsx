import { Card } from "@/components/ui/card";
import { 
  CalendarDays, 
  UserCheck, 
  Star, 
  TrendingUp,
  Clock,
  BookOpen,
  Users
} from "lucide-react";
import { OverviewStats, SessionStats } from "@/types/mentorDashboard";

interface StatsGridProps {
  overview?: OverviewStats;
  sessions?: SessionStats;
}

export default function StatsGrid({ overview, sessions }: StatsGridProps) {
  const statCards = [
    {
      label: "Total Sessions",
      value: overview?.totalSessions ?? 0,
      icon: CalendarDays,
      color: "from-red-400 to-red-500",
      textColor: "text-red-500"
    },
    {
      label: "Teaching Hours",
      value: overview?.totalTeachingHours?.toFixed(1) ?? "0.0",
      icon: Clock,
      color: "from-emerald-400 to-emerald-500",
      textColor: "text-emerald-500"
    },
    {
      label: "Average Rating",
      value: overview?.averageRating ?? "0.0",
      icon: Star,
      color: "from-amber-400 to-amber-500",
      textColor: "text-amber-500"
    },
    {
      label: "Completion Rate",
      value: `${overview?.completionRate ?? 0}%`,
      icon: TrendingUp,
      color: "from-purple-400 to-purple-500",
      textColor: "text-purple-500"
    },
    {
      label: "Active Skills",
      value: overview?.activeSkills ?? 0,
      icon: BookOpen,
      color: "from-rose-400 to-rose-500",
      textColor: "text-rose-500"
    },
    {
      label: "Total Learners",
      value: overview?.totalLearners ?? 0,
      icon: Users,
      color: "from-blue-400 to-blue-500",
      textColor: "text-blue-500"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((card, index) => (
        <Card 
          key={index} 
          className="relative p-5 hover:shadow-md transition-all duration-300 border-t-4 border-transparent hover:border-t-primary group bg-white dark:bg-gray-900 flex flex-col justify-between h-full overflow-hidden shadow-sm border-gray-100 dark:border-gray-800"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color} shadow-sm`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </div>
          <div>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {card.value}
            </h3>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {card.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
