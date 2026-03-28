"use client";

import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillCategoryTable } from "@/components/skill-category/SkillCategoryTable";
import { SkillCategoryFilters } from "@/components/skill-category/SkillCategoryFilter";
import { useGetAllSkillCategories } from "@/features/skillCategory/hooks/useGetAllSkillCategory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateSkillCategoryDialog } from "@/components/skill-category/CreateSKillCategoryDialog";

export default function SkillCategoryPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading, error, refetch } = useGetAllSkillCategories({
    page: currentPage,
    limit: pageSize,
    sortBy: "name",
    sortOrder: "asc",
  });

  const categories = data?.data?.categories || [];

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          category.Name.toLowerCase().includes(term) ||
          (category.Description || "").toLowerCase().includes(term)
        );
      }),
    [categories, searchTerm],
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Skill Categories
          </h1>
          <p className="text-muted-foreground">
            Manage your skill categories for mentors and learners
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Skill Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <SkillCategoryFilters
            onSearch={handleSearch}
            onPageSizeChange={handlePageSizeChange}
            pageSize={pageSize}
          />

          {/* Table */}
          <SkillCategoryTable
            data={filteredCategories}
            isLoading={isLoading}
            error={error as Error}
            onRefetch={refetch}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <CreateSkillCategoryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
