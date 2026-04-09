import React, { useEffect, useRef } from "react";
import { User, MicOff } from "lucide-react";

interface LocalVideoProps {
  stream: MediaStream | null;
  userName: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

export function LocalVideo({ stream, userName, isMuted, isVideoOff }: LocalVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
 
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
 
  return (
    <div className="relative w-full h-full rounded-2xl bg-zinc-900 overflow-hidden border border-white/10 transition-all duration-500 shadow-2xl group ring-1 ring-white/5">
      {isVideoOff || !stream ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 transition-colors duration-500 font-sans">
          <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 shadow-inner transition-all group-hover:scale-110 duration-500">
            <User className="w-12 h-12 text-zinc-500" />
          </div>
          <div className="mt-6 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Your camera is off</span>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover scale-x-[-1] transition-transform duration-700"
        />
      )}
      
      {/* Overlay info */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
        <div className="px-3 py-1.5 rounded-xl bg-zinc-950/40 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 flex items-center gap-2 shadow-lg">
          {isMuted && <MicOff className="w-3.5 h-3.5 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" />}
          <span className="drop-shadow-md">You</span>
        </div>
      </div>
 
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none duration-500" />
    </div>
  );
}