"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, Resolver } from "react-hook-form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import {
  createSkillCategorySchema,
  CreateSkillCategoryFormValues,
  bulkCreateSkillCategorySchema,
  BulkCreateSkillCategoryFormValues,
} from "@/zod/skillCategory";
import { useCreateSkillCategory } from "@/features/skillCategory/hooks/useCreateSkillCategory";
import { useBulkCreateSkillCategory } from "@/features/skillCategory/hooks/useBulkCreateSkillCategory";

interface CreateSkillCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateSkillCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateSkillCategoryDialogProps) {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const createMutation = useCreateSkillCategory();
  const bulkCreateMutation = useBulkCreateSkillCategory();

  // Single Form
  const {
    register: registerSingle,
    handleSubmit: handleSubmitSingle,
    reset: resetSingle,
    formState: { errors: errorsSingle },
  } = useForm<CreateSkillCategoryFormValues>({
    resolver: zodResolver(
      createSkillCategorySchema,
    ) as Resolver<CreateSkillCategoryFormValues>,
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Bulk Form
  const {
    control,
    register: registerBulk,
    handleSubmit: handleSubmitBulk,
    reset: resetBulk,
    formState: { errors: errorsBulk },
  } = useForm<BulkCreateSkillCategoryFormValues>({
    resolver: zodResolver(
      bulkCreateSkillCategorySchema,
    ) as Resolver<BulkCreateSkillCategoryFormValues>,
    defaultValues: {
      categories: [{ name: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  const onSingleSubmit = (data: CreateSkillCategoryFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        resetSingle();
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  const onBulkSubmit = (data: BulkCreateSkillCategoryFormValues) => {
    bulkCreateMutation.mutate(data, {
      onSuccess: () => {
        resetBulk();
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetSingle();
      resetBulk();
      setActiveTab("single");
    }
    onOpenChange(open);
  };

  const isPending = createMutation.isPending || bulkCreateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Skill Categories</DialogTitle>
          <DialogDescription>
            Add a single skill category or multiple categories at once.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "single" | "bulk")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="single">Single Category</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Insert</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <form
              onSubmit={handleSubmitSingle(onSingleSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Business & Management"
                  {...registerSingle("name")}
                  disabled={isPending}
                  className={errorsSingle.name ? "border-red-500" : ""}
                />
                {errorsSingle.name && (
                  <p className="text-sm text-red-500">
                    {errorsSingle.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter category description..."
                  rows={4}
                  {...registerSingle("description")}
                  disabled={isPending}
                  className={errorsSingle.description ? "border-red-500" : ""}
                />
                {errorsSingle.description && (
                  <p className="text-sm text-red-500">
                    {errorsSingle.description.message}
                  </p>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isPending ? "Creating..." : "Create Category"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="bulk">
            <form
              onSubmit={handleSubmitBulk(onBulkSubmit)}
              className="space-y-4"
            >
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border rounded-lg space-y-3 relative group"
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">
                        Category #{index + 1}
                      </Label>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <div className="space-y-1">
                        <Input
                          placeholder="Category Name"
                          {...registerBulk(`categories.${index}.name` as const)}
                          disabled={isPending}
                          className={
                            errorsBulk.categories?.[index]?.name
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errorsBulk.categories?.[index]?.name && (
                          <p className="text-xs text-red-500">
                            {errorsBulk.categories[index]?.name?.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Textarea
                          placeholder="Description (Optional)"
                          rows={2}
                          {...registerBulk(
                            `categories.${index}.description` as const,
                          )}
                          disabled={isPending}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() => append({ name: "", description: "" })}
                disabled={isPending}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Another Category
              </Button>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isPending ? "Bulk Creating..." : "Create All Categories"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
