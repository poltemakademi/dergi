import { useAuthStore } from '../store/useAuthStore';
import type { Role } from '../store/useAuthStore';
import { ShieldAlert, LogIn, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RoleSimulator() {
  const { setRoles, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!import.meta.env.DEV) {
    return null;
  }

  const simulateLogin = (roles: Role[]) => {
    // 1. Reset state (logout)
    logout();
    
    // 2. Set new roles (login)
    setTimeout(() => {
      setRoles(roles);
      // 3. Navigate to root dashboard to trigger the Smart Guard
      navigate('/dashboard');
    }, 100);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-50 border border-slate-700/50 backdrop-blur-md bg-opacity-90">
      <div className="flex items-center gap-2 text-rose-400">
        <ShieldAlert className="w-5 h-5" />
        <span className="text-sm font-bold uppercase tracking-wider hidden md:inline">Dev Mode:</span>
      </div>
      
      <div className="flex gap-4 border-l border-slate-700 pl-4">
        <button
          onClick={() => simulateLogin(['author'])}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white transition-all shadow-lg shadow-indigo-500/30"
        >
          <LogIn className="w-3 h-3" />
          Simulate: Single Role (Author)
        </button>

        <button
          onClick={() => simulateLogin(['editor', 'reviewer', 'author'])}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
        >
          <Users className="w-3 h-3" />
          Simulate: Multi-Role (3 Roles)
        </button>
      </div>
    </div>
  );
}
