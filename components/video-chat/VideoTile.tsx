"use client";

import { useEffect, useRef } from "react";
import { MicOff, Mic, VideoOff, Video } from "lucide-react";
import { cn } from "@/lib/utils";

export function VideoTile({
  stream,
  name,
  muted = false,
  isAudioMuted,
  isVideoMuted,
  objectFit = "cover",
  compact = false,
  onClick,
}: {
  stream: MediaStream | null;
  name: string;
  muted?: boolean;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  objectFit?: "cover" | "contain";
  compact?: boolean;
  onClick?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (!stream) {
      el.srcObject = null;
      return;
    }

    el.srcObject = stream;
    el.muted = muted;
    el.playsInline = true;
    void el.play().catch(() => {
      // Autoplay can fail depending on browser policies.
    });
  }, [stream, muted]);

  return (
    <div
      className={cn(
        "relative w-full h-full bg-black rounded-2xl overflow-hidden border border-border/60",
        onClick ? "cursor-pointer hover:shadow-[0_0_0_3px_rgba(255,255,255,0.06)]" : null,
      )}
      onClick={(e) => {
        if (!onClick) return;
        e.stopPropagation();
        onClick();
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      aria-label={onClick ? `Fullscreen video: ${name}` : undefined}
    >
      {stream ? (
        <video
          ref={videoRef}
          className={cn(
            "w-full h-full",
            objectFit === "contain" ? "object-contain" : "object-cover",
            isVideoMuted && "opacity-60",
          )}
          playsInline
          autoPlay
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-muted/40 to-background text-muted-foreground">
          {compact ? "" : "Waiting for participant..."}
        </div>
      )}

      {!compact && (
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
          {name}
        </div>
      )}

      {!compact && (
        <div className="absolute bottom-3 left-3 flex gap-2 items-center">
          <div
            className={cn(
              "inline-flex items-center justify-center size-8 rounded-full bg-black/50 text-white",
            )}
            aria-label={isAudioMuted ? "Audio muted" : "Audio live"}
            title={isAudioMuted ? "Audio muted" : "Audio live"}
          >
            {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </div>
          <div
            className="inline-flex items-center justify-center size-8 rounded-full bg-black/50 text-white"
            aria-label={isVideoMuted ? "Video off" : "Video live"}
            title={isVideoMuted ? "Video off" : "Video live"}
          >
            {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </div>
        </div>
      )}
    </div>
  );
}

