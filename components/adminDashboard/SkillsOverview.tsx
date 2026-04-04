import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Tag, Users, Layers } from "lucide-react";
import { DashboardStats } from "@/types/adminDashboard";

interface SkillsOverviewProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function SkillsOverview({ stats, isLoading }: SkillsOverviewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalSkills = parseInt(stats?.skills.total_skills || "0");
  const availableSkills = parseInt(stats?.skills.available_skills || "0");
  const categories = parseInt(stats?.skills.total_categories || "0");
  const mentorsWithSkills = parseInt(stats?.skills.mentors_with_skills || "0");
  const totalMentors = parseInt(stats?.users.total_mentors || "0");
  
  const skillsUtilization = totalMentors > 0 ? (mentorsWithSkills / totalMentors) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Skills Ecosystem
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3">
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
              <Layers className="h-3 w-3" />
              Total Skills
            </div>
            <p className="text-xl font-bold text-purple-600">{totalSkills}</p>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-950/30 rounded-lg p-3">
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
              <Tag className="h-3 w-3" />
              Categories
            </div>
            <p className="text-xl font-bold text-cyan-600">{categories}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Available Skills</span>
            <span className="font-medium">{availableSkills}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Mentors with Skills</span>
            <span className="font-medium">{mentorsWithSkills}/{totalMentors}</span>
          </div>
          <Progress value={skillsUtilization} className="h-2" />
          <p className="text-xs text-gray-500 text-center">
            {skillsUtilization.toFixed(0)}% of mentors have listed skills
          </p>
        </div>
      </CardContent>
    </Card>
  );
}