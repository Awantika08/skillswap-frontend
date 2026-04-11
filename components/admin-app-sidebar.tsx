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
      url: "/admin/dashboard", // Updated URL
      icon: IconDashboard,
    },
    {
      title: "Skill Category",
      url: "/admin/skill-category", // This one is already correct
      icon: IconListDetails,
    },
    {
      title: "Users",
      url: "/admin/users", // Updated URL
      icon: IconChartBar,
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

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/admin/dashboard">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Admin Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavAdmin admin={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
