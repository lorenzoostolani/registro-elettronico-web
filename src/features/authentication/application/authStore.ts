import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LoginToken } from '../domain/model/LoginToken';

interface AuthState {
  token: LoginToken | null;
  setToken: (token: LoginToken | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);