import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2 text-center">
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </div>

      {/* Form Skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>

      {/* Separator Skeleton */}
      <div className="h-4 bg-gray-200 rounded"></div>

      {/* Google Login Skeleton */}
      <div className="flex justify-center">
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Links Skeleton */}
      <div className="space-y-2 text-center">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );
}
