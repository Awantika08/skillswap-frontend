"use client";

import { useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useNotifications,
  useUnreadCount,
  useMarkAllNotificationsRead,
} from "@/hooks/use-notifications";
import { NotificationItem } from "./notification-item";
import { cn } from "@/lib/utils";

export function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { data: unreadCountData } = useUnreadCount();
  const unreadCount = unreadCountData?.data?.unreadCount || 0;

  const {
    data: notificationsData,
    isLoading,
    isFetching,
  } = useNotifications(1, 20, activeTab === "unread");

  const { mutate: markAllRead, isPending: isMarkingAllRead } =
    useMarkAllNotificationsRead();

  const notifications = notificationsData?.data?.notifications || [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px]  text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 sm:w-96" align="end">
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => markAllRead()}
              disabled={unreadCount === 0 || isMarkingAllRead}
            >
              {isMarkingAllRead ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <Check className="mr-2 h-3 w-3" />
              )}
              Mark all as read
            </Button>
          </div>

          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="border-b px-4">
              <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-xs font-semibold text-muted-foreground transition-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-xs font-semibold text-muted-foreground transition-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0 border-none outline-none">
              <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
                {isLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.NotificationID}
                        notification={notification}
                        onClose={() => setOpen(false)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-32 flex-col items-center justify-center space-y-2 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <Bell className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      No notifications yet
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="unread"
              className="m-0 border-none outline-none"
            >
              <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
                {isLoading || isFetching ? (
                  <div className="flex h-32 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.NotificationID}
                        notification={notification}
                        onClose={() => setOpen(false)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-32 flex-col items-center justify-center space-y-2 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <Check className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All caught up!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="border-t p-2 text-center">
            <Button
              variant="link"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                const role = user?.role?.toLowerCase();
                if (role === "mentor") {
                  router.push("/mentor/notifications");
                } else if (role === "learner") {
                  router.push("/learner/notifications");
                } else if (role === "admin") {
                  router.push("/admin/notifications");
                }
                setOpen(false);
              }}
            >
              See all notifications
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
