"use client";

import React from "react";
import { Clock, Video, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionItemProps {
  title: string;
  mentor: string;
  time: string;
  type: string;
  icon: React.ReactNode;
  iconBg: string;
  isJoinable?: boolean;
}

export const SessionItem = ({
  title,
  mentor,
  time,
  type,
  icon,
  iconBg,
  isJoinable = false,
}: SessionItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border transition-all bg-card/50">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${iconBg} bg-opacity-20 flex items-center justify-center`}>
          {icon}
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-foreground tracking-tight">
            {title}
          </h4>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            with <span className="font-medium text-foreground/80">{mentor}</span>
          </p>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {time}
            </span>
            <span className="flex items-center gap-1">
              <Video className="w-3 h-3" />
              {type}
            </span>
          </div>
        </div>
      </div>
      <div>
        {isJoinable ? (
          <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-5 h-8 text-xs font-semibold shadow-sm">
            Join
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="rounded-full px-5 h-8 text-xs font-semibold border-primary/20 hover:bg-primary/5 transition-all text-primary hover:border-primary/50">
            Details
          </Button>
        )}
      </div>
    </div>
  );
};
