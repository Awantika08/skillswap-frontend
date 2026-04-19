"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { LearnerAppSidebar } from "@/components/learner-app-sidebar";
import { MentorAppSidebar } from "@/components/mentor-app-sidebar";
import { AdminAppSidebar } from "@/components/admin-app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase();
  const pathname = usePathname();

  // Always use the public website layout for the home page or if no user is logged in
  if (!user || pathname === "/") {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="grow">{children}</main>
        <Footer />
      </div>
    );
  }

  // Choose the correct sidebar based on role
  const Sidebar = 
    role === "admin" ? AdminAppSidebar :
    role === "mentor" ? MentorAppSidebar :
    LearnerAppSidebar;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Sidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 md:px-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
