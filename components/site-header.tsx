"use client";

import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationPopover } from "@/components/notifications/notification-popover"
import { ThemeToggle } from "@/components/ThemeToggle"
import React from "react"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-background/95 backdrop-blur-md sticky top-0 z-40">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <NotificationPopover />
        </div>
      </div>
    </header>
  )
}

