"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "@/providers/SocketProvider";

interface Participant {
  socketId: string;
  userId: string;
  userName: string;
  stream?: MediaStream;
  isOff?: boolean;
  isMuted?: boolean;
  isSharing?: boolean;
  isLocal?: boolean;
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
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());

  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  // Keep refs in sync so callbacks always have latest values
  const localStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null); // always the camera stream

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const isScreenSharingRef = useRef(false);

  const [messages, setMessages] = useState<any[]>([]);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioId, setSelectedAudioId] = useState<string>("");
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");

  // Helper: replace the video track in all peer connections
  const replaceVideoTrackInPeers = useCallback((newTrack: MediaStreamTrack | null) => {
    peerConnections.current.forEach((pc) => {
      const videoSender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (videoSender && newTrack) {
        videoSender.replaceTrack(newTrack).catch((err) =>
          console.error("[WebRTC] replaceVideoTrack error:", err)
        );
      }
    });
  }, []);

  const replaceAudioTrackInPeers = useCallback((newTrack: MediaStreamTrack | null) => {
    peerConnections.current.forEach((pc) => {
      const audioSender = pc.getSenders().find((s) => s.track?.kind === "audio");
      if (audioSender && newTrack) {
        audioSender.replaceTrack(newTrack).catch((err) =>
          console.error("[WebRTC] replaceAudioTrack error:", err)
        );
      }
    });
  }, []);

  const enumerateDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audios = devices.filter(d => d.kind === "audioinput");
      const videos = devices.filter(d => d.kind === "videoinput");
      setAudioDevices(audios);
      setVideoDevices(videos);

      // Set defaults if not already set
      if (audios.length > 0 && !selectedAudioId) {
        const defaultAudio = audios.find(d => d.deviceId === "default") || audios[0];
        setSelectedAudioId(defaultAudio.deviceId);
      }
      if (videos.length > 0 && !selectedVideoId) {
        setSelectedVideoId(videos[0].deviceId);
      }
    } catch (err) {
      console.error("[WebRTC] Error enumerating devices:", err);
    }
  }, [selectedAudioId, selectedVideoId]);

  /**
   * Initialize Local Camera+Mic Stream
   */
  const initLocalMedia = useCallback(async (audioId?: string, videoId?: string) => {
    try {
      const constraints = {
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          deviceId: videoId ? { exact: videoId } : undefined
        },
        audio: {
          deviceId: audioId ? { exact: audioId } : undefined
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      cameraStreamRef.current = stream;
      setLocalStream(stream);

      // Find actual device IDs from the granted stream
      const aTrack = stream.getAudioTracks()[0];
      const vTrack = stream.getVideoTracks()[0];
      if (aTrack && !selectedAudioId) setSelectedAudioId(aTrack.getSettings().deviceId || "");
      if (vTrack && !selectedVideoId) setSelectedVideoId(vTrack.getSettings().deviceId || "");

      return stream;
    } catch (error) {
      console.error("[WebRTC] Error accessing media devices:", error);
      return null;
    }
  }, [selectedAudioId, selectedVideoId]);

  /**
   * Create a Peer Connection for a remote socket
   */
  const createPeerConnection = useCallback(
    (socketId: string, remoteUserName: string, remoteUserId: string) => {
      // Close any existing connection for this peer
      const existing = peerConnections.current.get(socketId);
      if (existing) {
        existing.close();
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("webrtc:ice-candidate", {
            to: socketId,
            candidate: event.candidate,
          });
        }
      };

      // When remote tracks arrive, store the stream in participants state
      pc.ontrack = (event) => {
        console.log(`[WebRTC] ontrack from ${remoteUserName}`, event.streams);
        const remoteStream = event.streams[0];
        if (!remoteStream) return;

        setParticipants((prev) => {
          const next = new Map(prev);
          const existing = next.get(socketId) || {
            socketId,
            userId: remoteUserId,
            userName: remoteUserName,
          };
          // Create a new MediaStream reference so React detects the change
          existing.stream = remoteStream;
          next.set(socketId, { ...existing });
          return next;
        });
      };

      // Add all local tracks to the peer connection
      const stream = localStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      }

      peerConnections.current.set(socketId, pc);
      return pc;
    },
    [socket]
  );

  const leaveRoom = useCallback(() => {
    socket?.emit("webrtc:leave-room");
    peerConnections.current.forEach((pc) => pc.close());
    peerConnections.current.clear();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    setParticipants(new Map());
  }, [socket]);

  /**
   * Main signaling effect
   */
  useEffect(() => {
    if (!socket || !isConnected || !roomId) return;

    const startSignaling = async () => {
      const stream = await initLocalMedia();
      if (!stream) return;
      await enumerateDevices();
      socket.emit("webrtc:join-room", { roomId, userId, userName });
    };

    startSignaling();

    // A new user joined — we wait for THEM to send an offer (newcomer initiates)
    const handleUserJoined = ({ socketId, userName: remoteName, userId: remoteId }: any) => {
      console.log(`[WebRTC] User joined: ${remoteName}`);
      setParticipants((prev) => {
        const next = new Map(prev);
        // Clean up any existing stale connection for this user
        for (const [oldSid, p] of next.entries()) {
          if (p.userId === remoteId && oldSid !== socketId) {
            next.delete(oldSid);
          }
        }
        next.set(socketId, { socketId, userId: remoteId, userName: remoteName });
        return next;
      });
    };

    // We are the newcomer — initiate offers to everyone already in the room
    const handleExistingParticipants = async (existingParticipants: any[]) => {
      console.log(`[WebRTC] ${existingParticipants.length} existing participants`);
      for (const p of existingParticipants) {
        setParticipants((prev) => {
          const next = new Map(prev);
          // Clean up any stale connection for this user
          for (const [oldSid, pt] of next.entries()) {
            if (pt.userId === p.userId && oldSid !== p.socketId) {
              next.delete(oldSid);
            }
          }
          next.set(p.socketId, { socketId: p.socketId, userId: p.userId, userName: p.userName });
          return next;
        });

        const pc = createPeerConnection(p.socketId, p.userName, p.userId);
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("webrtc:offer", { to: p.socketId, offer });
        } catch (err) {
          console.error(`[WebRTC] Error creating offer for ${p.userName}:`, err);
        }
      }
    };

    // Received an offer — answer it
    const handleOffer = async ({ from, offer, fromUserId, fromUserName }: any) => {
      console.log(`[WebRTC] Received offer from ${fromUserName}`);
      let pc = peerConnections.current.get(from);

      setParticipants((prev) => {
        const next = new Map(prev);
        // Ensure participant exists and is unique by userId
        for (const [oldSid, p] of next.entries()) {
          if (p.userId === fromUserId && oldSid !== from) {
            next.delete(oldSid);
          }
        }
        next.set(from, { socketId: from, userId: fromUserId, userName: fromUserName });
        return next;
      });

      if (!pc) {
        pc = createPeerConnection(from, fromUserName, fromUserId);
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("webrtc:answer", { to: from, answer });
      } catch (err) {
        console.error(`[WebRTC] Error handling offer:`, err);
      }
    };

    const handleAnswer = async ({ from, answer }: any) => {
      const pc = peerConnections.current.get(from);
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.error("[WebRTC] Error setting remote description:", err);
        }
      }
    };

    const handleIceCandidate = async ({ from, candidate }: any) => {
      const pc = peerConnections.current.get(from);
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("[WebRTC] Error adding ICE candidate:", err);
        }
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

    const handleStatusUpdate = (type: "audio" | "video" | "screen") => (data: any) => {
      setParticipants((prev) => {
        const next = new Map(prev);
        // Find by userId or socketId if available
        for (const [socketId, p] of next.entries()) {
          if (p.userId === data.userId || socketId === data.from) {
            const updated = { ...p };
            if (type === "audio") updated.isMuted = data.isMuted;
            if (type === "video") {
              updated.isOff = data.isOff;
              // Force fresh stream reference on video toggle to re-sync tracks
              if (p.stream) {
                updated.stream = new MediaStream(p.stream.getTracks());
              }
            }
            if (type === "screen") {
              updated.isSharing = data.isSharing;
              // Force a fresh stream reference if sharing status changed
              // This helps triggering re-renders in RemoteVideo components
              if (p.stream) {
                updated.stream = new MediaStream(p.stream.getTracks());
              }
            }
            next.set(socketId, updated);
          }
        }
        return next;
      });
    };

    const handleChatMessage = (msg: any) => {
      setMessages((prev) => [...prev, { ...msg, isLocal: false }]);
      // We'll set hasNewMessage to true. The VideoRoom can clear it when chat is open.
      setHasNewMessage(true);
    };

    socket.on("webrtc:user-joined", handleUserJoined);
    socket.on("webrtc:existing-participants", handleExistingParticipants);
    socket.on("webrtc:offer", handleOffer);
    socket.on("webrtc:answer", handleAnswer);
    socket.on("webrtc:ice-candidate", handleIceCandidate);
    socket.on("webrtc:user-left", handleUserLeft);
    socket.on("webrtc:audio-status", handleStatusUpdate("audio"));
    socket.on("webrtc:video-status", handleStatusUpdate("video"));
    socket.on("webrtc:screen-share-status", handleStatusUpdate("screen"));
    socket.on("webrtc:chat-message", handleChatMessage);

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
      socket.off("webrtc:chat-message");

      peerConnections.current.forEach((pc) => pc.close());
      peerConnections.current.clear();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      leaveRoom();
    };
  }, [socket, isConnected, roomId, userId, userName, initLocalMedia, createPeerConnection, leaveRoom, enumerateDevices]);

  /**
   * Toggle audio mute
   */
  const toggleAudio = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      socket?.emit("webrtc:toggle-audio", { isMuted: !audioTrack.enabled });
    }
  }, [socket]);

  /**
   * Toggle video — properly gets a fresh camera track when re-enabling
   * to avoid "black frame" bug in Chrome/Firefox.
   */
  const toggleVideo = useCallback(async () => {
    if (isVideoOff) {
      // ── TURN CAMERA BACK ON ──────────────────────────────────────────────
      try {
        const newCamStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false, // keep existing audio track
        });
        const newVideoTrack = newCamStream.getVideoTracks()[0];

        // Build a new MediaStream: new video track + existing audio tracks
        const currentStream = localStreamRef.current;
        const audioTracks = currentStream ? currentStream.getAudioTracks() : [];
        const freshStream = new MediaStream([newVideoTrack, ...audioTracks]);

        // Update refs & state
        localStreamRef.current = freshStream;
        cameraStreamRef.current = freshStream;
        setLocalStream(freshStream);

        // Replace the video track in all peer connections
        replaceVideoTrackInPeers(newVideoTrack);

        setIsVideoOff(false);
        socket?.emit("webrtc:toggle-video", { isOff: false });
      } catch (err) {
        console.error("[WebRTC] Error re-enabling camera:", err);
      }
    } else {
      // ── TURN CAMERA OFF ──────────────────────────────────────────────────
      // Stop the video track so browser stops using camera (LED turns off)
      const stream = localStreamRef.current;
      if (stream) {
        stream.getVideoTracks().forEach((t) => t.stop());
      }
      setIsVideoOff(true);
      socket?.emit("webrtc:toggle-video", { isOff: true });
    }
  }, [isVideoOff, socket, replaceVideoTrackInPeers]);

  /**
   * Start screen sharing — replaces video track for all peers
   * and updates local preview to show the screen.
   */
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: false,
      });
      const screenVideoTrack = screenStream.getVideoTracks()[0];

      // Build a combined local stream: screen video + existing audio
      const currentStream = localStreamRef.current;
      const audioTracks = currentStream ? currentStream.getAudioTracks() : [];
      const combinedStream = new MediaStream([screenVideoTrack, ...audioTracks]);

      // Update local preview to show screen
      localStreamRef.current = combinedStream;
      setLocalStream(combinedStream);

      // Send screen track to all peers
      replaceVideoTrackInPeers(screenVideoTrack);

      isScreenSharingRef.current = true;
      setIsScreenSharing(true);
      socket?.emit("webrtc:toggle-screen-share", { isSharing: true });

      // When the user clicks "Stop Sharing" in the browser Chrome bar
      screenVideoTrack.onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.error("[WebRTC] Error starting screen share:", err);
    }
  }, [socket, replaceVideoTrackInPeers]);

  /**
   * Stop screen sharing — restores camera track for all peers
   */
  const stopScreenShare = useCallback(async () => {
    if (!isScreenSharingRef.current) return;
    isScreenSharingRef.current = false;

    // Stop all screen tracks
    const screenTrack = localStreamRef.current?.getVideoTracks()[0];
    screenTrack?.stop();

    // Get a fresh camera track
    try {
      const camStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      const newCamTrack = camStream.getVideoTracks()[0];

      // Build restored local stream
      const currentStream = localStreamRef.current;
      const audioTracks = currentStream ? currentStream.getAudioTracks() : [];
      const restoredStream = new MediaStream([newCamTrack, ...audioTracks]);

      localStreamRef.current = restoredStream;
      cameraStreamRef.current = restoredStream;
      setLocalStream(restoredStream);

      // Restore camera to all peers
      replaceVideoTrackInPeers(newCamTrack);
    } catch (err) {
      console.error("[WebRTC] Error restoring camera after screen share:", err);
    }

    setIsScreenSharing(false);
    socket?.emit("webrtc:toggle-screen-share", { isSharing: false });
  }, [socket, replaceVideoTrackInPeers]);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharingRef.current) {
      await stopScreenShare();
    } else {
      await startScreenShare();
    }
  }, [startScreenShare, stopScreenShare]);

  const sendChatMessage = useCallback((text: string) => {
    if (!text.trim() || !socket) return;
    const msg = {
      text,
      senderId: userId,
      senderName: userName,
      timestamp: new Date().toISOString(),
    };
    socket.emit("webrtc:chat-message", msg);
    setMessages((prev) => [...prev, { ...msg, isLocal: true }]);
  }, [socket, userId, userName]);

  const switchAudioDevice = useCallback(async (deviceId: string) => {
    try {
      const constraints = { audio: { deviceId: { exact: deviceId } }, video: false };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      const newTrack = newStream.getAudioTracks()[0];

      const currentStream = localStreamRef.current;
      if (currentStream) {
        // Stop old audio tracks
        currentStream.getAudioTracks().forEach(t => t.stop());
        
        // Build new stream: new audio track + existing video tracks
        const videoTracks = currentStream.getVideoTracks();
        const freshStream = new MediaStream([newTrack, ...videoTracks]);
        
        localStreamRef.current = freshStream;
        setLocalStream(freshStream);
        
        // Replace in peers
        replaceAudioTrackInPeers(newTrack);
        setSelectedAudioId(deviceId);
        
        // If it was muted, we might need to keep it muted or enable it
        newTrack.enabled = !isMuted;
      }
    } catch (err) {
      console.error("[WebRTC] Error switching audio device:", err);
    }
  }, [isMuted, replaceAudioTrackInPeers]);

  const switchVideoDevice = useCallback(async (deviceId: string) => {
    try {
      const constraints = { video: { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      const newTrack = newStream.getVideoTracks()[0];

      const currentStream = localStreamRef.current;
      if (currentStream) {
        // Stop old video tracks
        currentStream.getVideoTracks().forEach(t => t.stop());

        // Build new stream: new video track + existing audio tracks
        const audioTracks = currentStream.getAudioTracks();
        const freshStream = new MediaStream([newTrack, ...audioTracks]);

        localStreamRef.current = freshStream;
        cameraStreamRef.current = freshStream;
        setLocalStream(freshStream);

        // Replace in peers
        replaceVideoTrackInPeers(newTrack);
        setSelectedVideoId(deviceId);

        // If video was off, turning it on now
        if (isVideoOff) {
          setIsVideoOff(false);
          socket?.emit("webrtc:toggle-video", { isOff: false });
        }
      }
    } catch (err) {
      console.error("[WebRTC] Error switching video device:", err);
    }
  }, [isVideoOff, socket, replaceVideoTrackInPeers]);


  return {
    localStream,
    participants: Array.from(participants.values()),
    messages,
    hasNewMessage,
    setHasNewMessage,
    audioDevices,
    videoDevices,
    selectedAudioId,
    selectedVideoId,
    isMuted,
    isVideoOff,
    isScreenSharing,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    switchAudioDevice,
    switchVideoDevice,
    sendChatMessage,
    leaveRoom,
  };
}
