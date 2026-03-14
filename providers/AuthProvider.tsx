"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const loadAuthFromCookies = useAuthStore(
    (state) => state.loadAuthFromCookies,
  );

  useEffect(() => {
    loadAuthFromCookies();
  }, [loadAuthFromCookies]);

  return <>{children}</>;
}
