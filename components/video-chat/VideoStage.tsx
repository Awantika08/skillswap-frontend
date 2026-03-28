"use client";

import { VideoTile } from "./VideoTile";

export function VideoStage({
  localStream,
  remoteStream,
  localName,
  remoteName,
  isAudioMuted,
  isVideoMuted,
  screenStream,
  isScreenSharing,
  onRequestFullscreen,
}: {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  localName: string;
  remoteName: string;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  screenStream: MediaStream | null;
  isScreenSharing: boolean;
  onRequestFullscreen: (target: "local" | "remote") => void;
}) {
  const hasRemote = !!remoteStream;
  const activeStream = hasRemote ? remoteStream : localStream;
  const activeName = hasRemote ? remoteName : localName;
  const activeMuted = !hasRemote; // local tile muted (prevent echo) when showing local

  // ── Presentation mode (screen sharing active) ──
  if (isScreenSharing && screenStream) {
    return (
      <div className="w-full h-full p-0 relative">
        {/* Main: shared screen */}
        <VideoTile
          stream={screenStream}
          name="Screen"
          muted
          isAudioMuted={false}
          isVideoMuted={false}
          objectFit="contain"
        />

        {/* "You are presenting" badge */}
        <div className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-teal-500/80 text-white text-xs font-medium border border-teal-400/50 shadow-lg backdrop-blur-sm flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-white animate-pulse" />
          You are presenting
        </div>

        {/* PiP: camera feed */}
        <div className="absolute bottom-3 right-3 z-20 w-[180px] md:w-[220px] aspect-video rounded-xl shadow-2xl border-2 border-white/15 overflow-hidden">
          <VideoTile
            stream={activeStream}
            name={activeName}
            muted={activeMuted}
            isAudioMuted={hasRemote ? false : isAudioMuted}
            isVideoMuted={hasRemote ? false : isVideoMuted}
            compact
          />
        </div>
      </div>
    );
  }

  // ── Normal mode ──
  return (
    <div className="w-full h-full p-0 relative">
      <VideoTile
        stream={activeStream}
        name={activeName}
        muted={activeMuted}
        isAudioMuted={hasRemote ? false : isAudioMuted}
        isVideoMuted={hasRemote ? false : isVideoMuted}
        onClick={() => onRequestFullscreen(hasRemote ? "remote" : "local")}
      />
    </div>
  );
}

