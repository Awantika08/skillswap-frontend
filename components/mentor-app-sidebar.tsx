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
  IconMessage,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconStar,
  IconBell,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavMentor } from "@/components/nav-mentor";
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
      url: "/mentor/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Sessions",
      url: "/mentor/sessions",
      icon: IconListDetails,
    },
    {
      title: "Messages",
      url: "/mentor/chat",
      icon: IconMessage,
    },
    {
      title: "Reviews",
      url: "/mentor/reviews",
      icon: IconStar,
    },
    {
      title: "Notifications",
      url: "/mentor/notifications",
      icon: IconBell,
    },
  ],
};

export function MentorAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  useGetProfile();
  const { profile } = useProfileStore();

  const userData = {
    name: profile?.FullName || user?.name || "Mentor User",
    email: profile?.Email || user?.email || "mentor@example.com",
    avatar: getFullImageUrl(profile?.ProfileImageURL || user?.image),
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/mentor/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">
                  Mentor Dashboard
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavMentor mentor={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
