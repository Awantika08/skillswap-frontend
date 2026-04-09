import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "@/providers/SocketProvider";

interface UserMediaConfig {
  video: boolean;
  audio: boolean;
}

interface Participant {
  socketId: string;
  userId: string;
  userName: string;
  stream?: MediaStream;
  isOff?: boolean;
  isMuted?: boolean;
  isSharing?: boolean;
}

interface UseWebRTCProps {
  roomId: string;
  userId: string;
  userName: string;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export function useWebRTC({ roomId, userId, userName }: UseWebRTCProps) {
  const { socket, isConnected } = useSocket();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // States for controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  /**
   * Initialize Local Media
   */
  const initLocalMedia = useCallback(async (config: UserMediaConfig = { video: true, audio: true }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(config);
      setLocalStream(stream);
      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      return null;
    }
  }, []);

  /**
   * Create Peer Connection
   */
  const createPeerConnection = useCallback((socketId: string, remoteUserName: string, remoteUserId: string) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("webrtc:ice-candidate", {
          to: socketId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log(`Received remote track from ${remoteUserName}`);
      setParticipants((prev) => {
        const newParticipants = new Map(prev);
        const participant = newParticipants.get(socketId) || {
          socketId,
          userId: remoteUserId,
          userName: remoteUserName,
        };
        participant.stream = event.streams[0];
        newParticipants.set(socketId, participant);
        return newParticipants;
      });
    };

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    peerConnections.current.set(socketId, pc);
    return pc;
  }, [socket]);

  /**
   * Handle Call Initialization (Join Room)
   */
  useEffect(() => {
    if (!socket || !isConnected || !roomId) return;

    const startSignaling = async () => {
      // 1. Get local media first
      const stream = await initLocalMedia();
      if (!stream) return;

      // 2. Join room
      socket.emit("webrtc:join-room", { roomId, userId, userName });
    };

    startSignaling();

    // Socket listeners
    
    // Someone joined -> we just add them to participants and wait for their offer
    const handleUserJoined = async ({ socketId, userName: remoteName, userId: remoteId }: any) => {
      console.log(`[WebRTC] User joined: ${remoteName}. Waiting for offer...`);
      
      setParticipants((prev) => {
        const next = new Map(prev);
        // Only set the info, handshake starts when we receive the offer
        next.set(socketId, { socketId, userId: remoteId, userName: remoteName });
        return next;
      });
    };

    // Existing participants -> Newcomer initiates offers to everyone
    const handleExistingParticipants = async (existingParticipants: any[]) => {
      console.log(`[WebRTC] Joining room with ${existingParticipants.length} existing participants`);
      for (const p of existingParticipants) {
        console.log(`[WebRTC] Initiating handshake with existing user: ${p.userName}`);
        const pc = createPeerConnection(p.socketId, p.userName, p.userId);
        
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("webrtc:offer", { to: p.socketId, offer });
          
          setParticipants((prev) => {
            const next = new Map(prev);
            next.set(p.socketId, { socketId: p.socketId, userId: p.userId, userName: p.userName });
            return next;
          });
        } catch (err) {
          console.error(`[WebRTC] Error creating offer for ${p.userName}:`, err);
        }
      }
    };

    const handleOffer = async ({ from, offer, fromUserId, fromUserName }: any) => {
      console.log(`[WebRTC] Received offer from ${fromUserName}`);
      let pc = peerConnections.current.get(from);
      
      if (!pc) {
        pc = createPeerConnection(from, fromUserName, fromUserId);
        setParticipants((prev) => {
          const next = new Map(prev);
          next.set(from, { socketId: from, userId: fromUserId, userName: fromUserName });
          return next;
        });
      }
      
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        socket.emit("webrtc:answer", { to: from, answer });
      } catch (err) {
        console.error(`[WebRTC] Error handling offer from ${fromUserName}:`, err);
      }
    };

    const handleAnswer = async ({ from, answer }: any) => {
      const pc = peerConnections.current.get(from);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    };

    const handleIceCandidate = async ({ from, candidate }: any) => {
      const pc = peerConnections.current.get(from);
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    const handleUserLeft = ({ userId: leftUserId }: any) => {
      setParticipants((prev) => {
        const next = new Map(prev);
        for (const [socketId, p] of next.entries()) {
          if (p.userId === leftUserId) {
            next.delete(socketId);
            const pc = peerConnections.current.get(socketId);
            if (pc) {
              pc.close();
              peerConnections.current.delete(socketId);
            }
          }
        }
        return next;
      });
    };

    const handleStatusUpdate = (type: 'audio' | 'video' | 'screen') => (data: any) => {
      setParticipants((prev) => {
        const next = new Map(prev);
        for (const [socketId, p] of next.entries()) {
          if (p.userId === data.userId) {
            if (type === 'audio') p.isMuted = data.isMuted;
            if (type === 'video') p.isOff = data.isOff;
            if (type === 'screen') p.isSharing = data.isSharing;
            next.set(socketId, { ...p });
          }
        }
        return next;
      });
    };

    socket.on("webrtc:user-joined", handleUserJoined);
    socket.on("webrtc:existing-participants", handleExistingParticipants);
    socket.on("webrtc:offer", handleOffer);
    socket.on("webrtc:answer", handleAnswer);
    socket.on("webrtc:ice-candidate", handleIceCandidate);
    socket.on("webrtc:user-left", handleUserLeft);
    socket.on("webrtc:audio-status", handleStatusUpdate('audio'));
    socket.on("webrtc:video-status", handleStatusUpdate('video'));
    socket.on("webrtc:screen-share-status", handleStatusUpdate('screen'));

    return () => {
      socket.off("webrtc:user-joined");
      socket.off("webrtc:existing-participants");
      socket.off("webrtc:offer");
      socket.off("webrtc:answer");
      socket.off("webrtc:ice-candidate");
      socket.off("webrtc:user-left");
      socket.off("webrtc:audio-status");
      socket.off("webrtc:video-status");
      socket.off("webrtc:screen-share-status");
      
      // Clean up
      peerConnections.current.forEach((pc) => pc.close());
      peerConnections.current.clear();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [socket, isConnected, roomId, userId, userName, initLocalMedia, createPeerConnection]);

  /**
   * Controls
   */
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        socket?.emit("webrtc:toggle-audio", { isMuted: !audioTrack.enabled });
      }
    }
  }, [socket]);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        const newState = !videoTrack.enabled;
        videoTrack.enabled = newState;
        setIsVideoOff(!newState);
        socket?.emit("webrtc:toggle-video", { isOff: !newState });
        
        // Ensure all peers get the track enabled state update
        // (Sometimes enabled=false sends black frames, turning it back on should work)
        // If it's still blank, we might need to recreate the track, but toggling enabled is standard.
      }
    }
  }, [socket]);

  const toggleScreenShare = useCallback(async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
        screenStreamRef.current = stream;
        setIsScreenSharing(true);
        socket?.emit("webrtc:toggle-screen-share", { isSharing: true });

        const screenTrack = stream.getVideoTracks()[0];
        
        // Replace video track for all peers
        peerConnections.current.forEach((pc) => {
          const senders = pc.getSenders();
          const videoSender = senders.find((s) => s.track?.kind === "video");
          
          if (videoSender) {
            videoSender.replaceTrack(screenTrack).catch(err => {
              console.error("[WebRTC] replaceTrack error:", err);
            });
          } else {
            // If no video sender (camera was off), we MUST add it
            console.log("[WebRTC] Adding screen track as new track (no video sender existed)");
            pc.addTrack(screenTrack, stream);
            // This might require renegotiation
            pc.createOffer().then(offer => {
               pc.setLocalDescription(offer);
               socket?.emit("webrtc:offer", { to: Array.from(peerConnections.current.keys()).find(id => peerConnections.current.get(id) === pc), offer });
            });
          }
        });

        screenTrack.onended = () => {
          stopScreenShare();
        };
      } catch (error) {
        console.error("Error starting screen share:", error);
      }
    } else {
      stopScreenShare();
    }
  }, [isScreenSharing, socket]);

  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
      screenStreamRef.current = null;
      setIsScreenSharing(false);
      socket?.emit("webrtc:toggle-screen-share", { isSharing: false });

      // Restore camera track for all peers
      const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
      if (cameraTrack) {
        peerConnections.current.forEach((pc) => {
          const senders = pc.getSenders();
          const videoSender = senders.find((s) => s.track?.kind === "video");
          if (videoSender) {
            videoSender.replaceTrack(cameraTrack).catch(err => {
              console.error("[WebRTC] Restore camera track error:", err);
            });
          }
        });
      }
    }
  }, [socket]);

  const leaveRoom = useCallback(() => {
    socket?.emit("webrtc:leave-room");
    peerConnections.current.forEach((pc) => pc.close());
    peerConnections.current.clear();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    setParticipants(new Map());
  }, [socket]);

  return {
    localStream,
    screenStream,
    participants: Array.from(participants.values()),
    isMuted,
    isVideoOff,
    isScreenSharing,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    leaveRoom,
  };
}