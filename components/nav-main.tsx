// components/nav-main.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function NavMain({
  items,
  label = "Main Menu",
}: {
  items: NavItem[];
  label?: string;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="px-3">
      <SidebarGroupLabel className="px-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-2">
        {items.map((item) => {
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.title}
                size="lg"
                className={cn(
                  "relative group transition-all duration-300 rounded-xl px-4",
                  isActive 
                    ? "bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Link href={item.url} className="flex items-center gap-4">
                  {item.icon && (
                    <item.icon 
                      className={cn(
                        "size-5.5 transition-transform group-hover:scale-110",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} 
                    />
                  )}
                  <span className="text-base tracking-tight">{item.title}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full animate-in fade-in slide-in-from-left-2 duration-300" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
