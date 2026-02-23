"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // UI-only handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate loading state for UI demo
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleGoogleSuccess = () => {
    setIsGoogleLoading(true);
    // Simulate loading state for UI demo
    setTimeout(() => setIsGoogleLoading(false), 2000);
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
  };

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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="user@company.com"
            className="h-12"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="h-12 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

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
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
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
