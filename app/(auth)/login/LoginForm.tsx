"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, LoginFormValues } from "@/zod/auth";
import { useLogin } from "@/hooks/useLogin";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    if (loginMutation.isSuccess && loginMutation.data?.user) {
      const role = loginMutation.data.user.role.toLowerCase();
      switch (role) {
        case "admin": router.push("/admin/dashboard"); break;
        case "mentor": router.push("/mentor/dashboard"); break;
        case "learner": router.push("/learner/dashboard"); break;
        default: router.push("/dashboard");
      }
    }
  }, [loginMutation.isSuccess, loginMutation.data, router]);

  useEffect(() => {
    if (loginMutation.isError) {
      const message = loginMutation.error?.message || "Login failed";
      if (message.toLowerCase().includes("email")) setError("email", { message });
      else if (message.toLowerCase().includes("password")) setError("password", { message });
    }
  }, [loginMutation.isError, loginMutation.error, setError]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center lg:text-left">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
          Welcome Back
        </h2>
        <p className="text-muted-foreground text-lg">
          Log in to continue your skill-swapping journey.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider opacity-70 ml-1">
            Email Address
          </Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className={cn(
                "h-14 pl-12 rounded-2xl bg-muted/30 border-border/40 focus:bg-background transition-all",
                errors.email && "border-destructive/50 ring-destructive/20"
              )}
              {...register("email")}
              disabled={loginMutation.isPending}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-bold text-destructive ml-1">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between ml-1">
            <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wider opacity-70">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "h-14 pl-12 pr-12 rounded-2xl bg-muted/30 border-border/40 focus:bg-background transition-all",
                errors.password && "border-destructive/50 ring-destructive/20"
              )}
              {...register("password")}
              disabled={loginMutation.isPending}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-xl hover:bg-transparent text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loginMutation.isPending}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && (
            <p className="text-xs font-bold text-destructive ml-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Authenticating..." : "Log In"}
        </Button>

        {loginMutation.isError && !errors.email && !errors.password && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
            <p className="text-sm font-bold text-destructive">
              {loginMutation.error?.message || "Authentication failed."}
            </p>
          </div>
        )}
      </form>

      {/* Footer Links */}
      <div className="flex flex-col gap-4 text-center mt-4">
        <p className="text-muted-foreground font-medium">
          New here?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Create an Account
          </Link>
        </p>
        
        <div className="flex items-center gap-2 justify-center py-4 border-t border-border/50">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          <Link href="/" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
