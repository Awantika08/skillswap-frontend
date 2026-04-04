"use client";

import React from "react";
import { MentorSkill } from "@/types/skill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToggleMentorSkill } from "@/features/mentorSkill/hooks/useToggleMentorSkill";

interface MentorSkillCardProps {
  skill: MentorSkill;
  onEdit: (skill: MentorSkill) => void;
}

const experienceLabelMap: Record<number, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
  4: "Expert",
  5: "Master",
};

export const MentorSkillCard = ({ skill, onEdit }: MentorSkillCardProps) => {
  const { mutate: toggleSkill, isPending } = useToggleMentorSkill();

  const handleToggle = (checked: boolean) => {
    toggleSkill({
      skillId: skill.SkillID,
      isAvailable: checked,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-lg">{skill.Name}</CardTitle>
          <p className="text-sm text-muted-foreground">{skill.Description}</p>
        </div>
        <div className="flex items-center gap-2">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Switch
              checked={skill.IsAvailable}
              onCheckedChange={handleToggle}
              disabled={isPending}
              aria-label="Toggle availability"
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(skill)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Detailed Content */}
        {skill.DetailedContent && (
          <p className="text-sm text-muted-foreground">
            {skill.DetailedContent}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1">
            <BookOpen className="h-3 w-3" />
            {skill.CategoryName}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <GraduationCap className="h-3 w-3" />
            {experienceLabelMap[skill.ExperienceLevel] ||
              `Level ${skill.ExperienceLevel}`}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {skill.TeachingStyle}
          </Badge>
          {skill.IsAvailable ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              Available
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Unavailable</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
