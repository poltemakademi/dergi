import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'super_admin' | 'editor' | 'layout_editor' | 'reviewer' | 'author';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  roles: Role[];
  activeRole: Role | null;
  activeTenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  initAuth: () => void;
  setAuth: (token: string, user: User, roles: Role[]) => void;
  logout: () => void;
  setActiveRole: (role: Role) => void;
  setActiveTenant: (tenant: Tenant) => void;
  setRoles: (roles: Role[]) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      roles: [],
      activeRole: null,
      activeTenant: null,
      isAuthenticated: false,
      isLoading: true, // Start loading

      initAuth: () => {
        // With pure Zustand persist, the state is loaded synchronously from localStorage
        // Just set loading to false. We could add token expiration validation here later.
        const state = get();
        if (state.token && state.user) {
          set({ isAuthenticated: true, isLoading: false });
        } else {
          set({ isAuthenticated: false, isLoading: false });
        }
      },

      setAuth: (token: string, user: User, roles: Role[]) => {
        set({
          token,
          user,
          roles,
          activeRole: roles[0] || 'author',
          isAuthenticated: true,
          isLoading: false
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          roles: [],
          activeRole: null,
          activeTenant: null,
          isAuthenticated: false,
        });
      },
      
      setActiveRole: (role) => set({ activeRole: role }),
      setActiveTenant: (tenant) => set({ activeTenant: tenant }),
      setRoles: (roles) => set({
        roles,
        activeRole: roles[0] || 'author',
        isAuthenticated: true,
        token: 'demo-token',
        user: { id: 'demo-user-id', name: 'Demo User', email: 'demo@example.com' }
      }),
    }),
    {
      name: 'auth-storage',
      // We persist all auth state except isLoading
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        roles: state.roles,
        activeRole: state.activeRole,
        activeTenant: state.activeTenant,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

