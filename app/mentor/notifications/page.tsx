import { NotificationList } from "@/components/notifications/notification-list";

export const metadata = {
  title: "Notifications | Mentor Dashboard",
  description: "View and manage your mentor notifications.",
};

export default function MentorNotificationsPage() {
  return (
    <div className="container mx-auto py-2">
      <NotificationList />
    </div>
  );
}
