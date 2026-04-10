import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, BookOpen, Clock, User, Loader2 } from "lucide-react";
import MentorAvatar from "./MentorAvatar";
import { useGetUserReviewStats } from "@/features/reviews/hooks/useReviews";

interface MentorCardProps {
  id: string;
  fullName: string;
  bio: string | null;
  profileImage: string | null;
  avgRating: string;
  totalReviews: string;
  skillCount: string;
  skills: Array<{
    SkillID: string;
    Name: string;
    ExperienceLevel: number;
  }>;
}

export default function MentorCard({
  id,
  fullName,
  bio,
  profileImage,
  avgRating,
  totalReviews,
  skillCount,
  skills,
}: MentorCardProps) {
  const { data: statsData, isLoading: isLoadingStats } = useGetUserReviewStats(id);

  const displayRating = statsData?.data?.averageRating 
    ? statsData.data.averageRating.toFixed(1)
    : avgRating;
    
  const displayTotalReviews = statsData?.data?.totalReviews !== undefined
    ? statsData.data.totalReviews
    : totalReviews;

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const colors = [
    "blue",
    "green",
    "purple",
    "pink",
    "amber",
    "teal",
    "indigo",
    "rose",
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const getFullImageUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <Card className="group h-full flex flex-col hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
      <div className="p-6 flex flex-col h-full">
        {/* Header with Avatar and Rating */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4 items-center">
            {profileImage ? (
              <img
                src={getFullImageUrl(profileImage)}
                alt={fullName}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/10"
              />
            ) : (
              <MentorAvatar initials={initials} color={randomColor} size="lg" />
            )}
            <div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {fullName}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {isLoadingStats ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-1" />
                ) : (
                  <>
                    <span className="text-sm font-semibold">{displayRating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({displayTotalReviews} reviews)
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="px-2 py-1 flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3" />
            {skillCount} Skills
          </Badge>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 min-h-[40px]">
          {bio ||
            "Experienced mentor dedicated to helping learners reach their full potential through personalized guidance."}
        </p>

        {/* Skills Preview */}
        <div className="flex flex-wrap gap-2 mb-6">
          {skills.slice(0, 3).map((skill) => (
            <Badge
              key={skill.SkillID}
              variant="outline"
              className="bg-primary/5 border-primary/10 hover:bg-primary/10 transition-colors"
            >
              {skill.Name}
            </Badge>
          ))}
          {skills.length > 3 && (
            <span className="text-xs text-muted-foreground flex items-center">
              +{skills.length - 3} more
            </span>
          )}
        </div>

        {/* Footer/Action */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Available</span>
            </div>
          </div>
          <Link href={`/skills/mentor-profile/${id}`}>
            <Button size="sm" className="rounded-full px-6 cursor-pointer">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}