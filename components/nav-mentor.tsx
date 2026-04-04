"use client";

import { useRouter } from "next/navigation";
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { useQueryClient } from "@tanstack/react-query";

export function NavMentor({
  mentor,
}: {
  mentor: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const queryClient = useQueryClient();

  const handleLogout = () => {
    clearAuth();
    clearProfile();
    queryClient.clear();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/mentor/profile");
  };

  const handleBilling = () => {
    router.push("/mentor/billing");
  };

  const handleNotifications = () => {
    router.push("/mentor/notifications");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={mentor.avatar} alt={mentor.name} />
                <AvatarFallback className="rounded-lg">
                  {mentor.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{mentor.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {mentor.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={mentor.avatar} alt={mentor.name} />
                  <AvatarFallback className="rounded-lg">
                    {mentor.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{mentor.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {mentor.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleProfile}>
                <IconUserCircle />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBilling}>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNotifications}>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
            >
              <IconLogout className="text-red-600" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
