"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, LoginFormValues } from "@/zod/auth";
import { useLogin } from "@/hooks/useLogin";

export default function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Handle redirect based on user role after successful login
  useEffect(() => {
    if (loginMutation.isSuccess && loginMutation.data?.user) {
      const role = loginMutation.data.user.role.toLowerCase();

      switch (role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "mentor":
          router.push("/mentor/dashboard");
          break;
        case "learner":
          router.push("/learner/dashboard");
          break;
        default:
          router.push("/dashboard");
      }
    }
  }, [loginMutation.isSuccess, loginMutation.data, router]);

  // Handle API errors and set them to form fields
  useEffect(() => {
    if (loginMutation.isError) {
      const error = loginMutation.error;
      const message = error.message || "Login failed";

      if (message.toLowerCase().includes("email")) {
        setError("email", { message });
      } else if (message.toLowerCase().includes("password")) {
        setError("password", { message });
      }
    }
  }, [loginMutation.isError, loginMutation.error, setError]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-3xl text-foreground font-semibold">Welcome Back</h2>
        <p className="text-muted-foreground">
          Enter your email and password to access your account.
        </p>
      </div>

      {/* Form */}
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
            disabled={loginMutation.isPending}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className={`h-12 pr-10 ${errors.password ? "border-red-500" : ""}`}
              {...register("password")}
              disabled={loginMutation.isPending}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loginMutation.isPending}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}

          <Link
            href="/forgot-password"
            className="text-blue-500 hover:underline block text-right text-sm"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Log in"}
        </Button>

        {/* API Error Message */}
        {loginMutation.isError && !errors.email && !errors.password && (
          <p className="text-sm text-red-500 text-center">
            {loginMutation.error?.message || "Login failed. Please try again."}
          </p>
        )}
      </form>

      {/* Links */}
      <div className="text-center text-sm space-y-2">
        <p>
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register Now
          </Link>
        </p>
      </div>

      <p className="flex items-center justify-center gap-2 font-medium text-blue-500 hover:text-blue-600 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        <Link href="/">Back to Home</Link>
      </p>
    </div>
  );
}
