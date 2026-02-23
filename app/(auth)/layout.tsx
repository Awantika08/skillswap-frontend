"use client";

import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex font-sans">
      {/* Left side illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 rounded-sm bg-[#3F3FF3]"></div>
            </div>
            <h1 className="text-xl font-semibold text-white">Skill Swap</h1>
          </div>

          {/* Illustration text */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl text-white mb-6 leading-tight font-bold">
              Find Your Perfect Skill Swap Experience
            </h2>
            <p className="text-white/90 text-lg leading-relaxed max-w-md">
              Join thousands of mentors, connect with mentors, and create
              unforgettable experiences.
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-white/70 text-sm">
            <span>Copyright © 2025 Skill Swap.</span>
            <span className="cursor-pointer hover:text-white/90 transition-colors">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>

      {/* Right side content - Children will be rendered here */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
