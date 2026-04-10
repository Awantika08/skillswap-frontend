import React from "react";
import { ReviewStats } from "../types/review.types";
import { Star, MessageCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReviewStatsProps {
  stats: ReviewStats;
}

export function ReviewStatsOverview({ stats }: ReviewStatsProps) {
  const average = Number(stats.averageRating) || 0;
  const total = stats.totalReviews || 0;

  // Ensure distribution has default values if undefined
  const dist = stats.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  return (
    <Card className="p-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: Summary */}
        <div className="flex flex-col items-center justify-center min-w-[200px] border-r border-transparent md:border-gray-100 dark:md:border-gray-800 md:pr-8">
          <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
            {average.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(average)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-700"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mt-1">
            <MessageCircle className="w-4 h-4" />
            {total} {total === 1 ? "Review" : "Reviews"}
          </div>
        </div>

        {/* Right Side: Distribution */}
        <div className="flex-1 flex flex-col justify-center gap-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = (dist as any)[star] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 min-w-[40px] text-sm font-medium">
                  {star}{" "}
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress
                  value={percentage}
                  className="h-2.5 bg-gray-100 dark:bg-gray-800"
                  
                />
                <div className="min-w-[30px] text-xs text-gray-500 text-right">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}