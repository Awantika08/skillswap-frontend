import React, { useState, useEffect, useRef } from "react";
import { MeetingHeader } from "./MeetingHeader";
import { CallControls } from "./CallControls";
import { LocalVideo } from "./LocalVideo";
import { RemoteVideo } from "./RemoteVideo";
import { useWebRTC } from "../hooks/useWebRTC";
import { SessionMeetingInfo } from "@/zod/video-session.schema";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, MessageSquare, Users as UsersIcon, Info, Copy, Check, Play, Loader2, LayoutGrid } from "lucide-react";

interface VideoRoomProps {
  sessionInfo: SessionMeetingInfo;
  currentUser: { id: string; fullName: string };
  duration: string;
  onEndSession: () => void;
  isEnding: boolean;
  onStartSession?: () => void;
  isStarting?: boolean;
}

type SidebarType = "chat" | "people" | "info" | null;

export function VideoRoom({ sessionInfo, currentUser, duration, onEndSession, isEnding, onStartSession, isStarting }: VideoRoomProps) {
  const router = useRouter();
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const isMentor = sessionInfo.mentorId === currentUser.id;
  const isScheduled = sessionInfo.Status === "SCHEDULED";

  const {
    localStream,
    participants,
    isMuted,
    isVideoOff,
    isScreenSharing,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    sendChatMessage,
    messages,
    hasNewMessage,
    setHasNewMessage,
    audioDevices,
    videoDevices,
    selectedAudioId,
    selectedVideoId,
    switchAudioDevice,
    switchVideoDevice,
    leaveRoom,
  } = useWebRTC({
    roomId: sessionInfo.MeetingRoomId,
    userId: currentUser.id,
    userName: currentUser.fullName,
  });


  // Clear notification when chat opens
  useEffect(() => {
    if (activeSidebar === "chat" && hasNewMessage) {
      setHasNewMessage(false);
    }
  }, [activeSidebar, hasNewMessage, setHasNewMessage]);

  // Auto-scroll chat
  useEffect(() => {
    if (activeSidebar === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeSidebar]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageInput.trim()) return;
    sendChatMessage(messageInput);
    setMessageInput("");
  };

  const togglePin = (id: string) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleLeave = () => {
    const isMentor = sessionInfo.mentorId === currentUser.id;
    if (isMentor) {
      const confirmEnd = window.confirm("Do you want to end this session for everyone? This will mark it as complete.");
      if (confirmEnd) {
        onEndSession();
        return;
      }
    }
    leaveRoom();
    toast.info("You left the call");
    const role = isMentor ? "mentor" : "learner";
    router.push(`/${role}/sessions?tab=COMPLETED&review=${sessionInfo.SessionID}`);
  };

  const participantCount = participants.length + 1;

  // Compute lists
  const allParticipants = [
    { socketId: "local", userName: "You", stream: localStream, isMuted, isOff: isVideoOff, isSharing: isScreenSharing, isLocal: true },
    ...participants
  ];

  const pinnedParticipants = allParticipants.filter(p => pinnedIds.includes(p.socketId));
  const galleryParticipants = allParticipants.filter(p => !pinnedIds.includes(p.socketId));

  const hasPins = pinnedParticipants.length > 0;

  const handleCopyLink = () => {
    const link = `${window.location.origin}/meeting/${sessionInfo.SessionID}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    toast.success("Invitation link copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col h-[100dvh] w-screen bg-[#202124] text-white overflow-hidden font-sans m-0 p-0"
      style={{ display: 'flex', flexDirection: 'column', height: '100dvh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden' }}
    >
      {/* Isolated Main Stage Section using Inline Styles for maximum priority */}
      <section
        id="video-session-main-stage"
        className="flex-1 relative overflow-hidden p-4 pb-24 items-center justify-center min-h-0"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          paddingBottom: '6rem' // for controls
        }}
      >
        <div
          className={cn(
            "flex-1 flex gap-4 transition-all duration-300 items-center justify-center min-h-0",
            hasPins ? "flex-col lg:flex-row" : "flex-col"
          )}
          style={{
            display: 'flex',
            flex: 1,
            height: '100%',
            width: '100%',
            maxWidth: '1700px',
            margin: '0 auto'
          }}
        >
          {/* Main Stage (Pinned Content) */}
          {hasPins ? (
            <div className="flex-[4] h-full flex items-center justify-center min-h-0" style={{ flex: 4, height: '100%' }}>
              <div className={cn(
                "grid w-full h-full p-2 gap-3 items-center justify-center",
                pinnedParticipants.length === 1 ? "grid-cols-1" :
                  pinnedParticipants.length === 2 ? "grid-cols-1 md:grid-cols-2" :
                    "grid-cols-2"
              )} style={{ display: 'grid', width: '100%', height: '100%', gap: '12px' }}>
                {pinnedParticipants.map(p => (
                  <div key={p.socketId} className="w-full h-full min-h-0">
                    {p.isLocal ? (
                      <LocalVideo
                        stream={localStream}
                        userName="You"
                        isMuted={isMuted}
                        isVideoOff={isVideoOff}
                        isScreenSharing={isScreenSharing}
                        isPinned={true}
                        onPin={() => togglePin("local")}
                      />
                    ) : (
                      <RemoteVideo
                        stream={p.stream}
                        userName={p.userName || ""}
                        isMuted={p.isMuted}
                        isOff={p.isOff}
                        isSharing={p.isSharing}
                        isPinned={true}
                        onPin={() => togglePin(p.socketId)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Gallery / Side Strip */}
          {galleryParticipants.length > 0 && (
            <div className={cn(
              "transition-all duration-300 flex items-center justify-center min-h-0",
              hasPins
                ? "flex-none lg:w-[280px] xl:w-[340px] h-full overflow-y-auto scrollbar-none py-2"
                : "flex-1 w-full h-full"
            )} style={{
              flex: hasPins ? 'none' : 1,
              width: hasPins ? '340px' : '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div
                className={cn(
                  "grid gap-3 w-full items-center justify-center",
                  hasPins
                    ? "grid-cols-1 auto-rows-[180px] self-start"
                    : galleryParticipants.length === 1
                      ? "grid-cols-1 max-w-4xl h-full"
                      : galleryParticipants.length === 2
                        ? "grid-cols-1 md:grid-cols-2"
                        : galleryParticipants.length === 3
                          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                          : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                )} style={{ display: 'grid', gap: '12px', width: '100%', maxWidth: hasPins ? '100%' : '1280px' }}
              >
                {galleryParticipants.map((p) => (
                  <div
                    key={p.socketId}
                    className={cn(
                      "w-full rounded-xl overflow-hidden shadow-md group relative font-sans",
                      hasPins ? "aspect-video" : "h-full min-h-[240px]"
                    )}
                  >
                    {p.isLocal ? (
                      <LocalVideo
                        stream={localStream}
                        userName="You"
                        isMuted={isMuted}
                        isVideoOff={isVideoOff}
                        isScreenSharing={isScreenSharing}
                        onPin={() => togglePin("local")}
                        isPinned={pinnedIds.includes("local")}
                      />
                    ) : (
                      <RemoteVideo
                        stream={p.stream}
                        userName={p.userName}
                        isMuted={p.isMuted}
                        isOff={p.isOff}
                        isSharing={p.isSharing}
                        onPin={() => togglePin(p.socketId)}
                        isPinned={pinnedIds.includes(p.socketId)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overlay for scheduled sessions */}
          {isScheduled && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-500">
              <div className="bg-[#202124] border border-white/10 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
                {isMentor ? (
                  <>
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <Play className="w-10 h-10 text-primary fill-current" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Ready to start?</h2>
                    <p className="text-zinc-400 mb-8">
                      The learner {sessionInfo.learnerName} is waiting for you to officially begin the session.
                    </p>
                    <Button
                      size="lg"
                      className="w-full h-14 text-lg rounded-full font-bold shadow-lg shadow-primary/20"
                      onClick={onStartSession}
                      disabled={isStarting}
                    >
                      {isStarting ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Play className="w-5 h-5 mr-3" />}
                      Start Official Session
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6 animate-bounce">
                      <Loader2 className="w-10 h-10 text-zinc-400 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Waiting for Mentor</h2>
                    <p className="text-zinc-400 mb-4">
                      We're in the room! {sessionInfo.mentorName} will start the session shortly.
                    </p>
                    <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 text-sm text-zinc-500 italic">
                      "Make sure your camera and microphone are ready."
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Meet Side Panel - Google Meet Style Alignment Forced with Inline Styles */}
        {activeSidebar && (
          <aside
            className="ml-4 bg-white text-[#202124] rounded-xl flex flex-col overflow-hidden animate-in slide-in-from-right-5 duration-300 z-50 shadow-2xl shrink-0 self-start"
            style={{
              width: '360px',
              minWidth: '360px',
              maxWidth: '360px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              position: 'relative'
            }}
          >
            <div className="p-6 flex items-center justify-between border-b border-gray-100" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
              <h2 className="text-lg font-medium capitalize" style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                {activeSidebar === "chat" ? "In-call messages" :
                  activeSidebar === "people" ? "Everyone" :
                    activeSidebar === "info" ? "Meeting details" : activeSidebar}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveSidebar(null)}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 min-h-0" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {activeSidebar === "chat" && (
                <div className="space-y-6">
                  <div className="bg-[#f8f9fa] p-4 rounded-lg" style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                    <p className="text-[11px] text-[#5f6368] leading-normal" style={{ fontSize: '11px', color: '#5f6368' }}>
                      Messages can only be seen by people in the call and are deleted when the call ends.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={cn("flex flex-col", msg.isLocal ? "items-end" : "items-start")}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-medium text-gray-600">
                            {msg.isLocal ? "You" : msg.senderName}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                            msg.isLocal
                              ? "bg-primary text-white rounded-tr-none"
                              : "bg-[#f1f3f4] text-[#202124] rounded-tl-none"
                          )}
                          style={{
                            backgroundColor: msg.isLocal ? '#3b82f6' : '#f1f3f4',
                            color: msg.isLocal ? 'white' : '#202124',
                            borderRadius: msg.isLocal ? '16px 0px 16px 16px' : '0px 16px 16px 16px'
                          }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {messages.length === 0 && (
                    <p className="text-sm text-center text-gray-400 mt-20" style={{ fontSize: '14px', color: '#9ca3af', textAlign: 'center', marginTop: '80px' }}>No messages yet</p>
                  )}
                </div>
              )}

              {activeSidebar === "people" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {currentUser.fullName[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{currentUser.fullName} (You)</p>
                      <p className="text-xs text-gray-500">Meeting host</p>
                    </div>
                  </div>
                  {participants.map(p => (
                    <div key={p.socketId} className="flex items-center gap-3 p-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold uppercase">
                        {(p.userName || "P")[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.userName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSidebar === "info" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Joining info</h3>
                    <p className="text-xs text-gray-500 mb-4 break-all">
                      {window.location.origin}/meeting/{sessionInfo.SessionID}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-primary hover:text-primary hover:bg-primary/5 border-primary/20"
                      onClick={handleCopyLink}
                    >
                      {isCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {isCopied ? "Copied joining info" : "Copy joining info"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {activeSidebar === "chat" && (
              <div className="p-6 border-t border-gray-100 mt-auto" style={{ padding: '24px', borderTop: '1px solid #f3f4f6' }}>
                <form onSubmit={handleSendMessage} className="relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Send a message to everyone"
                    className="w-full bg-[#f1f3f4] border-none rounded-full px-5 py-3 text-sm focus:ring-1 focus:ring-primary/20 outline-none pr-12"
                    style={{ width: '100%', backgroundColor: '#f1f3f4', border: 'none', borderRadius: '9999px', padding: '12px 20px', fontSize: '14px' }}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/5 p-2 rounded-full transition-colors"
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </form>
              </div>
            )}
          </aside>
        )}
      </section>

      {/* Controls bar (Google Meet Style) */}
      <CallControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onLeave={handleLeave}
        onToggleChat={() => setActiveSidebar(activeSidebar === "chat" ? null : "chat")}
        onTogglePeople={() => setActiveSidebar(activeSidebar === "people" ? null : "people")}
        onToggleInfo={() => setActiveSidebar(activeSidebar === "info" ? null : "info")}
        isChatOpen={activeSidebar === "chat"}
        isPeopleOpen={activeSidebar === "people"}
        isInfoOpen={activeSidebar === "info"}
        hasNewMessage={hasNewMessage}
        participantCount={participantCount}
        duration={duration}
        audioDevices={audioDevices}
        videoDevices={videoDevices}
        selectedAudioId={selectedAudioId}
        selectedVideoId={selectedVideoId}
        onSwitchAudio={switchAudioDevice}
        onSwitchVideo={switchVideoDevice}
      />
    </div>
  );
}
