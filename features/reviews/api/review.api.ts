import api from "@/lib/api";
import { ReviewInput } from "../zod/review.schema";
import { GetReviewsResponse, GetReviewStatsResponse, Review } from "../types/review.types";

export const reviewApi = {
  // Submit a review for a session
  submitReview: async (sessionId: string, data: ReviewInput): Promise<Review> => {
    const response = await api.post(`/reviews/sessions/${sessionId}/reviews`, data);
    return response.data.data;
  },

  // Get my reviews (reviews I received)
  getMyReviews: async (page: number = 1, limit: number = 10): Promise<GetReviewsResponse> => {
    const response = await api.get(`/reviews/my-reviews`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get public reviews for a specific user
  getUserReviews: async (userId: string, page: number = 1, limit: number = 10): Promise<GetReviewsResponse> => {
    const response = await api.get(`/reviews/users/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get review stats for a specific user
  getUserReviewStats: async (userId: string): Promise<GetReviewStatsResponse> => {
    const response = await api.get(`/reviews/users/${userId}/stats`);
    return response.data;
  },
};
