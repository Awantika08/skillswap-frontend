"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function LearnerVideoCallContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") || "";
  const router = useRouter();

  useEffect(() => {
    // Redirect to the clean meeting route
    if (sessionId) {
      router.replace(`/meeting?sessionId=${sessionId}`);
    }
  }, [sessionId, router]);

  return (
    <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-zinc-500 font-medium">Redirecting to meeting room...</p>
    </div>
  );
}

export default function LearnerVideoCallRedirect() {
  return (
    <Suspense fallback={
      <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-zinc-500 font-medium">Redirecting to meeting room...</p>
      </div>
    }>
      <LearnerVideoCallContent />
    </Suspense>
  );
}
