"use client";

import React, { useEffect } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updateSkillCategorySchema,
  UpdateSkillCategoryFormValues,
} from "@/zod/skillCategory";
import { SkillCategory } from "@/types/skillCategory";
import { useUpdateSkillCategory } from "@/features/skillCategory/hooks/useUpdateSkillCategory";

interface EditSkillCategoryDialogProps {
  category: SkillCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditSkillCategoryDialog({
  category,
  open,
  onOpenChange,
  onSuccess,
}: EditSkillCategoryDialogProps) {
  const updateMutation = useUpdateSkillCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateSkillCategoryFormValues>({
    resolver: zodResolver(
      updateSkillCategorySchema,
    ) as Resolver<UpdateSkillCategoryFormValues>,
    defaultValues: {
      name: category?.Name || "",
      description: category?.Description || "",
    },
  });

  // Update form values when category changes
  useEffect(() => {
    if (category) {
      reset({
        name: category.Name,
        description: category.Description,
      });
    }
  }, [category, reset]);

  const onSubmit = (data: UpdateSkillCategoryFormValues) => {
    if (!category) return;

    updateMutation.mutate(
      { id: category.SkillCategoryID, data },
      {
        onSuccess: (response) => {
          if (response.success) {
            onOpenChange(false);
            onSuccess?.();
          }
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Don't reset to empty, but back to original values if closed
      if (category) {
        reset({
          name: category.Name,
          description: category.Description,
        });
      }
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Skill Category</DialogTitle>
          <DialogDescription>
            Update the category information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-name"
              placeholder="e.g., Business & Management"
              {...register("name")}
              disabled={updateMutation.isPending}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Enter category description..."
              rows={4}
              {...register("description")}
              disabled={updateMutation.isPending}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600 font-medium"
            >
              {updateMutation.isPending ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
