import { Outlet, Link } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 shadow-xl">
        <h2 className="text-2xl font-black mb-8 text-indigo-400">DergiPlatformu</h2>
        
        <nav className="flex-1 flex flex-col gap-2">
          <Link to="/dashboard/role-selector" className="px-4 py-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors">Workspace</Link>
          <Link to="/dashboard/profile" className="px-4 py-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors">My Profile</Link>
          
          <div className="mt-8 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Editor</div>
          <Link to="/dashboard/editor/overview" className="px-4 py-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors">Overview</Link>
          <Link to="/dashboard/editor/articles" className="px-4 py-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors">Manuscripts</Link>
          
          <div className="mt-8 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Author</div>
          <Link to="/dashboard/yazar/submissions" className="px-4 py-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors">My Submissions</Link>
          <Link to="/dashboard/yazar/submit-wizard" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold transition-colors shadow-md mt-2 text-center">New Submission</Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[80vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
