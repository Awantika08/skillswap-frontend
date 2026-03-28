"use client";

import {
  Mic,
  MicOff,
  MonitorUp,
  MonitorOff,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoControls({
  isAudioMuted,
  isVideoMuted,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onLeave,
}: {
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex gap-3 items-center">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="rounded-full size-11 bg-white/10 hover:bg-white/15 text-white border border-white/10"
          onClick={onToggleAudio}
          aria-label={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="rounded-full size-11 bg-white/10 hover:bg-white/15 text-white border border-white/10"
          onClick={onToggleVideo}
          aria-label={isVideoMuted ? "Turn camera on" : "Turn camera off"}
        >
          {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="icon"
          className={`rounded-full size-11 border transition-colors ${
            isScreenSharing
              ? "bg-teal-500/80 hover:bg-teal-500/90 text-white border-teal-400/60 shadow-[0_0_12px_rgba(20,184,166,0.35)]"
              : "bg-white/10 hover:bg-white/15 text-white border-white/10"
          }`}
          onClick={onToggleScreenShare}
          aria-label={isScreenSharing ? "Stop presenting" : "Present now"}
          title={isScreenSharing ? "Stop presenting" : "Present now"}
        >
          {isScreenSharing ? (
            <MonitorOff className="w-5 h-5" />
          ) : (
            <MonitorUp className="w-5 h-5" />
          )}
        </Button>

        <div className="h-6 w-px bg-white/10" />

        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="rounded-full size-11"
          onClick={onLeave}
          aria-label="Leave call"
          title="Leave"
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

