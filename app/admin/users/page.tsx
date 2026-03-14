"use client";

import React, { useMemo, useState } from "react";
import { useGetAllUsers } from "@/features/user/hooks/useGetAllUsers";
import { UserTable } from "@/components/user/UserTable";
import { UserFilters } from "@/components/user/UserFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data, isLoading, error, refetch } = useGetAllUsers({
    page,
    limit,
    sortBy: "CreatedAt",
    sortOrder: "desc",
  });

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination;

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  const handleRoleChange = (role: string) => {
    setRoleFilter(role === "all" ? "" : role);
    setPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status === "all" ? "" : status);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesSearch = search
          ? user.FullName.toLowerCase().includes(search.toLowerCase()) ||
            user.Email.toLowerCase().includes(search.toLowerCase())
          : true;

        const matchesRole = roleFilter ? user.Role === roleFilter : true;
        const matchesStatus = statusFilter ? user.Status === statusFilter : true;

        return matchesSearch && matchesRole && matchesStatus;
      }),
    [users, search, roleFilter, statusFilter],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage all users in the system</p>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <UserFilters
            onSearch={handleSearch}
            onRoleChange={handleRoleChange}
            onStatusChange={handleStatusChange}
            roleValue={roleFilter}
            statusValue={statusFilter}
          />

          {/* Table */}
          <UserTable
            users={filteredUsers}
            pagination={pagination}
            onPageChange={handlePageChange}
            currentPage={page}
            isLoading={isLoading}
            error={error as Error}
            onRetry={refetch}
          />
        </CardContent>
      </Card>
    </div>
  );
}
