import { Card } from "@/components/ui/card";
import { 
  CalendarDays, 
  UserCheck, 
  Star, 
  MessageSquare,
  Clock,
  CalendarCheck
} from "lucide-react";

export default function StatsGrid() {
  const statCards = [
    {
      label: "Total Sessions",
      value: "156",
      icon: CalendarDays,
      color: "from-red-400 to-red-500",
      textColor: "text-red-500"
    },
    {
      label: "Students Helped",
      value: "89",
      icon: UserCheck,
      color: "from-emerald-400 to-emerald-500",
      textColor: "text-emerald-500"
    },
    {
      label: "Average Rating",
      value: "4.9",
      icon: Star,
      color: "from-amber-400 to-amber-500",
      textColor: "text-amber-500"
    },
    {
      label: "Total Reviews",
      value: "234",
      icon: MessageSquare,
      color: "from-purple-400 to-purple-500",
      textColor: "text-purple-500"
    },
    {
      label: "Pending Requests",
      value: "7",
      icon: Clock,
      color: "from-rose-400 to-rose-500",
      textColor: "text-rose-500"
    },
    {
      label: "Upcoming Sessions",
      value: "5",
      icon: CalendarCheck,
      color: "from-blue-400 to-blue-500",
      textColor: "text-blue-500"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((card, index) => (
        <Card 
          key={index} 
          className="relative p-5 hover:shadow-md transition-all duration-300 border-t-4 border-transparent hover:border-t-primary group bg-white dark:bg-gray-900 flex flex-col justify-between h-full"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-10 shadow-sm shadow-${card.color.split("-")[1]}-500/20`}>
              <card.icon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
             <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {card.value}
            </h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {card.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
