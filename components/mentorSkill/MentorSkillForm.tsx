"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMentorSkillSchema, AddMentorSkillFormValues } from "@/zod/skill";
import { MentorSkill } from "@/types/skill";
import { useAddMentorSkill } from "@/features/mentorSkill/hooks/useAddMentorSkill";
import { useUpdateMentorSkill } from "@/features/mentorSkill/hooks/useUpdateMentorSkill";
import { useGetAllSkillCategories } from "@/features/skillCategory/hooks/useGetAllSkillCategory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface MentorSkillFormProps {
  skill?: MentorSkill | null;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const experienceLevels = [
  { value: "1", label: "Beginner (1)" },
  { value: "2", label: "Intermediate (2)" },
  { value: "3", label: "Advanced (3)" },
  { value: "4", label: "Expert (4)" },
  { value: "5", label: "Master (5)" },
];

const teachingStyles = [
  { value: "flexible", label: "Flexible" },
  { value: "structured", label: "Structured" },
  { value: "hands-on", label: "Hands-On" },
  { value: "theoretical", label: "Theoretical" },
  { value: "mentoring", label: "Mentoring" },
];

export const MentorSkillForm = ({
  skill,
  onCancel,
  onSuccess,
}: MentorSkillFormProps) => {
  const isEditMode = !!skill;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddMentorSkillFormValues>({
    resolver: zodResolver(addMentorSkillSchema),
    defaultValues: {
      name: skill?.Name || "",
      description: skill?.Description || "",
      detailedContent: skill?.DetailedContent || "",
      skillCategoryId: skill?.SkillCategoryID || "",
      experienceLevel: skill?.ExperienceLevel?.toString() || "",
      teachingStyle: skill?.TeachingStyle || "",
    },
  });

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllSkillCategories({ limit: 100 });

  const addMutation = useAddMentorSkill({
    onSuccess: () => onSuccess?.(),
  });

  const updateMutation = useUpdateMentorSkill({
    onSuccess: () => onSuccess?.(),
  });

  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: AddMentorSkillFormValues) => {
    if (isEditMode && skill) {
      updateMutation.mutate({
        skillId: skill.SkillID,
        data,
      });
    } else {
      addMutation.mutate(data);
    }
  };

  const categories = categoriesData?.data?.categories || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Update Skill" : "Add New Skill"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Skill Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input
              id="name"
              placeholder="e.g. Frontend Development"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of the skill"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Detailed Content */}
          <div className="space-y-2">
            <Label htmlFor="detailedContent">Detailed Content</Label>
            <Textarea
              id="detailedContent"
              placeholder="Detailed information about this skill..."
              rows={4}
              {...register("detailedContent")}
            />
            {errors.detailedContent && (
              <p className="text-sm text-destructive">
                {errors.detailedContent.message}
              </p>
            )}
          </div>

          {/* Skill Category */}
          <div className="space-y-2">
            <Label htmlFor="skillCategoryId">Category</Label>
            <Select
              value={watch("skillCategoryId")}
              onValueChange={(value) => setValue("skillCategoryId", value)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    categoriesLoading
                      ? "Loading categories..."
                      : "Select a category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category.SkillCategoryID}
                    value={category.SkillCategoryID}
                  >
                    {category.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.skillCategoryId && (
              <p className="text-sm text-destructive">
                {errors.skillCategoryId.message}
              </p>
            )}
          </div>

          {/* Experience Level & Teaching Style */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select
                value={watch("experienceLevel")}
                onValueChange={(value) => setValue("experienceLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.experienceLevel && (
                <p className="text-sm text-destructive">
                  {errors.experienceLevel.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="teachingStyle">Teaching Style</Label>
              <Select
                value={watch("teachingStyle")}
                onValueChange={(value) => setValue("teachingStyle", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {teachingStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.teachingStyle && (
                <p className="text-sm text-destructive">
                  {errors.teachingStyle.message}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditMode ? "Update Skill" : "Add Skill"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
