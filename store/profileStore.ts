// store/profileStore.ts
import { create } from "zustand";
import { Profile } from "@/types/profile";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: Profile) => void;
  updateProfile: (updatedData: Partial<Profile>) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updatedData) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updatedData } : null,
    })),
  clearProfile: () => set({ profile: null, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
