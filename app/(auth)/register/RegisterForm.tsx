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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchema, RegisterFormValues } from "@/zod/auth";
import { useRegister } from "@/hooks/useRegister";

export default function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: undefined,
      password: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  // Redirect to login page after successful registration
  useEffect(() => {
    if (registerMutation.isSuccess) {
      router.push("/login");
    }
  }, [registerMutation.isSuccess, router]);

  // Handle API errors
  useEffect(() => {
    if (registerMutation.isError) {
      const error = registerMutation.error;
      const message = error.message || "Registration failed";

      if (
        message.toLowerCase().includes("email") &&
        message.toLowerCase().includes("already")
      ) {
        setError("email", { message: "Email already exists" });
      } else if (message.toLowerCase().includes("email")) {
        setError("email", { message });
      } else if (message.toLowerCase().includes("password")) {
        setError("password", { message });
      }
    }
  }, [registerMutation.isError, registerMutation.error, setError]);

  return (
    <div className="space-y-6 max-w-md mx-auto my-12">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-3xl text-foreground font-semibold">
          Create an Account
        </h2>
        <p className="text-muted-foreground">
          Create a new account to get started with Event Booking.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            className={`h-12 ${errors.fullName ? "border-red-500" : ""}`}
            {...register("fullName")}
            disabled={registerMutation.isPending}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="user@company.com"
            className={`h-12 ${errors.email ? "border-red-500" : ""}`}
            {...register("email")}
            disabled={registerMutation.isPending}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Role Selection Field */}
        <div className="space-y-2">
          <Label htmlFor="role">Select Role</Label>
          <Select
            onValueChange={(value) =>
              setValue("role", value as "Mentor" | "Learner")
            }
            disabled={registerMutation.isPending}
          >
            <SelectTrigger
              className={`h-12 ${errors.role ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mentor">Mentor</SelectItem>
              <SelectItem value="Learner">Learner</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              className={`h-12 pr-10 ${errors.password ? "border-red-500" : ""}`}
              {...register("password")}
              disabled={registerMutation.isPending}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={registerMutation.isPending}
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
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending
            ? "Creating Account..."
            : "Create Account"}
        </Button>

        {/* API Error Message */}
        {registerMutation.isError &&
          !errors.email &&
          !errors.password &&
          !errors.fullName &&
          !errors.role && (
            <p className="text-sm text-red-500 text-center">
              {registerMutation.error?.message ||
                "Registration failed. Please try again."}
            </p>
          )}
      </form>

      {/* Footer */}
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Sign in
        </Link>
      </div>

      <p className="flex items-center justify-center gap-2 font-medium text-blue-500 hover:text-blue-600 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        <Link href="/">Back to Home</Link>
      </p>
    </div>
  );
}
