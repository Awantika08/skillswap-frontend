import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Mic, MicOff, 
  Video, VideoOff, 
  ScreenShare, StopCircle,
  PhoneOff,
  Settings,
  MoreVertical,
  MessageSquare
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CallControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onLeave: () => void;
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

export function CallControls({
  isMuted,
  isVideoOff,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onLeave,
  onToggleChat,
  isChatOpen,
}: CallControlsProps) {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
 
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);
 
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-between px-8 bg-zinc-950/95 backdrop-blur-xl z-50 animate-in slide-in-from-bottom-5 duration-700">
      {/* Left section: Time and Info */}
      <div className="flex-1 flex items-center gap-6 text-white/90">
        <div className="text-[13px] font-bold tracking-tight border-r border-white/10 pr-6 opacity-80">{time}</div>
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] hidden lg:block text-white/40">
          Secure Meeting Room
        </div>
      </div>
 
      {/* Middle section: Main Controls */}
      <div className="flex items-center gap-4">
        <TooltipProvider delayDuration={300}>
          {/* Audio */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-12 h-12 rounded-2xl transition-all duration-300 border border-white/5",
                  isMuted ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]" : "bg-zinc-800/50 hover:bg-zinc-700/50 text-white"
                )}
                onClick={onToggleAudio}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-zinc-800 border-white/10 text-[10px] font-bold px-3 py-1.5 rounded-lg">
              {isMuted ? "UNMUTE" : "MUTE"}
            </TooltipContent>
          </Tooltip>
 
          {/* Video */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-12 h-12 rounded-2xl transition-all duration-300 border border-white/5",
                  isVideoOff ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]" : "bg-zinc-800/50 hover:bg-zinc-700/50 text-white"
                )}
                onClick={onToggleVideo}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-zinc-800 border-white/10 text-[10px] font-bold px-3 py-1.5 rounded-lg">
              {isVideoOff ? "START VIDEO" : "STOP VIDEO"}
            </TooltipContent>
          </Tooltip>
 
          {/* Screen Share */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-12 h-12 rounded-2xl transition-all duration-300 border border-white/5 text-white",
                  isScreenSharing ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-zinc-800/50 hover:bg-zinc-700/50"
                )}
                onClick={onToggleScreenShare}
              >
                <ScreenShare className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-zinc-800 border-white/10 text-[10px] font-bold px-3 py-1.5 rounded-lg">
              {isScreenSharing ? "STOP PRESENTING" : "PRESENT NOW"}
            </TooltipContent>
          </Tooltip>
 
          {/* Leave */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                className="w-20 h-11 rounded-2xl bg-rose-500 hover:bg-rose-600 border-none transition-all duration-300 shadow-[0_10px_20px_rgba(244,63,94,0.25)]"
                onClick={onLeave}
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-zinc-800 border-white/10 text-[10px] font-bold px-3 py-1.5 rounded-lg">
              LEAVE CALL
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
 
      {/* Right section: Panels */}
      <div className="flex-1 flex justify-end items-center gap-3">
        <TooltipProvider delayDuration={300}>
           <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleChat} 
                className={cn(
                  "w-11 h-11 rounded-xl transition-all duration-300 border border-white/5",
                  isChatOpen ? "bg-primary text-white" : "text-white/60 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-zinc-800 border-white/10 text-[10px] font-bold px-3 py-1.5 rounded-lg">
              CHAT
            </TooltipContent>
          </Tooltip>
 
          <Button variant="ghost" size="icon" className="w-11 h-11 rounded-xl text-white/60 hover:text-white hover:bg-zinc-800/50 transition-all border border-white/5">
            <Settings className="w-5 h-5" />
          </Button>
 
          <Button variant="ghost" size="icon" className="w-11 h-11 rounded-xl text-white/60 hover:text-white hover:bg-zinc-800/50 transition-all border border-white/5">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </TooltipProvider>
      </div>
    </div>
  );
}