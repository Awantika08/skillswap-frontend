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
import { useAuthStore } from "@/store/authStore"; // Import your auth store

const data = {
  admin: {
    name: "shadcn",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
      title: "Projects",
      url: "/admin/projects", // Updated URL
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "/admin/team", // Updated URL
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "/admin/capture", // Updated URL
      items: [
        {
          title: "Active Proposals",
          url: "/admin/capture/active",
        },
        {
          title: "Archived",
          url: "/admin/capture/archived",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "/admin/proposal", // Updated URL
      items: [
        {
          title: "Active Proposals",
          url: "/admin/proposal/active",
        },
        {
          title: "Archived",
          url: "/admin/proposal/archived",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "/admin/prompts", // Updated URL
      items: [
        {
          title: "Active Proposals",
          url: "/admin/prompts/active",
        },
        {
          title: "Archived",
          url: "/admin/prompts/archived",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings", // Updated URL
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/admin/help", // Updated URL
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/admin/search", // Updated URL
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "/admin/data-library", // Updated URL
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "/admin/reports", // Updated URL
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "/admin/word-assistant", // Updated URL
      icon: IconFileWord,
    },
  ],
};

export function AdminAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user } = useAuthStore(); // Get actual user from auth store

  // Use actual user data from auth store
  const userData = {
    name: user?.name || "Admin User",
    email: user?.email || "admin@example.com",
    avatar: user?.avatar || "/avatars/default.jpg",
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
              <a href="/admin/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Admin Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavAdmin admin={data.admin} />
      </SidebarFooter>
    </Sidebar>
  );
}
