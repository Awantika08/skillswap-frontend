"use client";

import React from "react";
import { SessionItem } from "./SessionItem";
import { Button } from "@/components/ui/button";
import { Code, Languages, Video } from "lucide-react";

export const SessionsSection = () => {
  const sessions = [
    {
      title: "React Hooks Deep Dive",
      mentor: "Sarah Chen",
      time: "2:00 PM - 3:00 PM",
      type: "Video Call",
      icon: <Code className="w-5 h-5 text-rose-500" />,
      iconBg: "bg-rose-500",
      isJoinable: true,
    },
    {
      title: "Spanish Conversation Practice",
      mentor: "Maria Garcia",
      time: "4:30 PM - 5:30 PM",
      type: "Video Call",
      icon: <Languages className="w-5 h-5 text-emerald-500" />,
      iconBg: "bg-emerald-500",
      isJoinable: false,
    },
  ];

  return (
    <div className="bg-card border-none shadow-sm rounded-3xl p-8 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Today's Sessions</h2>
        <Button variant="link" className="text-rose-500 hover:text-rose-600 text-sm font-semibold p-0 h-auto">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {sessions.map((session, index) => (
          <SessionItem key={index} {...session} />
        ))}
      </div>
    </div>
  );
};
