import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flag, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { DashboardStats } from "@/types/adminDashboard";

interface ReportsSectionProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function ReportsSection({ stats, isLoading }: ReportsSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalReports = parseInt(stats?.reports.total_reports || "0");
  const pending = parseInt(stats?.reports.pending || "0");
  const reviewed = parseInt(stats?.reports.reviewed || "0");
  const resolved = parseInt(stats?.reports.resolved || "0");
  const dismissed = parseInt(stats?.reports.dismissed || "0");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Flag className="h-4 w-4 text-primary" />
          Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2 text-center">
          <div className="p-2">
            <Flag className="h-4 w-4 mx-auto text-gray-500 mb-1" />
            <p className="text-lg font-bold">{totalReports}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
            <Clock className="h-4 w-4 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold text-yellow-600">{pending}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <AlertTriangle className="h-4 w-4 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold text-blue-600">{reviewed}</p>
            <p className="text-xs text-gray-500">Reviewed</p>
          </div>
          <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <CheckCircle className="h-4 w-4 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold text-green-600">{resolved}</p>
            <p className="text-xs text-gray-500">Resolved</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
            <XCircle className="h-4 w-4 mx-auto text-gray-500 mb-1" />
            <p className="text-lg font-bold text-gray-500">{dismissed}</p>
            <p className="text-xs text-gray-500">Dismissed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}