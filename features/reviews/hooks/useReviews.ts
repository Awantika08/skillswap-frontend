import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "../api/review.api";
import { ReviewInput } from "../zod/review.schema";
import { toast } from "sonner";

// Hook to get authenticated user's reviews
export const useGetMyReviews = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["my-reviews", page, limit],
    queryFn: () => reviewApi.getMyReviews(page, limit),
  });
};

// Hook to get public user's reviews
export const useGetUserReviews = (userId?: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["user-reviews", userId, page, limit],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return reviewApi.getUserReviews(userId, page, limit);
    },
    enabled: !!userId,
  });
};

// Hook to get user review stats
export const useGetUserReviewStats = (userId?: string) => {
  return useQuery({
    queryKey: ["user-review-stats", userId],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return reviewApi.getUserReviewStats(userId);
    },
    enabled: !!userId,
  });
};

// Hook to submit a review
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: ReviewInput }) =>
      reviewApi.submitReview(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["user-review-stats"] });
    },
    onError: (error: any) => {
      console.error("Submit review error:", error);
      toast.error(error.response?.data?.errors?.[0]?.message || "Failed to submit review");
    },
  });
};
