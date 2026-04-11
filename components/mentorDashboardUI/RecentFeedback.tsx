import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useGetMyReviews } from "@/features/reviews/hooks/useReviews";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { getFullImageUrl } from "@/lib/utils";

export default function RecentFeedback() {
  const { data: response, isLoading, isError } = useGetMyReviews(1, 2);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Recent Feedback
        </h2>
        <Card className="p-5 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={
                  i !== 2
                    ? "border-b border-gray-100 dark:border-gray-800 pb-5"
                    : ""
                }
              >
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-3 w-12 mt-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
        Failed to load feedback. Please try again later.
      </div>
    );
  }

  const feedbacks = response?.data?.reviews || [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        Recent Feedback
      </h2>

      <Card className="p-5 border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
        <div className="space-y-6">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => (
              <div
                key={feedback.ReviewID}
                className={
                  index !== feedbacks.length - 1
                    ? "border-b border-gray-100 dark:border-gray-800 pb-5"
                    : ""
                }
              >
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={getFullImageUrl(feedback.ReviewerImage)}
                      alt={feedback.ReviewerName}
                    />
                    <AvatarFallback>
                      {feedback.ReviewerName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                      {feedback.ReviewerName || "SkillSwapper"}
                    </h4>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < feedback.Rating ? "fill-rose-400 text-rose-400" : "fill-gray-200 text-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {feedback.Comment || "No comment provided."}
                </p>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">
                  {format(new Date(feedback.CreatedAt), "MMM dd")}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">No feedback received yet.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
