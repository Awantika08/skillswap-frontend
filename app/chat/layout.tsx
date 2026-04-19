import React from "react";
import { AppShell } from "@/components/layouts/AppShell";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <div className="flex-1 flex overflow-hidden relative min-h-[calc(100vh-var(--header-height)-4rem)]">
        {children}
      </div>
    </AppShell>
  );
}
