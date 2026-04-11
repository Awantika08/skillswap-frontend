"use client";

import React from "react";
import { format } from "date-fns";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/common/DataTable";
import { User, PaginationInfo } from "@/types/user";
import { getFullImageUrl } from "@/lib/utils";

interface UserTableProps {
  users: User[];
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function UserTable({
  users,
  pagination,
  onPageChange,
  currentPage = 1,
  isLoading = false,
  error = null,
  onRetry,
}: UserTableProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "secondary";
      case "Suspended":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "default";
      case "Mentor":
        return "secondary";
      case "Learner":
        return "outline";
      default:
        return "outline";
    }
  };


  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const columns = [
    {
      key: "user",
      header: "User",
      cell: (item: User) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getFullImageUrl(item.ProfileImageURL)} />
            <AvatarFallback>{getInitials(item.FullName)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{item.FullName}</span>
        </div>
      ),
    },
    {
      key: "Email",
      header: "Email",
      cell: (item: User) => item.Email,
    },
    {
      key: "Role",
      header: "Role",
      cell: (item: User) => (
        <Badge variant={getRoleBadgeVariant(item.Role)}>{item.Role}</Badge>
      ),
    },
    {
      key: "Status",
      header: "Status",
      cell: (item: User) => (
        <Badge variant={getStatusBadgeVariant(item.Status)}>
          {item.Status}
        </Badge>
      ),
    },
    {
      key: "CreatedAt",
      header: "Joined",
      cell: (item: User) => format(new Date(item.CreatedAt), "MMM dd, yyyy"),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${item.UserID}/edit`} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        emptyMessage="No users found"
      />
    </div>
  );
}
