"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, Calendar } from "lucide-react";
import Link from "next/link";

export const QuickActions = () => {
  return (
    <div className="bg-card border-none shadow-sm rounded-3xl p-8 space-y-6">
      <h3 className="text-xl font-bold text-foreground tracking-tight">
        Quick Actions
      </h3>
      <div className="flex flex-col gap-4">
        <Link href="/skills" className="w-full">
          <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-6 flex items-center justify-center gap-2 font-semibold shadow-md shadow-rose-200/50">
            <Search className="w-5 h-5" />
            Find a Mentor
          </Button>
        </Link>
        <Link href="/mentor/dashboard" className="w-full">
          <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-xl py-6 flex items-center justify-center gap-2 font-semibold shadow-md shadow-slate-200/50">
            <UserCheck className="w-5 h-5" />
            Mentor Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
