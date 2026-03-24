import { create } from "zustand";
import { persist } from "zustand/middleware";
export interface User { id: string; email: string; username: string; name: string; avatar?: string; role: "READER"|"AUTHOR"|"ADMIN"; }
interface AuthState {
  user: User | null; token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuth: () => boolean;
}
export const useAuth = create<AuthState>()(persist((set, get) => ({
  user: null, token: null,
  setAuth: (user, token) => { localStorage.setItem("token", token); set({ user, token }); },
  logout: () => { localStorage.removeItem("token"); set({ user: null, token: null }); },
  isAuth: () => !!get().token,
}), { name: "agentnews-auth" }));
