import React, { useState } from "react";
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

interface VideoRoomProps {
  sessionInfo: SessionMeetingInfo;
  currentUser: { id: string; fullName: string };
  duration: string;
  onEndSession: () => void;
  isEnding: boolean;
}

export function VideoRoom({ sessionInfo, currentUser, duration, onEndSession, isEnding }: VideoRoomProps) {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const {
    localStream,
    participants,
    isMuted,
    isVideoOff,
    isScreenSharing,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    leaveRoom
  } = useWebRTC({
    roomId: sessionInfo.MeetingRoomId,
    userId: currentUser.id,
    userName: currentUser.fullName
  });

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

  // Determine grid layout based on participant count
  const participantCount = participants.length;

  return (
    <div className="relative flex flex-col h-screen bg-zinc-950 text-white overflow-hidden font-sans">
      {/* Invisible Overlay Header for Info (Google Meet style) */}
      <MeetingHeader
        title={sessionInfo.mentorName}
        duration={duration}
        participantCount={participants.length + 1}
        status={sessionInfo.Status}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative flex items-center justify-center p-6 lg:p-12 mb-20 transition-all duration-700 overflow-hidden">
        {/* Remote Grid / Main View */}
        <div className={cn(
          "w-full h-full max-w-7xl mx-auto flex items-center justify-center transition-all duration-700 ease-in-out",
          isChatOpen && "lg:pr-[380px]"
        )}>
           {participants.length === 0 ? (
              // Lobby / Waiting View (Full Screen Self)
              <div className="w-full h-full flex items-center justify-center">
                 <div className="w-full max-w-5xl aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 fade-in duration-1000 border border-white/5">
                    <LocalVideo
                      stream={localStream}
                      userName="You"
                      isMuted={isMuted}
                      isVideoOff={isVideoOff}
                    />
                 </div>
              </div>
           ) : (
              // Dynamic Grid View
              <div className={cn(
                "w-full h-full grid gap-4 items-center justify-center auto-rows-fr",
                participantCount === 1 ? "grid-cols-1 max-w-5xl aspect-video" : 
                participantCount === 2 ? "grid-cols-2 max-w-6xl aspect-video" : "grid-cols-2 lg:grid-cols-3"
              )}>
                 {participants.map((p) => (
                    <div key={p.socketId} className="w-full h-full rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                       <RemoteVideo
                         stream={p.stream}
                         userName={p.userName}
                         isMuted={p.isMuted}
                         isOff={p.isOff}
                         isSharing={p.isSharing}
                       />
                    </div>
                 ))}
              </div>
           )}
        </div>

        {/* Floating PIP (Self View) when others are present */}
        {participants.length > 0 && (
          <div className={cn(
            "fixed bottom-24 right-8 w-48 lg:w-80 aspect-video z-30 transition-all duration-700 ease-in-out shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:scale-105",
            isChatOpen && "lg:right-[410px]"
          )}>
             <LocalVideo
                stream={localStream}
                userName="You"
                isMuted={isMuted}
                isVideoOff={isVideoOff}
             />
          </div>
        )}

        {/* Professional Chat Sidebar */}
        <aside className={cn(
          "fixed right-6 top-6 bottom-24 w-[360px] bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] z-40 transition-all duration-700 ease-in-out transform",
          isChatOpen ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0 pointer-events-none"
        )}>
           <div className="h-full flex flex-col p-8">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h2 className="text-lg font-bold tracking-tight text-white/90">In-call Messages</h2>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mt-1">End-to-end encrypted</p>
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)} className="rounded-full h-10 w-10 hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                    <span className="text-2xl font-light">×</span>
                 </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-none">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-primary mb-2 uppercase tracking-widest">Meeting Policy</p>
                    <p className="text-xs text-white/60 leading-relaxed">Messages sent in-call are visible to everyone and will be cleared when the meeting ends.</p>
                 </div>
              </div>

              <div className="mt-6">
                 <div className="relative group">
                    <input 
                       className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-xs focus:ring-1 focus:ring-primary/50 outline-none transition-all pr-12 group-focus-within:bg-white/10 text-white"
                       placeholder="Say something to everyone..."
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary text-white hover:scale-105 transition-transform">
                       <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                 </div>
              </div>
           </div>
        </aside>
      </main>

      {/* Modern Control Bar */}
      <CallControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onLeave={handleLeave}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />
    </div>
  );
}