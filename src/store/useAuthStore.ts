import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';

export type Role = 'super_admin' | 'editor' | 'layout_editor' | 'reviewer' | 'author';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  institution?: string;
  department?: string;
  title_field?: string;
  orcid?: string;
  bio?: string;
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
  updateUser: (userUpdates: Partial<User>) => void;
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
        // Recover state asynchronously from Supabase session
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            const user = session.user;
            // Retrieve profile and roles to populate state
            Promise.all([
              supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
              supabase.from('journal_members').select('journal_role').eq('user_id', user.id)
            ]).then(([profRes, memRes]) => {
              const profile = profRes.data;
              const members = memRes.data;
              const roles = (members && members.length > 0)
                ? members.map((m: any) => m.journal_role)
                : ['author'];

              set({
                token: session.access_token,
                user: {
                  id: user.id,
                  name: profile?.name_surname || user.user_metadata?.full_name || 'Academic User',
                  email: user.email || '',
                  phone: profile?.phone,
                  institution: profile?.institution,
                  orcid: profile?.orcid_id,
                },
                roles,
                activeRole: get().activeRole || roles[0] || 'author',
                isAuthenticated: true,
                isLoading: false
              });
            }).catch(() => {
              set({ isLoading: false });
            });
          } else {
            const state = get();
            set({ isAuthenticated: !!(state.token && state.user), isLoading: false });
          }
        }).catch(() => {
          const state = get();
          set({ isAuthenticated: !!(state.token && state.user), isLoading: false });
        });
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

      updateUser: (userUpdates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userUpdates } });
        }
      },

      logout: () => {
        supabase.auth.signOut().catch(() => {});
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
        user: { id: '9077a2da-0d48-4505-9989-b68ec3a5dba7', name: 'Demo User', email: 'demo@example.com', institution: '', orcid: '' } // Provide some defaults for mock demo
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

