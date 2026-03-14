"use client";

import React from "react";
import { SearchInput } from "../common/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SkillCategoryFiltersProps {
  onSearch: (term: string) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;
}

export function SkillCategoryFilters({
  onSearch,
  onPageSizeChange,
  pageSize,
}: SkillCategoryFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <SearchInput onSearch={onSearch} placeholder="Search categories..." />
      </div>
      <div className="w-full sm:w-48">
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
