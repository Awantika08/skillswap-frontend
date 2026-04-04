import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Bell, HelpCircle } from "lucide-react";
import { DashboardStats } from "@/types/adminDashboard";

interface EngagementMetricsProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function EngagementMetrics({ stats, isLoading }: EngagementMetricsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const messages = parseInt(stats?.engagement.total_messages || "0");
  const notifications = parseInt(stats?.engagement.unread_notifications || "0");
  const questions = parseInt(stats?.engagement.unanswered_questions || "0");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          Engagement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <MessageCircle className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-sm font-medium">Total Messages</span>
            </div>
            <span className="text-lg font-bold">{messages}</span>
          </div>
          
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <Bell className="h-4 w-4 text-yellow-500" />
              </div>
              <span className="text-sm font-medium">Unread Notifications</span>
            </div>
            <span className="text-lg font-bold text-yellow-600">{notifications}</span>
          </div>
          
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <HelpCircle className="h-4 w-4 text-purple-500" />
              </div>
              <span className="text-sm font-medium">Unanswered Questions</span>
            </div>
            <span className="text-lg font-bold text-purple-600">{questions}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}