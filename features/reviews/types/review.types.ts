export interface ReviewerInfo {
  FullName: string;
  ProfileImageURL: string | null;
}

export interface Review {
  ReviewID: string;
  SessionID: string;
  ReviewerID: string;
  RevieweeID: string;
  Rating: number;
  Comment: string | null;
  IsMentorReview: boolean;
  Tags: string[];
  IsPublic: boolean;
  CreatedAt: string;
  UpdatedAt: string;

  // Joined properties from backend
  ReviewerName?: string;
  ReviewerImage?: string | null;
  SessionTitle?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewsPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface GetReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    stats: ReviewStats;
    pagination: ReviewsPagination;
  };
}

export interface GetReviewStatsResponse {
  success: boolean;
  data: ReviewStats;
}

export interface SubmitReviewPayload {
  rating: number;
  comment?: string;
  tags?: string[];
  isPublic?: boolean;
}