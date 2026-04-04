import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  setAuth: (token: string, refreshToken: string, user: User) => void;
  clearAuth: () => void;
  loadAuthFromCookies: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,

  setAuth: (token, refreshToken, user) => {
    Cookies.set("token", token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("refreshToken", refreshToken, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("user", JSON.stringify(user), {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
    set({ token, refreshToken, user });
  },

  clearAuth: () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    set({ token: null, refreshToken: null, user: null });
  },

  loadAuthFromCookies: () => {
    try {
      const token = Cookies.get("token") || null;
      const refreshToken = Cookies.get("refreshToken") || null;
      const userStr = Cookies.get("user");

      // Only parse if userStr exists and is not undefined
      let user = null;
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (parseError) {
          console.error("Failed to parse user cookie:", parseError);
          // If parsing fails, clear the invalid cookie
          Cookies.remove("user");
        }
      }

      set({ token, refreshToken, user });
    } catch (error) {
      console.error("Error loading auth from cookies:", error);
      // Reset state on error
      set({ token: null, refreshToken: null, user: null });
    }
  },
}));
