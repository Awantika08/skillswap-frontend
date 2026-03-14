"use client";

import React, { useState } from "react";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { SkillCategory } from "@/types/skillCategory";
import { DataTable } from "../common/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SkillCategoryTableProps {
  data: SkillCategory[];
  isLoading: boolean;
  error: Error | null;
  onRefetch: () => void;
}

export function SkillCategoryTable({
  data,
  isLoading,
  error,
  onRefetch,
}: SkillCategoryTableProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<SkillCategory | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = (category: SkillCategory) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (category: SkillCategory) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const columns = [
    {
      key: "Name",
      header: "Name",
      cell: (item: SkillCategory) => (
        <div className="font-medium">{item.Name}</div>
      ),
    },
    {
      key: "Description",
      header: "Description",
      cell: (item: SkillCategory) => (
        <div className="max-w-md truncate">{item.Description}</div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item: SkillCategory) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleEdit(item)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(item)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error}
        onRetry={onRefetch}
        emptyMessage="No skill categories found"
      />
    </>
  );
}
