import React from "react";
import { Users } from "lucide-react";

interface MeetingHeaderProps {
  title: string;
  duration: string;
  participantCount: number;
  status?: string;
}

export function MeetingHeader({ title, duration, participantCount }: MeetingHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-40 bg-linear-to-b from-black/60 to-transparent pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <h1 className="text-sm font-bold tracking-tight text-white/90 drop-shadow-md">{title}</h1>
          <span className="text-white/20 px-1">|</span>
          <span className="text-[11px] font-bold text-white/60 tracking-widest uppercase">{duration}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/30 backdrop-blur-xl border border-white/5 text-[11px] font-bold text-white/80 shadow-2xl transition-all hover:bg-zinc-950/50">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span>{participantCount}</span>
        </div>
      </div>
    </header>
  );
}