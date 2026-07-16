import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function JournalLayout() {
  return (
    <div className="min-h-screen font-sans selection:bg-indigo-200 selection:text-indigo-900 relative flex flex-col bg-transparent overflow-x-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-sky-400/15 blur-[120px] rounded-full -z-10 pointer-events-none animate-float" />
      <div className="absolute top-96 -right-64 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
