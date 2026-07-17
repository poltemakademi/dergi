import { Outlet, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import { useTenantStore } from '../store/useTenantStore';

export default function JournalLayout() {
  const { tenant_slug } = useParams<{ tenant_slug: string }>();
  const { fetchMetadata, metadata } = useTenantStore();

  useEffect(() => {
    if (tenant_slug) {
      fetchMetadata(tenant_slug);
    }
  }, [tenant_slug, fetchMetadata]);

  // Dynamically inject brand colors into CSS variables
  useEffect(() => {
    if (metadata) {
      const primaryColor = metadata.primaryColor || '#4f46e5';
      const secondaryColor = metadata.secondaryColor || '#6366f1';
      
      // Update Tailwind CSS variable hooks
      document.documentElement.style.setProperty('--color-indigo-600', primaryColor);
      document.documentElement.style.setProperty('--color-indigo-500', secondaryColor);
      // Generate a slightly darker variant for hover states by setting indigo-700 as well
      document.documentElement.style.setProperty('--color-indigo-700', primaryColor);
    }
    
    return () => {
      document.documentElement.style.removeProperty('--color-indigo-600');
      document.documentElement.style.removeProperty('--color-indigo-500');
      document.documentElement.style.removeProperty('--color-indigo-700');
    };
  }, [metadata]);

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

