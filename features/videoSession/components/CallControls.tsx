import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Mic, MicOff,
  Video, VideoOff,
  ScreenShare,
  PhoneOff,
  MoreVertical,
  MessageSquare,
  Users,
  Info,
  Hand,
  ChevronUp,
  Smile,
  Type,
  LayoutGrid,
  ShieldCheck,
  Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

interface CallControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void | Promise<void>;
  onToggleScreenShare: () => void | Promise<void>;
  onLeave: () => void;
  onToggleChat?: () => void;
  onTogglePeople?: () => void;
  onToggleInfo?: () => void;
  participantCount: number;
  isChatOpen?: boolean;
  isPeopleOpen?: boolean;
  isInfoOpen?: boolean;
  hasNewMessage?: boolean;
  duration: string;
  audioDevices?: MediaDeviceInfo[];
  videoDevices?: MediaDeviceInfo[];
  selectedAudioId?: string;
  selectedVideoId?: string;
  onSwitchAudio?: (id: string) => void;
  onSwitchVideo?: (id: string) => void;
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
  onTogglePeople,
  onToggleInfo,
  participantCount,
  isChatOpen,
  isPeopleOpen,
  isInfoOpen,
  hasNewMessage,
  duration,
  audioDevices = [],
  videoDevices = [],
  selectedAudioId,
  selectedVideoId,
  onSwitchAudio,
  onSwitchVideo,
}: CallControlsProps) {
  const { sessionId } = useParams() as { sessionId: string };
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));

  const roomCode = sessionId.substring(0, 11);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const controlButtonClass = "w-10 h-10 rounded-full transition-all duration-200 border-none flex items-center justify-center p-0";
  const activeControlClass = "bg-[#3c4043] hover:bg-[#434649] text-white";
  const inactiveControlClass = "bg-[#ea4335] hover:bg-[#fb5e4c] text-white";
  const secondaryControlClass = "bg-transparent hover:bg-white/10 text-white/90";

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-between px-6 bg-[#202124] z-50">
      {/* Left section: Time and Meeting Code */}
      <div className="flex-1 flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-4 pr-4 border-r border-white/10 hidden sm:flex">
          <div className="text-sm font-medium text-white/90">
            {time}
          </div>
          <div className="text-sm font-medium text-emerald-400 font-mono">
            {duration}
          </div>
        </div>
        <div className="text-sm font-medium text-white/90 truncate">
          {roomCode}
        </div>
      </div>

      {/* Middle section: Main Controls (Google Meet Style) */}
      <div className="flex items-center gap-2 sm:gap-3">
        <TooltipProvider delayDuration={300}>
          {/* Audio */}
          <div className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(controlButtonClass, !isMuted ? activeControlClass : inactiveControlClass)}
                  onClick={onToggleAudio}
                >
                  {!isMuted ? <Mic className="w-[18px] h-[18px]" /> : <MicOff className="w-[18px] h-[18px]" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#3c4043] border-none text-[11px] font-medium py-1 px-2 mb-2">
                {isMuted ? "Turn on microphone (ctrl + d)" : "Turn off microphone (ctrl + d)"}
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-5 h-10 rounded-r-full p-0 flex items-center justify-center text-white/60 hover:bg-white/5 -ml-2">
                  <ChevronUp className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-64 bg-[#202124] border-white/10 text-white">
                <DropdownMenuLabel className="text-zinc-500 text-[10px] uppercase tracking-wider">Microphone</DropdownMenuLabel>
                {audioDevices.map((device) => (
                  <DropdownMenuItem
                    key={device.deviceId}
                    onClick={() => onSwitchAudio?.(device.deviceId)}
                    className="flex items-center justify-between text-sm py-2 px-3 focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    <span className="truncate flex-1">{device.label || `Microphone ${device.deviceId.slice(0, 5)}`}</span>
                    {selectedAudioId === device.deviceId && <Check className="w-4 h-4 text-primary ml-2 shrink-0" />}
                  </DropdownMenuItem>
                ))}
                {audioDevices.length === 0 && <DropdownMenuItem disabled>No microphones found</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Video */}
          <div className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(controlButtonClass, !isVideoOff ? activeControlClass : inactiveControlClass)}
                  onClick={onToggleVideo}
                >
                  {!isVideoOff ? <Video className="w-[18px] h-[18px]" /> : <VideoOff className="w-[18px] h-[18px]" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#3c4043] border-none text-[11px] font-medium py-1 px-2 mb-2">
                {isVideoOff ? "Turn on camera (ctrl + e)" : "Turn off camera (ctrl + e)"}
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-4 h-10 rounded-r-full p-0 flex items-center justify-center text-white/60 hover:bg-white/5 -ml-1">
                  <ChevronUp className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-64 bg-[#202124] border-white/10 text-white">
                <DropdownMenuLabel className="text-zinc-500 text-[10px] uppercase tracking-wider">Camera</DropdownMenuLabel>
                {videoDevices.map((device) => (
                  <DropdownMenuItem
                    key={device.deviceId}
                    onClick={() => onSwitchVideo?.(device.deviceId)}
                    className="flex items-center justify-between text-sm py-2 px-3 focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    <span className="truncate flex-1">{device.label || `Camera ${device.deviceId.slice(0, 5)}`}</span>
                    {selectedVideoId === device.deviceId && <Check className="w-4 h-4 text-primary ml-2 shrink-0" />}
                  </DropdownMenuItem>
                ))}
                {videoDevices.length === 0 && <DropdownMenuItem disabled>No cameras found</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Screen Share */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(controlButtonClass, isScreenSharing ? "bg-[#8ab4f8] text-[#202124] hover:bg-[#aecbfa]" : activeControlClass)}
                onClick={onToggleScreenShare}
              >
                <ScreenShare className="w-[18px] h-[18px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[#3c4043] border-none text-[11px] font-medium py-1 px-2 mb-2">
              {isScreenSharing ? "Stop presenting" : "Present now"}
            </TooltipContent>
          </Tooltip>

          {/* Leave Call */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                className="w-16 h-10 rounded-full bg-[#ea4335] hover:bg-[#fb5e4c] border-none transition-all duration-200 p-0"
                onClick={onLeave}
              >
                <PhoneOff className="w-5 h-5 fill-current" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[#3c4043] border-none text-[11px] font-medium py-1 px-2 mb-2">
              Leave call
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Right section: Info, People, Chat, etc. */}
      <div className="flex-1 flex justify-end items-center gap-1 sm:gap-2">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={onToggleInfo}
                className={cn(controlButtonClass, secondaryControlClass, isInfoOpen && "bg-white/10")}
              >
                <Info className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[#3c4043] border-none text-[11px] font-medium py-1 px-2 mb-2">
              Meeting details
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={onTogglePeople}
                className={cn(controlButtonClass, secondaryControlClass, isPeopleOpen ? "bg-white/10" : "relative")}
              >
                <Users className="w-5 h-5" />
                {!isPeopleOpen && (
                  <span className="absolute -top-1 -right-1 bg-white text-zinc-900 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {participantCount}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[#3c4043] border-none text-[11px] font-medium py-1 px-2 mb-2">
              Show everyone
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={onToggleChat}
                className={cn(controlButtonClass, secondaryControlClass, isChatOpen ? "bg-white/10" : "relative")}
              >
                <MessageSquare className="w-5 h-5" />
                {!isChatOpen && hasNewMessage && (
                  <span className="absolute top-0 right-0 bg-[#8ab4f8] rounded-full w-2.5 h-2.5 border-2 border-[#202124]" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[#3c4043] border-none text-[11px] font-medium py-1 px-2 mb-2">
              Chat with everyone
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className={cn(controlButtonClass, secondaryControlClass)}>
                <ShieldCheck className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[#3c4043] border-none text-[11px] font-medium py-1 px-2 mb-2">
              Host controls
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
