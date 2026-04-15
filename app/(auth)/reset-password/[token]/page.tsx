"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ResetPasswordForm = dynamic(() => import("./ResetPasswordForm"), {
  ssr: false,
  loading: () => (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </div>
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
    </div>
  ),
});

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params.token as string;

  return <ResetPasswordForm token={token} />;
}
