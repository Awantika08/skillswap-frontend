"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  return (
    <div className="flex items-center gap-4 py-4">
      <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="bg-transparent gap-2 p-0">
          <TabsTrigger
            value="overview"
            className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium text-sm border-none shadow-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="sessions"
            className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium text-sm border-none shadow-none"
          >
            My Sessions
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium text-sm border-none shadow-none"
          >
            My Skills
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
