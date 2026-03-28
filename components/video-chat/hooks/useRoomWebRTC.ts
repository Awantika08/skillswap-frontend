"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getRoomSignalChannelName } from "../utils";

type SignalingMessage =
  | {
      type: "register";
      roomId: string;
      peerId: string;
      senderName?: string;
    }
  | {
      type: "leave";
      roomId: string;
      peerId: string;
    }
  | {
      type: "offer";
      roomId: string;
      peerId: string;
      sdp: { type: RTCSdpType; sdp: string };
    }
  | {
      type: "answer";
      roomId: string;
      peerId: string;
      sdp: { type: RTCSdpType; sdp: string };
    }
  | {
      type: "ice-candidate";
      roomId: string;
      peerId: string;
      candidate: RTCIceCandidateInit;
    };

function createPeerId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `peer-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useRoomWebRTC({
  roomId,
  displayName,
}: {
  roomId: string;
  displayName: string;
}) {
  const peerId = useMemo(() => createPeerId(), []);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(
    null,
  );
  const [remotePeerId, setRemotePeerId] = useState<string | null>(null);
  const [remoteName, setRemoteName] = useState<string>("Participant");

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const [connectionState, setConnectionState] = useState<
    "idle" | "connecting" | "connected" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const remotePeerIdRef = useRef<string | null>(null);
  const startedOfferRef = useRef(false);
  const tracksAddedRef = useRef(false);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const originalVideoTrackRef = useRef<MediaStreamTrack | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const signalChannelName = useMemo(
    () => getRoomSignalChannelName(roomId),
    [roomId],
  );

  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      try {
        setConnectionState("connecting");
        setErrorMessage(null);

        // Setup peer connection first.
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        });
        pcRef.current = pc;

        pc.onicecandidate = (event) => {
          if (!event.candidate) return;
          const bc = bcRef.current;
          if (!bc) return;

          const msg: SignalingMessage = {
            type: "ice-candidate",
            roomId,
            peerId,
            candidate: event.candidate.toJSON(),
          };
          bc.postMessage(msg);
        };

        pc.ontrack = (event) => {
          const [stream] = event.streams;
          if (!stream) return;
          setRemoteStream(stream);
          setConnectionState("connected");
        };

        pc.onconnectionstatechange = () => {
          const state = pc.connectionState;
          if (state === "failed" || state === "disconnected" || state === "closed") {
            setConnectionState("idle");
            setRemoteStream(null);
          }
        };

        // Setup signaling.
        const bc = new BroadcastChannel(signalChannelName);
        bcRef.current = bc;

        bc.addEventListener("message", async (event: MessageEvent<unknown>) => {
          if (cancelled) return;
          const data = event.data as SignalingMessage | undefined;
          if (!data) return;
          if (data.roomId !== roomId) return;
          if (data.peerId === peerId) return;

          if (data.type === "register") {
            if (!remotePeerIdRef.current) {
              remotePeerIdRef.current = data.peerId;
              setRemotePeerId(data.peerId);
              setRemoteName(data.senderName ?? "Participant");
            }
            return;
          }

          if (data.type === "leave") {
            if (remotePeerIdRef.current === data.peerId) {
              remotePeerIdRef.current = null;
              setRemotePeerId(null);
              setRemoteName("Participant");
              setRemoteStream(null);
              setConnectionState("idle");
              startedOfferRef.current = false;
              pendingCandidatesRef.current = [];
            }
            return;
          }

          // If we know the remote peer id, make sure messages are from it.
          if (
            remotePeerIdRef.current &&
            "peerId" in data &&
            data.peerId !== remotePeerIdRef.current
          ) {
            return;
          }

          if (data.type === "offer") {
            // We elect the initiator via peerId comparison; if we're initiator, ignore.
            const remoteId = remotePeerIdRef.current;
            if (remoteId && peerId < remoteId) return;

            try {
              if (!remotePeerIdRef.current) {
                remotePeerIdRef.current = data.peerId;
                setRemotePeerId(data.peerId);
              }

              await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

              // Apply queued ICE candidates now that remote description is set.
              for (const c of pendingCandidatesRef.current) {
                await pc.addIceCandidate(c);
              }
              pendingCandidatesRef.current = [];

              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);

              bc.postMessage({
                type: "answer",
                roomId,
                peerId,
                sdp: pc.localDescription
                  ? { type: pc.localDescription.type, sdp: pc.localDescription.sdp }
                  : data.sdp,
              } satisfies SignalingMessage);
            } catch (e) {
              console.error("Failed to handle offer", e);
            }
          }

          if (data.type === "answer") {
            try {
              await pc.setRemoteDescription(
                new RTCSessionDescription(data.sdp),
              );
              for (const c of pendingCandidatesRef.current) {
                await pc.addIceCandidate(c);
              }
              pendingCandidatesRef.current = [];
            } catch (e) {
              console.error("Failed to handle answer", e);
            }
          }

          if (data.type === "ice-candidate") {
            try {
              // If remote description isn't ready yet, queue candidates.
              if (!pc.remoteDescription) {
                pendingCandidatesRef.current.push(data.candidate);
                return;
              }
              await pc.addIceCandidate(data.candidate);
            } catch (e) {
              console.error("Failed to add ICE candidate", e);
            }
          }
        });

        // Register into room.
        bc.postMessage({
          type: "register",
          roomId,
          peerId,
          senderName: displayName,
        } satisfies SignalingMessage);

        // Acquire local media and attach tracks to the peer connection.
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        // IMPORTANT: Add tracks before creating offer/answer.
        // Otherwise the generated SDP might not include audio/video and the
        // remote side won't receive media without renegotiation.
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        tracksAddedRef.current = true;

        setLocalStream(stream);

        // Default: enable tracks; UI toggles will disable them.
        const audioTracks = stream.getAudioTracks();
        const videoTracks = stream.getVideoTracks();
        if (audioTracks.length === 0 || videoTracks.length === 0) {
          setErrorMessage(
            "Camera and/or microphone not available in this browser.",
          );
          setConnectionState("error");
        }
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Unable to access camera/microphone.",
        );
        setConnectionState("error");
      }
    }

    void setup();

    return () => {
      cancelled = true;

      // Cleanup peer connection & media.
      pcRef.current?.close();
      pcRef.current = null;

      bcRef.current?.close();
      bcRef.current = null;

      pendingCandidatesRef.current = [];
      startedOfferRef.current = false;
      tracksAddedRef.current = false;

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      localStreamRef.current = null;
    };
  }, [displayName, peerId, roomId, signalChannelName]);

  // Start offer if we are the initiator.
  useEffect(() => {
    const pc = pcRef.current;
    const stream = localStream;

    if (!pc || !stream || !remotePeerId) return;
    if (startedOfferRef.current) return;

    const isInitiator = peerId < remotePeerId;
    if (!isInitiator) return;

    startedOfferRef.current = true;
    setConnectionState("connecting");

    void (async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        bcRef.current?.postMessage({
          type: "offer",
          roomId,
          peerId,
          sdp: { type: offer.type, sdp: offer.sdp ?? "" },
        } satisfies SignalingMessage);
      } catch (e) {
        console.error("Failed to create offer", e);
        setConnectionState("idle");
      }
    })();
  }, [localStream, peerId, roomId, remotePeerId]);

  const toggleAudioMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;

    const next = !audioTrack.enabled;
    audioTrack.enabled = next;
    setIsAudioMuted(!next);
  };

  const toggleVideoMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;

    const next = !videoTrack.enabled;
    videoTrack.enabled = next;
    setIsVideoMuted(!next);
  };

  const toggleScreenShare = async () => {
    const pc = pcRef.current;
    if (!pc) return;

    // If already sharing, stop it
    if (screenStreamRef.current) {
      const originalTrack = originalVideoTrackRef.current;
      if (originalTrack) {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) {
          await sender.replaceTrack(originalTrack);
        }
      }
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      originalVideoTrackRef.current = null;
      setScreenStream(null);
      setIsScreenSharing(false);
      return;
    }

    // Start screen sharing
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const screenTrack = display.getVideoTracks()[0];
      if (!screenTrack) {
        display.getTracks().forEach((t) => t.stop());
        return;
      }

      // Save the original camera track so we can restore it later
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender) {
        originalVideoTrackRef.current = sender.track;
        await sender.replaceTrack(screenTrack);
      }

      screenStreamRef.current = display;
      setScreenStream(display);
      setIsScreenSharing(true);

      // Handle browser's native "Stop sharing" button
      screenTrack.addEventListener("ended", () => {
        const orig = originalVideoTrackRef.current;
        if (orig) {
          const s = pcRef.current
            ?.getSenders()
            .find((snd) => snd.track?.kind === "video" || snd.track === screenTrack);
          if (s) {
            void s.replaceTrack(orig);
          }
        }
        display.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
        originalVideoTrackRef.current = null;
        setScreenStream(null);
        setIsScreenSharing(false);
      });
    } catch {
      // User cancelled the screen picker — do nothing
    }
  };

  const leaveCall = () => {
    // Broadcast "leave" so the other side can reset UI.
    bcRef.current?.postMessage({
      type: "leave",
      roomId,
      peerId,
    } satisfies SignalingMessage);

    // Close peer connection and stop local tracks.
    pcRef.current?.close();
    pcRef.current = null;

    bcRef.current?.close();
    bcRef.current = null;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    localStreamRef.current = null;

    // Stop screen share if active
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    originalVideoTrackRef.current = null;
    setScreenStream(null);
    setIsScreenSharing(false);

    remotePeerIdRef.current = null;
    setRemotePeerId(null);
    setRemoteName("Participant");
    pendingCandidatesRef.current = [];
    startedOfferRef.current = false;
    tracksAddedRef.current = false;

    setLocalStream(null);
    setRemoteStream(null);
    setConnectionState("idle");
  };

  // Keep derived UI toggles synced with current track state.
  useEffect(() => {
    const stream = localStream;
    if (!stream) return;

    const audioEnabled = stream.getAudioTracks().some((t) => t.enabled);
    const videoEnabled = stream.getVideoTracks().some((t) => t.enabled);

    setIsAudioMuted(!audioEnabled);
    setIsVideoMuted(!videoEnabled);
  }, [localStream]);

  return {
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
  };
}

