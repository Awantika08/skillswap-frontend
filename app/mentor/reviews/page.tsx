"use client";

import React, { useState } from "react";
import { useGetMyReviews } from "@/features/reviews/hooks/useReviews";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { ReviewStatsOverview } from "@/features/reviews/components/ReviewStats";
import { Loader2 } from "lucide-react";

export default function MentorReviewsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetMyReviews(page, 10);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          My Reviews
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          See what learners are saying about your sessions.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : data?.data?.stats ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ReviewStatsOverview stats={data.data.stats} />
          <div className="pt-2">
            <h3 className="text-xl font-bold mb-4">Recent Reviews</h3>
            <ReviewList data={data} isLoading={isLoading} onPageChange={setPage} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
