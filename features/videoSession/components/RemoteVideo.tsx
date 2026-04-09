import React, { useEffect, useRef } from "react";
import { User, MicOff, ScreenShare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RemoteVideoProps {
  stream?: MediaStream;
  userName: string;
  isMuted?: boolean;
  isOff?: boolean;
  isSharing?: boolean;
}

export function RemoteVideo({ stream, userName, isMuted, isOff, isSharing }: RemoteVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
 
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
 
  return (
    <div className="relative w-full h-full rounded-2xl bg-zinc-900 overflow-hidden border border-white/10 transition-all duration-500 shadow-2xl group ring-1 ring-white/5 font-sans">
      {isOff || !stream ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 transition-colors duration-500">
          <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 shadow-inner transition-all group-hover:scale-110 duration-500">
            <User className="w-12 h-12 text-zinc-500" />
          </div>
          <p className="mt-6 text-[11px] font-bold tracking-widest text-zinc-500 uppercase opacity-60 transition-all group-hover:opacity-100">{userName}</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full transition-all duration-700 ${isSharing ? 'object-contain bg-black' : 'object-cover'}`}
        />
      )}
 
      {/* Participant info overlay */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10 transition-transform duration-500 group-hover:translate-x-1">
        <div className="px-3 py-1.5 rounded-xl bg-zinc-950/40 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 flex items-center gap-2 shadow-lg">
          {isSharing && <ScreenShare className="w-3.5 h-3.5 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />}
          {isMuted && <MicOff className="w-3.5 h-3.5 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" />}
          <span className="drop-shadow-md">{userName}</span>
        </div>
      </div>
 
      {isSharing && (
        <div className="absolute top-4 left-4 z-10 animate-in fade-in slide-in-from-top-2 duration-700">
           <Badge className="bg-emerald-500 text-white hover:bg-emerald-500 text-[10px] px-3 py-1 border-none rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            {userName} is presenting
          </Badge>
        </div>
      )}
 
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none duration-500" />
    </div>
  );
}