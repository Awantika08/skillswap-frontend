import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, ListCheck } from "lucide-react";
import { DashboardStats } from "@/types/adminDashboard";

interface NotificationsSummaryProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function NotificationsSummary({ stats, isLoading }: NotificationsSummaryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const unreadCount = parseInt(stats?.notifications.unread_notifications || "0");
  const totalCount = parseInt(stats?.notifications.total_notifications || "0");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Notifications Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <Bell className="h-4 w-4 text-yellow-500" />
              </div>
              <span className="text-sm font-medium">Unread Notifications</span>
            </div>
            <span className="text-xl font-bold text-yellow-600">{unreadCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <ListCheck className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-sm font-medium">Total Notifications</span>
            </div>
            <span className="text-xl font-bold text-blue-600">{totalCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
