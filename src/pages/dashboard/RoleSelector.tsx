import { useAuthStore } from '../../store/useAuthStore';
import { useLocaleStore } from '../../store/useLocaleStore';
import { ArrowRight, BookOpen, Users, LayoutDashboard, PenTool, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApiQuery } from '../../hooks/useApiQuery';
import { CardSkeleton } from '../../components/skeletons/CardSkeleton';

export default function RoleSelector() {
  const { setActiveRole, setActiveTenant } = useAuthStore();
  const { t, locale } = useLocaleStore();
  const navigate = useNavigate();

  const { data: responseData, isLoading, error, refetch } = useApiQuery<any>({ url: '/api/user/workspaces' });
  const workspaces = responseData?.data ? responseData.data : (Array.isArray(responseData) ? responseData : null);

  const handleSelect = (workspace: any) => {
    setActiveRole(workspace.role);
    setActiveTenant({ id: workspace.id, name: workspace.tenantName, slug: workspace.tenantSlug });
    
    let path = '/dashboard/activity'; // Fallback
    if (workspace.role === 'author') path = '/dashboard/yazar/submissions';
    else if (workspace.role === 'editor') path = '/dashboard/editor/overview';
    else if (workspace.role === 'reviewer') path = '/dashboard/reviewer/assigned';
    else if (workspace.role === 'layout_editor') path = '/dashboard/layout/queue';
    else if (workspace.role === 'super_admin') path = '/dashboard/admin/system';
    
    navigate(path);
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'editor': return <LayoutDashboard className="w-5 h-5 text-slate-700" />;
      case 'author': return <PenTool className="w-5 h-5 text-slate-700" />;
      case 'reviewer': return <CheckSquare className="w-5 h-5 text-slate-700" />;
      case 'layout_editor': return <BookOpen className="w-5 h-5 text-slate-700" />;
      default: return <Users className="w-5 h-5 text-slate-700" />;
    }
  };

  const getRoleTranslation = (role: string) => {
    switch(role) {
      case 'editor': return t('role.editor');
      case 'author': return t('role.author');
      case 'reviewer': return t('role.reviewer');
      case 'layout_editor': return t('role.layout_editor');
      default: return role;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{locale === 'tr' ? 'Çalışma Alanları' : 'Workspaces'}</h1>
        <p className="text-slate-500 font-medium max-w-2xl">
          {t('roleSelect.subtitle')}
        </p>
      </motion.div>

      <div className="mb-8">
        {isLoading && <CardSkeleton count={3} />}
        
        {error && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200 flex justify-between items-center">
            <span className="text-red-700 text-sm">{error.message || 'Failed to load workspaces.'}</span>
            <button onClick={() => refetch()} className="text-red-700 hover:text-red-800 text-sm font-medium">Retry</button>
          </div>
        )}
      </div>

      {!isLoading && !error && workspaces && (
      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {workspaces.map((ws) => (
          <motion.button
            key={ws.id}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2 }}
            onClick={() => handleSelect(ws)}
            className="group text-left bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-h-[220px]"
          >
            <div className="flex justify-between items-start mb-6 w-full">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                {getRoleIcon(ws.role)}
              </div>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                {t('roleSelect.lastActive')}: {ws.lastActive}
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 capitalize mb-1.5 line-clamp-2">{ws.tenantName}</h3>
              <div className="flex items-center gap-1.5 text-sm text-indigo-600 font-bold bg-indigo-50/50 w-fit px-2 py-0.5 rounded border border-indigo-100">
                {getRoleIcon(ws.role)}
                {getRoleTranslation(ws.role)}
              </div>
            </div>

            <div className="flex items-center justify-between w-full pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{ws.stat}</span>
              <div className="flex items-center text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                {t('roleSelect.enter')} <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
      )}
    </div>
  );
}
