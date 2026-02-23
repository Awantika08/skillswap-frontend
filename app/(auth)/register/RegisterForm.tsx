"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function RegisterForm() {
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userName">Username</Label>
          <Input
            id="userName"
            type="text"
            placeholder="John Doe"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="text"
            placeholder="9800000000"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="user@company.com"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
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
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
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
