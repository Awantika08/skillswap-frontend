"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetUserById } from "@/features/user/hooks/useGetUserById";
import { UpdateUserForm } from "@/components/user/UpdateUserForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, UserCog, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditUserPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const { data, isLoading, error } = useGetUserById(id);
  const user = data?.data;

  const handleBack = () => {
    router.back();
  };

  const onSuccess = () => {
    router.push("/admin/users");
  };

  return (
    <div className="container ml-8 max-w-6xl py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Breadcrumbs/Back */}
      <div className="flex flex-col gap-4">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="w-fit -ml-4 text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to User List
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <UserCog className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Manage User</h1>
            <p className="text-muted-foreground font-medium">Update account information and permissions</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12 bg-destructive/5 rounded-3xl border border-destructive/10 text-center gap-4">
            <div className="p-4 rounded-full bg-destructive/10 text-destructive">
              <ShieldAlert className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-destructive">Failed to load user data</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                {error instanceof Error ? error.message : "Something went wrong while fetching the user details."}
              </p>
            </div>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
              Try Refreshing Page
            </Button>
          </div>
        ) : user ? (
          <UpdateUserForm 
            user={user} 
            onCancel={handleBack} 
            onSuccess={onSuccess} 
          />
        ) : null}
      </div>
    </div>
  );
}
