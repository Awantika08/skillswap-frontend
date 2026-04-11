"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, Calendar, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useUnreadCount } from "@/features/chat/hooks";

export const QuickActions = () => {
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.data?.unreadCount ?? 0;

  return (
    <div className="bg-card border-none shadow-sm rounded-3xl p-8 space-y-6">
      <h3 className="text-xl font-bold text-foreground tracking-tight">
        Quick Actions
      </h3>
      <div className="flex flex-col gap-4">
        <Link href="/skills" className="w-full">
          <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-6 flex items-center justify-center gap-2 font-semibold shadow-md shadow-rose-200/50">
            <Search className="w-5 h-5" />
            Find a Mentor
          </Button>
        </Link>

        <Link href="/chat" className="w-full">
          <Button
            variant="outline"
            className="w-full border-2 border-gray-100 dark:border-gray-800 rounded-xl py-6 flex items-center justify-center gap-2 font-semibold relative"
          >
            <MessageSquare className="w-5 h-5" />
            Messages
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                {unreadCount}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
};
