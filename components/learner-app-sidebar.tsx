"use client";

import * as React from "react";
import {
  IconDashboard,
  IconListDetails,
  IconMessage,
  IconStar,
  IconBell,
  IconInnerShadowTop,
  IconSearch,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavLearner } from "@/components/nav-learner";
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
      url: "/learner/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Find Mentors",
      url: "/skills",
      icon: IconSearch,
    },
    {
      title: "My Sessions",
      url: "/learner/sessions",
      icon: IconListDetails,
    },
    {
      title: "Messages",
      url: "/chat",
      icon: IconMessage,
    },
    {
      title: "My Reviews",
      url: "/learner/reviews",
      icon: IconStar,
    },
    {
      title: "Notifications",
      url: "/learner/notifications",
      icon: IconBell,
    },
  ],
};

export function LearnerAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  useGetProfile();
  const { profile } = useProfileStore();

  const userData = {
    name: profile?.FullName || user?.name || "Learner User",
    email: profile?.Email || user?.email || "learner@example.com",
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
              <a href="/learner/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <IconInnerShadowTop className="size-6" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-lg font-black tracking-tighter">SKILLSWAP</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                    Learner
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="py-6">
        <NavMain items={mainNav} label="Navigation" />
        <div className="mt-4">
          <NavMain items={socialNav} label="Connection" />
        </div>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/40">
        <NavLearner learner={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
