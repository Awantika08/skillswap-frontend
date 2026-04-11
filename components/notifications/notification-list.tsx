"use client";

import { useState } from "react";
import { useNotifications, useMarkAllNotificationsRead } from "@/hooks/use-notifications";
import { NotificationItem } from "./notification-item";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationList() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { 
    data: notificationsData, 
    isLoading, 
    isFetching,
    refetch 
  } = useNotifications(page, limit, activeTab === "unread");

  const { mutate: markAllRead, isPending: isMarkingAllRead } = useMarkAllNotificationsRead();

  const notifications = notificationsData?.data?.notifications || [];
  const pagination = notificationsData?.data?.pagination;
  const unreadCount = notificationsData?.data?.unreadCount;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and view your recent notifications.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAllRead()}
          disabled={isMarkingAllRead || (!isLoading && notifications.length === 0)}
        >
          {isMarkingAllRead ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          Mark all as read
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
        <div className="border-b">
          <TabsList className="h-12 w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="relative h-12 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-sm font-semibold text-muted-foreground transition-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              All Notifications
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="relative h-12 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-sm font-semibold text-muted-foreground transition-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Unread
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-4 rounded-xl border bg-card shadow-sm overflow-hidden">
          <TabsContent value="all" className="m-0 border-none outline-none">
            {isLoading ? (
              <div className="divide-y">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.NotificationID}
                    notification={notification}
                  />
                ))}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-center p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground text-center min-w-[100px]">
                        Page {page} of {pagination.pages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                        disabled={page === pagination.pages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Bell className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No notifications</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                  You're all caught up! When you receive a notification, it will appear here.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="unread" className="m-0 border-none outline-none">
            {isLoading || isFetching ? (
              <div className="divide-y">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.NotificationID}
                    notification={notification}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Check className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">All caught up!</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                  You have no unread notifications at the moment.
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
