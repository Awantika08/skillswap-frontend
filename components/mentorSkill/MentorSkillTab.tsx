"use client";

import React, { useState } from "react";
import { useGetMentorSkills } from "@/features/mentorSkill/hooks/useGetMentorSkills";
import { MentorSkill } from "@/types/skill";
import { MentorSkillCard } from "./MentorSkillCard";
import { MentorSkillForm } from "./MentorSkillForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, BookOpen } from "lucide-react";

export const MentorSkillTab = () => {
  const { data, isLoading, error, refetch } = useGetMentorSkills();
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<MentorSkill | null>(null);

  const skills = data?.data || [];

  const handleEdit = (skill: MentorSkill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error.message}
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Show form when editing or adding
  if (showForm) {
    return (
      <MentorSkillForm
        skill={editingSkill}
        onCancel={handleCancel}
        onSuccess={handleFormSuccess}
      />
    );
  }

  // No skills — show add section
  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No Skills Added Yet</h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Add your first skill to let students know what you can teach.
        </p>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Skill
        </Button>
      </div>
    );
  }

  // Skills exist — show list
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Your Skills ({skills.length})
        </h3>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((skill) => (
          <MentorSkillCard
            key={skill.SkillID}
            skill={skill}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
};
