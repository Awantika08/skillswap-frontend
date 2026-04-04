import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Bell, 
  Flag, 
  UserX, 
  AlertTriangle, 
  VideoOff, 
  CheckCircle 
} from "lucide-react";
import { AdminAlerts } from "@/types/adminDashboard";

interface AlertsSectionProps {
  alerts?: AdminAlerts;
  isLoading: boolean;
}

export default function AlertsSection({ alerts, isLoading }: AlertsSectionProps) {
  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!alerts) return null;

  const hasAlerts = alerts.pendingReports > 0 || 
                     alerts.inactiveMentors > 0 || 
                     alerts.reportedSessions > 0 || 
                     alerts.missingMeetingLinks > 0;

  return (
    <div className="mb-8">
     
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alerts.pendingReports > 0 && (
          <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-950/50">
            <Flag className="h-4 w-4" />
            <AlertTitle>Pending Reports</AlertTitle>
            <AlertDescription>
              {alerts.pendingReports} report{alerts.pendingReports !== 1 ? 's' : ''} awaiting review
            </AlertDescription>
          </Alert>
        )}
        
        {/* {alerts.inactiveMentors > 0 && (
          <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/50">
            <UserX className="h-4 w-4 text-yellow-600" />
            <AlertTitle>Inactive Mentors</AlertTitle>
            <AlertDescription>
              {alerts.inactiveMentors} mentor{alerts.inactiveMentors !== 1 ? 's' : ''} inactive for &gt;30 days
            </AlertDescription>
          </Alert>
        )} */}
        
        {alerts.reportedSessions > 0 && (
          <Alert variant="destructive" className="border-orange-500 bg-orange-50 dark:bg-orange-950/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Reported Sessions</AlertTitle>
            <AlertDescription>
              {alerts.reportedSessions} session{alerts.reportedSessions !== 1 ? 's' : ''} with reports
            </AlertDescription>
          </Alert>
        )}
        
        {alerts.missingMeetingLinks > 0 && (
          <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/50">
            <VideoOff className="h-4 w-4" />
            <AlertTitle>Missing Meeting Links</AlertTitle>
            <AlertDescription>
              {alerts.missingMeetingLinks} session{alerts.missingMeetingLinks !== 1 ? 's' : ''} need meeting links
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      {!hasAlerts && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>All Clear</AlertTitle>
          <AlertDescription>
            No critical alerts at this time. System is operating normally.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}