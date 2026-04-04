import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Star, StarHalf, StarOff } from "lucide-react";
import { DashboardStats } from "@/types/adminDashboard";

interface ReviewsSectionProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function ReviewsSection({ stats, isLoading }: ReviewsSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalReviews = parseInt(stats?.reviews.total_reviews || "0");
  const avgRating = parseFloat(stats?.reviews.avg_rating || "0");
  const sessionsReviewed = parseInt(stats?.reviews.sessions_reviewed || "0");
  
  const ratings = [
    { stars: 5, count: parseInt(stats?.reviews.five_star || "0") },
    { stars: 4, count: parseInt(stats?.reviews.four_star || "0") },
    { stars: 3, count: parseInt(stats?.reviews.three_star || "0") },
    { stars: 2, count: parseInt(stats?.reviews.two_star || "0") },
    { stars: 1, count: parseInt(stats?.reviews.one_star || "0") },
  ];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) return <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />;
          if (i === fullStars && hasHalfStar) return <StarHalf key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />;
          return <StarOff key={i} className="h-3.5 w-3.5 text-gray-300" />;
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          Reviews & Ratings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Average Rating */}
        <div className="text-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-1">
            {renderStars(avgRating)}
            <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
          </div>
          <p className="text-xs text-gray-600">
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {sessionsReviewed} sessions reviewed
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratings.map((rating) => {
            const percentage = totalReviews > 0 ? (rating.count / totalReviews) * 100 : 0;
            return (
              <div key={rating.stars} className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-xs">{rating.stars}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="text-xs text-gray-500 w-10">{rating.count}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}