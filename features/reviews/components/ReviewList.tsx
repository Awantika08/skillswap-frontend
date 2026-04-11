import React from "react";
import { Review, GetReviewsResponse } from "../types/review.types";
import { Star, MessageCircle, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface ReviewListProps {
  data: GetReviewsResponse | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function ReviewList({ data, isLoading, onPageChange }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const reviews = data?.data?.reviews || [];
  const pagination = data?.data?.pagination;

  if (reviews.length === 0) {
    return (
      <Card className="p-16 text-center bg-white dark:bg-gray-900 border-dashed">
        <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
        <p className="text-gray-500">Looks like there are no reviews to show right now.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {reviews.map((review) => (
          <Card key={review.ReviewID} className="p-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:border-primary/20">
            <div className="flex gap-5">
              <Avatar className="h-12 w-12 border border-gray-100 dark:border-gray-800">
                <AvatarImage src={review.ReviewerImage || ""} />
                <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                  {review.ReviewerName ? review.ReviewerName.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h4 className="font-bold text-base">{review.ReviewerName}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(review.CreatedAt), "MMM dd, yyyy")}
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= review.Rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200 dark:text-gray-800"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs font-bold text-gray-500">
                    &bull; {review.SessionTitle || "SkillSwap Session"}
                  </span>
                </div>

                {review.Comment && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    "{review.Comment}"
                  </p>
                )}

                {review.Tags && review.Tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {review.Tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium border-0 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <div className="text-sm font-medium text-gray-500">
            Page {pagination.page} of {pagination.pages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
