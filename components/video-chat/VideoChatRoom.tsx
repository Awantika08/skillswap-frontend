"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatPanel } from "./ChatPanel";
import { VideoControls } from "./VideoControls";
import { VideoStage } from "./VideoStage";
import { useRoomChat } from "./hooks/useRoomChat";
import { useRoomWebRTC } from "./hooks/useRoomWebRTC";

export function VideoChatRoom({
  roomId,
  displayName,
}: {
  roomId: string;
  displayName: string;
}) {
  const router = useRouter();
  const {
    peerId,
    localStream,
    remoteStream,
    remoteName,
    isAudioMuted,
    isVideoMuted,
    isScreenSharing,
    screenStream,
    connectionState,
    errorMessage,
    toggleAudioMute,
    toggleVideoMute,
    toggleScreenShare,
    leaveCall,
  } = useRoomWebRTC({ roomId, displayName });

  const { messages, sendMessage } = useRoomChat({
    roomId,
    senderPeerId: peerId,
    senderName: displayName,
  });

  const showStage = useMemo(() => connectionState !== "error", [connectionState]);

  const [videoFullscreenTarget, setVideoFullscreenTarget] = useState<
    null | "local" | "remote"
  >(null);

  const requestFullscreen = (target: "local" | "remote") => {
    setVideoFullscreenTarget((prev) => (prev === target ? null : target));
  };

  const handleLeave = () => {
    leaveCall();
    router.push("/video-chat");
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-background">
      <div className="h-full flex flex-col md:flex-row gap-3 p-2 md:p-4">
        <div className="flex-1 min-h-[280px] relative bg-black/5 rounded-2xl border border-border/60 overflow-hidden">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-black/50 text-white/90 border border-white/10">
              Room: {roomId}
            </span>
            <span className="px-2 py-1 rounded-full bg-black/50 text-white/90 border border-white/10">
              {connectionState === "idle" ? "Idle" : null}
              {connectionState === "connecting" ? "Connecting..." : null}
              {connectionState === "connected" ? "Connected" : null}
            </span>
          </div>

          {errorMessage ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="max-w-md w-full rounded-2xl border border-border/70 bg-card/80 backdrop-blur p-5">
                <div className="font-semibold text-foreground mb-2">Camera/Mic blocked</div>
                <div className="text-sm text-muted-foreground">{errorMessage}</div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Please allow camera and microphone permissions, then refresh.
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors"
                    onClick={handleLeave}
                  >
                    Leave
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="h-full">
            {showStage ? (
              <VideoStage
                localStream={localStream}
                remoteStream={remoteStream}
                localName={displayName}
                remoteName={remoteName}
                isAudioMuted={isAudioMuted}
                isVideoMuted={isVideoMuted}
                screenStream={screenStream}
                isScreenSharing={isScreenSharing}
                onRequestFullscreen={requestFullscreen}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Unable to start video call.
              </div>
            )}
          </div>

          <div
            className={`${
              videoFullscreenTarget ? "fixed" : "absolute"
            } bottom-4 left-0 right-0 flex justify-center z-60`}
          >
            <VideoControls
              isAudioMuted={isAudioMuted}
              isVideoMuted={isVideoMuted}
              isScreenSharing={isScreenSharing}
              onToggleAudio={toggleAudioMute}
              onToggleVideo={toggleVideoMute}
              onToggleScreenShare={toggleScreenShare}
              onLeave={handleLeave}
            />
          </div>
        </div>

        <div className="w-full md:w-[380px] h-[35vh] md:h-full shrink-0">
          <ChatPanel
            messages={messages}
            onSendMessage={sendMessage}
            myPeerId={peerId}
          />
        </div>
      </div>

      {videoFullscreenTarget ? (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-2 md:p-4"
          onClick={() => setVideoFullscreenTarget(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full h-full max-w-6xl relative">
            <div className="absolute top-3 right-3 z-60">
              <button
                className="px-4 py-2 rounded-lg bg-black/60 hover:bg-black/80 border border-white/10 text-white"
                onClick={() => setVideoFullscreenTarget(null)}
              >
                Close
              </button>
            </div>

            <VideoStage
              localStream={videoFullscreenTarget === "local" ? localStream : null}
              remoteStream={
                videoFullscreenTarget === "remote" ? remoteStream : null
              }
              localName={displayName}
              remoteName={remoteName}
              isAudioMuted={isAudioMuted}
              isVideoMuted={isVideoMuted}
              screenStream={screenStream}
              isScreenSharing={isScreenSharing}
              onRequestFullscreen={requestFullscreen}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

