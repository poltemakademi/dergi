import { Outlet, useParams } from 'react-router-dom';

export default function JournalLayout() {
  const { tenant_slug } = useParams();

  return (
    <div className="min-h-screen bg-white">
      {/* Journal specific header could go here */}
      <header className="border-b border-slate-200 bg-slate-50 p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Journal: {tenant_slug}</h1>
      </header>
      
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
