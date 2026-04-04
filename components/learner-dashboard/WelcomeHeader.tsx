"use client";

import React from "react";

interface WelcomeHeaderProps {
  name: string;
}

export const WelcomeHeader = ({ name }: WelcomeHeaderProps) => {
  return (
    <div className="space-y-2 py-4">
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
        Welcome back, {name}! <span className="animate-bounce">👋</span>
      </h1>
      <p className="text-muted-foreground text-lg">
        Ready to continue your learning journey?
      </p>
    </div>
  );
};
