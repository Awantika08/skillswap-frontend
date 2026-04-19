"use client";

import { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex font-sans bg-background selection:bg-primary/20">
      {/* Top Action Bar (Absolute) */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Left side illustration - Premium Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 border-r border-border/10">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px] animate-pulse duration-[10s]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[100px] animate-pulse duration-[8s] delay-1000" />
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[80px]" />
        </div>

        {/* Branding Content */}
        <div className="relative z-10 flex flex-col justify-between w-full px-16 py-16">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <span className="text-primary-foreground font-black text-xl">S</span>
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">Skill Swap</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center gap-8">
            <div className="space-y-6">
              <h2 className="text-5xl xl:text-6xl text-white leading-[1.1] font-black tracking-tighter max-w-lg">
                Master Any Skill, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-indigo-400">
                  Connect 1-on-1.
                </span>
              </h2>
              <p className="text-white/60 text-xl leading-relaxed max-w-md font-medium">
                The most immersive peer-to-peer learning community. Share what you know, learn what you love.
              </p>
            </div>SkillSwap
          </div>

          <div className="flex justify-between items-center text-white/30 text-xs font-medium tracking-widest uppercase">
            <span>© 2025 SKILL SWAP</span>
            <div className="flex gap-6">
              <span className="cursor-pointer hover:text-white/60 transition-colors">Privacy</span>
              <span className="cursor-pointer hover:text-white/60 transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-16 bg-background relative overflow-hidden">
        {/* Subtle background glow for dark mode */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-1000" />

        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {children}
        </div>
      </div>
    </div>
  );
}
