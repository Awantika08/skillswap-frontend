"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "@/zod/auth";
import { useForgotPassword } from "@/hooks/useForgotPassword";

export default function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
      onError: (error) => {
        const message = error.message.toLowerCase();
        if (message.includes("email")) {
          setError("email", { message: error.message });
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <h2 className="text-3xl text-foreground font-semibold">Forgot Password</h2>
        <p className="text-muted-foreground">
          {isSubmitted
            ? "Check your email for a password reset link."
            : "Enter your email address and we'll send you a link to reset your password."}
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@company.com"
              className={`h-12 ${errors.email ? "border-red-500" : ""}`}
              {...register("email")}
              disabled={forgotPasswordMutation.isPending}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? "Sending link..." : "Send Reset Link"}
          </Button>

          {/* API Error Message */}
          {forgotPasswordMutation.isError && !errors.email && (
            <p className="text-sm text-red-500 text-center">
              {forgotPasswordMutation.error?.message || "Failed to send reset link."}
            </p>
          )}
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-center text-gray-600 bg-green-50 p-4 rounded-md border border-green-100">
            If an account exists for that email, we have sent a password reset link. Please check your inbox and spam folders.
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full h-12"
            onClick={() => setIsSubmitted(false)}
          >
            Try another email
          </Button>
        </div>
      )}

      {/* Links */}
      <div className="pt-4 flex justify-center">
        <Link 
          href="/login"
          className="flex items-center gap-2 font-medium text-blue-500 hover:text-blue-600 hover:underline text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
