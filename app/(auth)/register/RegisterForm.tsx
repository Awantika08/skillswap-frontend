"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft, User, Mail, Lock, ShieldCheck } from "lucide-react";
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
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    if (registerMutation.isSuccess) {
      router.push("/login");
    }
  }, [registerMutation.isSuccess, router]);

  useEffect(() => {
    if (registerMutation.isError) {
      const message = registerMutation.error?.message || "Registration failed";
      if (message.toLowerCase().includes("email") && message.toLowerCase().includes("already")) {
        setError("email", { message: "Email already exists" });
      } else if (message.toLowerCase().includes("email")) {
        setError("email", { message });
      } else if (message.toLowerCase().includes("password")) {
        setError("password", { message });
      }
    }
  }, [registerMutation.isError, registerMutation.error, setError]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center lg:text-left">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
          Create Account
        </h2>
        <p className="text-muted-foreground text-lg">
          Join Skill Swap today and start learning from experts.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Full Name Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="fullName" className="text-sm font-bold uppercase tracking-wider opacity-70 ml-1">
            Full Name
          </Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="fullName"
              placeholder="John Doe"
              className={cn(
                "h-14 pl-12 rounded-2xl bg-muted/30 border-border/40 focus:bg-background transition-all",
                errors.fullName && "border-destructive/50 ring-destructive/20"
              )}
              {...register("fullName")}
              disabled={registerMutation.isPending}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs font-bold text-destructive ml-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Field */}
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
              disabled={registerMutation.isPending}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-bold text-destructive ml-1">{errors.email.message}</p>
          )}
        </div>

        {/* Role Selection Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="role" className="text-sm font-bold uppercase tracking-wider opacity-70 ml-1">
            Register As
          </Label>
          <Select
            onValueChange={(value) => setValue("role", value as "Mentor" | "Learner")}
            disabled={registerMutation.isPending}
          >
            <SelectTrigger
              className={cn(
                "h-14 px-4 rounded-2xl bg-muted/30 border-border/40 transition-all",
                errors.role && "border-destructive/50"
              )}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Select your role" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="Mentor" className="rounded-xl font-medium">Mentor</SelectItem>
              <SelectItem value="Learner" className="rounded-xl font-medium">Learner</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-xs font-bold text-destructive ml-1">{errors.role.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wider opacity-70 ml-1">
            Password
          </Label>
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
              disabled={registerMutation.isPending}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-xl hover:bg-transparent text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
              disabled={registerMutation.isPending}
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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating Account..." : "Create Account"}
        </Button>

        {registerMutation.isError && !errors.email && !errors.password && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
            <p className="text-sm font-bold text-destructive">
              {registerMutation.error?.message || "Registration failed."}
            </p>
          </div>
        )}
      </form>

      {/* Footer Links */}
      <div className="flex flex-col gap-4 text-center mt-2 pb-8 lg:pb-0">
        <p className="text-muted-foreground font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign In
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
