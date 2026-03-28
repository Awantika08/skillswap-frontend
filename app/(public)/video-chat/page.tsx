"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { Copy, Wand2 } from "lucide-react";

function createRoomId() {
  // Short, human-friendly room id.
  return Math.random().toString(36).slice(2, 8).toLowerCase();
}

export default function VideoChatJoinPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [roomId, setRoomId] = useState("");
  const [displayName, setDisplayName] = useState(user?.name ?? "");

  const roomLink = useMemo(() => {
    if (!roomId) return "";
    return `/video-chat/${roomId}`;
  }, [roomId]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Video Chat</h1>
          <p className="text-sm text-muted-foreground">
            Open the same room id in another tab to test the call UI.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Your name
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. John"
              aria-label="Display name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Room ID
            </label>
            <div className="flex gap-2">
              <Input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.replace(/\s+/g, ""))}
                placeholder="e.g. ab12cd"
                aria-label="Room id"
              />
              <Button
                type="button"
                variant="secondary"
                className="shrink-0"
                onClick={() => setRoomId(createRoomId())}
                aria-label="Generate room id"
              >
                <Wand2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {roomLink ? (
            <div className="flex items-center gap-2">
              <Input value={roomLink} readOnly className="bg-muted/30" />
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(roomLink);
                  } catch {
                    // ignore
                  }
                }}
                aria-label="Copy room link"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          ) : null}

          <Button
            type="button"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold"
            onClick={() => {
              const trimmedRoom = roomId.trim().toLowerCase();
              if (!trimmedRoom) return;
              const name = displayName.trim() || "Guest";
              router.push(`/video-chat/${trimmedRoom}?name=${encodeURIComponent(name)}`);
            }}
          >
            Join room
          </Button>
        </div>
      </Card>
    </div>
  );
}

