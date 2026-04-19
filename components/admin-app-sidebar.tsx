"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconNotification,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavAdmin } from "@/components/nav-admin";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import { useGetProfile } from "@/features/profile/hooks/useGetProfile";
import { useProfileStore } from "@/store/profileStore";
import { getFullImageUrl } from "@/lib/utils";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "Skill Category",
      url: "/admin/skill-category",
      icon: IconListDetails,
    },
    {
      title: "Activity Logs",
      url: "/admin/activity-logs",
      icon: IconDatabase,
    },
    {
      title: "Notifications",
      url: "/admin/notifications",
      icon: IconNotification,
    },
  ],
};

export function AdminAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user } = useAuthStore(); // Get actual user from auth store
  useGetProfile(); // Fetch full profile data
  const { profile } = useProfileStore();

  // Use actual user data from profile store, fallback to auth store
  const userData = {
    name: profile?.FullName || user?.name || "Admin User",
    email: profile?.Email || user?.email || "admin@example.com",
    avatar: getFullImageUrl(profile?.ProfileImageURL || user?.image),
  };

  const mainNav = data.navMain.slice(0, 3);
  const socialNav = data.navMain.slice(3);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="h-20 flex items-center justify-center border-b border-border/40 px-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:!p-0 hover:bg-transparent"
            >
              <a href="/admin/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <IconInnerShadowTop className="size-6" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-lg font-black tracking-tighter">SKILLSWAP</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                    Admin
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="py-6">
        <NavMain items={mainNav} label="Administration" />
        <div className="mt-4">
          <NavMain items={socialNav} label="System" />
        </div>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/40">
        <NavAdmin admin={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
