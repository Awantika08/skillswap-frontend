import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 flex overflow-hidden relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}
