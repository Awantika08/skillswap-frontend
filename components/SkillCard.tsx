import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MentorAvatar from "./MentorAvatar";

interface SkillCardProps {
  id: string;
  title: string;
  description: string;
  mentorName: string;
  mentorInitials: string;
  mentorColor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
}

export default function SkillCard({
  id,
  title,
  description,
  mentorName,
  mentorInitials,
  mentorColor,
  level,
  category,
}: SkillCardProps) {
  const levelColors = {
    Beginner: "bg-blue-100 text-blue-800 border-blue-200",
    Intermediate: "bg-amber-100 text-amber-800 border-amber-200",
    Advanced: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <MentorAvatar initials={mentorInitials} color={mentorColor} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {mentorName}
            </p>
            <p className="text-xs text-muted-foreground">Mentor</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <Badge className={`text-xs border ${levelColors[level]}`}>
            {level}
          </Badge>
        </div>

        <div className="mt-auto">
          <Link href={`/skills/${id}`} className="w-full">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
