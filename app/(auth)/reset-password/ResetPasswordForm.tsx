"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordSchema, ResetPasswordFormValues } from "@/zod/auth";
import { useResetPassword, useValidateResetToken } from "@/hooks/useResetPassword";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const resetPasswordMutation = useResetPassword();
  const { isLoading: isValidating, error: validationError } = useValidateResetToken(token);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(
      {
        token,
        data: { newPassword: data.newPassword }
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error) => {
          const message = error.message.toLowerCase();
          if (message.includes("password")) {
            setError("newPassword", { message: error.message });
          } else if (message.includes("token")) {
            setError("root", { message: error.message });
          }
        },
      }
    );
  };

  if (!token || validationError) {
    return (
      <div className="space-y-6 text-center py-6">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-red-500" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-foreground">Invalid Link</h2>
        <p className="text-muted-foreground mt-2">
          {validationError?.message || "The password reset link is invalid or has expired."}
        </p>
        <Button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="w-full mt-6 h-12 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Request New Link
        </Button>
      </div>
    );
  }

  if (isValidating) {
    return (
      <div className="space-y-6 animate-pulse py-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mt-4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <h2 className="text-3xl text-foreground font-semibold">Reset Password</h2>
        <p className="text-muted-foreground">
          {isSuccess
            ? "Your password has been successfully reset."
            : "Enter your new password below to reset your account's password."}
        </p>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 text-center">{errors.root.message}</p>
            </div>
          )}

          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className={`h-12 pr-10 ${errors.newPassword ? "border-red-500" : ""}`}
                {...register("newPassword")}
                disabled={resetPasswordMutation.isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={resetPasswordMutation.isPending}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className={`h-12 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                {...register("confirmPassword")}
                disabled={resetPasswordMutation.isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={resetPasswordMutation.isPending}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <Button
            type="button"
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </Button>
        </div>
      )}
    </div>
  );
}
