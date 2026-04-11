"use client";
import React, { useEffect, useRef } from "react";
import { User, MicOff, ScreenShare } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocalVideoProps {
  stream: MediaStream | null;
  userName: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing?: boolean;
  isPinned?: boolean;
  onPin?: () => void;
}

export function LocalVideo({ stream, userName, isMuted, isVideoOff, isScreenSharing, isPinned, onPin }: LocalVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (stream) {
      // Always reassign – a new MediaStream object is created on each toggle/share
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {/* autoplay policy – silently ignore */});
    } else {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const showVideo = (isScreenSharing || !isVideoOff) && !!stream;

  return (
    <div className="relative w-full h-full rounded-2xl bg-zinc-900 overflow-hidden border border-white/10 transition-all duration-500 shadow-2xl group ring-1 ring-white/5">
      {/* Placeholder when camera is off */}
      {!showVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 transition-colors duration-500 font-sans z-10">
          <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 shadow-inner transition-all group-hover:scale-110 duration-500">
            <User className="w-12 h-12 text-zinc-500" />
          </div>
          <div className="mt-6 flex flex-col items-center gap-1 opacity-70">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
              Camera is off
            </span>
          </div>
        </div>
      )}

      {/* Video element – always in DOM so srcObject assignment works */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`w-full h-full transition-all duration-300 ${
          isScreenSharing ? "object-contain bg-black" : "object-cover scale-x-[-1]"
        } ${showVideo ? "opacity-100" : "opacity-0"}`}
      />

      {/* Overlay: screen-share badge */}
      {isScreenSharing && (
        <div className="absolute top-4 left-4 z-20 animate-in fade-in duration-500">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-[11px] font-bold shadow-lg">
            <ScreenShare className="w-3.5 h-3.5" />
            <span>You are presenting</span>
          </div>
        </div>
      )}

      {/* Pin button */}
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={onPin}
          className={cn(
            "p-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all duration-200",
            isPinned 
              ? "bg-emerald-500 text-white border-emerald-400 font-bold" 
              : "bg-zinc-950/40 text-white hover:bg-zinc-950/60"
          )}
        >
          {isPinned ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M16 9V4l1 0V2H7v2l1 0v5L6 11v2h5v7l1 1 1-1v-7h5v-2l-2-2z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path d="M16 9V4H8v5l-2 2v2h5v7l1 1 1-1v-7h5v-2l-2-2z" /></svg>
          )}
        </button>
      </div>

      {/* Overlay: name + mute */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10 transition-transform duration-500 group-hover:translate-x-1">
        <div className="px-3 py-1.5 rounded-xl bg-zinc-950/50 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 flex items-center gap-2 shadow-lg">
          {isMuted && (
            <MicOff className="w-3.5 h-3.5 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
          )}
          <span className="drop-shadow-md">You</span>
        </div>
      </div>

      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none duration-500" />
    </div>
  );
}
