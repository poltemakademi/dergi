import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

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
  user: User | null;
  roles: Role[];
  activeRole: Role | null;
  activeTenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  initAuth: () => void;
  logout: () => Promise<void>;
  setActiveRole: (role: Role) => void;
  setActiveTenant: (tenant: Tenant) => void;
  setRoles: (roles: Role[]) => void;
  setDemoUser: (user: User, role: Role) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      roles: [],
      activeRole: null,
      activeTenant: null,
      isAuthenticated: false,
      isLoading: true, // Start loading

      setDemoUser: (user: User, role: Role) => {
        set({
          user,
          roles: [role],
          activeRole: role,
          isAuthenticated: true,
          isLoading: false
        });
      },

      initAuth: () => {
        // Check active session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            set({
              user: {
                id: session.user.id,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
              },
              roles: session.user.user_metadata?.role ? [session.user.user_metadata.role] : ['author'],
              activeRole: session.user.user_metadata?.role || 'author',
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            const state = get();
            if (!state.user?.id.startsWith('demo-')) {
              set({ isLoading: false });
            } else {
              set({ isLoading: false }); // ensure loading is false for demo users
            }
          }
        });

        // Listen for auth changes (login/logout/token refresh)
        supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            set({
              user: {
                id: session.user.id,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
              },
              roles: session.user.user_metadata?.role ? [session.user.user_metadata.role] : ['author'],
              activeRole: session.user.user_metadata?.role || 'author',
              isAuthenticated: true,
            });
          } else {
            const state = get();
            // Don't overwrite if it's a demo session!
            if (!state.user?.id.startsWith('demo-')) {
              set({
                user: null,
                roles: [],
                activeRole: null,
                activeTenant: null,
                isAuthenticated: false,
              });
            }
          }
        });
      },

      logout: async () => {
        const state = get();
        if (state.user?.id.startsWith('demo-')) {
          set({
            user: null,
            roles: [],
            activeRole: null,
            activeTenant: null,
            isAuthenticated: false,
          });
        } else {
          await supabase.auth.signOut();
        }
      },
      
      setActiveRole: (role) => set({ activeRole: role }),
      setActiveTenant: (tenant) => set({ activeTenant: tenant }),
      setRoles: (roles) => set({ roles, activeRole: roles[0] || null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user?.id.startsWith('demo-') ? state.user : null, 
        roles: state.user?.id.startsWith('demo-') ? state.roles : [],
        activeRole: state.user?.id.startsWith('demo-') ? state.activeRole : null,
        isAuthenticated: state.user?.id.startsWith('demo-') ? state.isAuthenticated : false,
      }), // Only persist demo users
    }
  )
);
