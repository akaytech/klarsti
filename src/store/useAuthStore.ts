import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthState {
  user: { uid: string; email: string; name: string; photoURL?: string; emailVerified: boolean } | null;
  isAuthLoading: boolean;
  login: (uid: string, email: string, name: string, emailVerified: boolean, photoURL?: string) => void;
  logout: () => void;
  setAuthLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthLoading: true,
      login: (uid, email, name, emailVerified, photoURL) => {
        set({ user: { uid, email, name, photoURL, emailVerified }, isAuthLoading: false });
      },
      logout: () => {
        set({ user: null, isAuthLoading: false });
      },
      setAuthLoading: (loading) => {
        set({ isAuthLoading: loading });
      }
    }),
    {
      name: 'klarsti-auth-storage',
      partialize: (state) => ({ 
        user: state.user
      })
    }
  )
);
