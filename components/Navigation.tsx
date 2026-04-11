"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  User as UserIcon,
  LayoutDashboard,
  Star,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUnreadCount } from "@/features/chat/hooks";
import { NotificationPopover } from "@/components/notifications/notification-popover";
import { getFullImageUrl } from "@/lib/utils";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();
  const isNonAdmin = !!user && user?.role?.toLowerCase() !== "admin";
  const { data: unreadData } = useUnreadCount();
  const unreadCount = isNonAdmin ? (unreadData?.data?.unreadCount ?? 0) : 0;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
    closeMenu();
  };

  const getDashboardHref = () => {
    const role = user?.role?.toLowerCase();
    if (role === "admin") return "/admin/dashboard";
    if (role === "mentor") return "/mentor/dashboard";
    return "/learner/dashboard";
  };

  const getProfileHref = () => {
    const role = user?.role?.toLowerCase();
    if (role === "admin") return "/admin/profile";
    if (role === "mentor") return "/mentor/profile";
    return "/learner/profile";
  };

  const getMySessionsHref = () => {
    const role = user?.role?.toLowerCase();
    if (role === "learner") return "/learner/sessions";
    if (role === "mentor") return "/mentor/sessions";
    return "/admin/sessions";
  };

  const getReviewsHref = () => {
    const role = user?.role?.toLowerCase();
    if (role === "mentor") return "/mentor/reviews";
    return "/learner/reviews";
  };


  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : "U";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/skills", label: "Browse Skills" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                S
              </span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              Skill Swap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {/* Chat Icon — desktop, non-admin only */}
            {isNonAdmin && (
              <div className="flex items-center gap-2">
                <Link
                  href="/chat"
                  id="nav-chat-link-desktop"
                  className="relative p-2 rounded-full hover:bg-secondary transition-colors text-foreground hover:text-primary"
                  aria-label="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
                <NotificationPopover />
              </div>
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-border hover:bg-secondary transition-colors"
                  >
                    <Avatar className="h-full w-full">
                      <AvatarImage
                        src={getFullImageUrl(user.image)}
                        alt={user.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={getDashboardHref()}
                      className="cursor-pointer w-full flex items-center"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={getProfileHref()}
                      className="cursor-pointer w-full flex items-center"
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role?.toLowerCase() !== "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={getMySessionsHref()}
                        className="cursor-pointer w-full flex items-center"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        <span>My Sessions</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {user?.role?.toLowerCase() !== "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={getReviewsHref()}
                        className="cursor-pointer w-full flex items-center"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        <span>My Reviews</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user?.role?.toLowerCase() !== "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/chat"
                        className="cursor-pointer w-full flex items-center"
                        id="nav-chat-link-dropdown"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Messages</span>
                        {unreadCount > 0 && (
                          <span className="ml-auto min-w-[20px] h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage
                        src={getFullImageUrl(user.image)}
                        alt={user.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-medium text-foreground">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <NotificationPopover />
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link
                    href={getDashboardHref()}
                    onClick={closeMenu}
                    className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors px-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href={getProfileHref()}
                    onClick={closeMenu}
                    className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors px-2"
                  >
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Link>
                  {user?.role?.toLowerCase() !== "admin" && (
                    <Link
                      href={getReviewsHref()}
                      onClick={closeMenu}
                      className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors px-2"
                    >
                      <Star className="h-4 w-4" />
                      My Reviews
                    </Link>
                  )}
                  {user?.role?.toLowerCase() !== "admin" && (
                    <Link
                      href="/chat"
                      onClick={closeMenu}
                      id="nav-chat-link-mobile"
                      className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors px-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Messages
                      {unreadCount > 0 && (
                        <span className="ml-auto min-w-[20px] h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-destructive hover:bg-destructive/10 transition-colors px-2 py-2 rounded-lg text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={closeMenu}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
