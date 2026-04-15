"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function MentorVideoCallRedirect() {
  const { sessionId } = useParams() as { sessionId: string };
  const router = useRouter();

  useEffect(() => {
    // Redirect to the clean meeting route
    router.replace(`/meeting/${sessionId}`);
  }, [sessionId, router]);

  return (
    <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-zinc-500 font-medium">Redirecting to meeting room...</p>
    </div>
  );
}
