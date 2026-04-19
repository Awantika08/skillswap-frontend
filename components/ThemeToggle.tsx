"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full hover:bg-secondary transition-colors h-10 w-10 flex border border-border"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 dark:-translate-y-full dark:opacity-0 transition-all duration-300" />
      <Moon className="absolute h-5 w-5 translate-y-full opacity-0 dark:translate-y-0 dark:opacity-100 transition-all duration-300" />
    </Button>
  );
}
