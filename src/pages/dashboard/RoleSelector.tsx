import { useMemo } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLocaleStore } from '../../store/useLocaleStore';
import { ArrowRight, BookOpen, Users, LayoutDashboard, PenTool, CheckSquare, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApiQuery } from '../../hooks/useApiQuery';
import { CardSkeleton } from '../../components/skeletons/CardSkeleton';

export default function RoleSelector() {
  const { setActiveRole, setActiveTenant } = useAuthStore();
  const { t, locale } = useLocaleStore();
  const navigate = useNavigate();

  const { data: responseData, isLoading, error, refetch } = useApiQuery<any>({ url: '/api/user/workspaces' });
  const rawWorkspaces = responseData?.data ? responseData.data : (Array.isArray(responseData) ? responseData : null);

  const userRoles = useAuthStore.getState().roles || [];
  const userEmail = useAuthStore.getState().user?.email || '';

  const workspaces = useMemo(() => {
    if (!rawWorkspaces || !Array.isArray(rawWorkspaces)) return [];
    return rawWorkspaces.filter((ws: any) => {
      if (ws.role === 'super_admin') {
        return userRoles.includes('super_admin') || userEmail === 'super_admin@demo.com';
      }
      return true;
    });
  }, [rawWorkspaces, userRoles, userEmail]);

  const handleSelect = (workspace: any) => {
    setActiveRole(workspace.role);
    setActiveTenant({ id: workspace.id, name: workspace.tenantName, slug: workspace.tenantSlug });
    
    // Ensure active role is present in auth store roles array for RoleGuard
    const currentRoles = useAuthStore.getState().roles || [];
    if (!currentRoles.includes(workspace.role)) {
      useAuthStore.setState({ roles: [...currentRoles, workspace.role] });
    }

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
      case 'editor': return <LayoutDashboard className="w-5 h-5 text-indigo-600" />;
      case 'author': return <PenTool className="w-5 h-5 text-emerald-600" />;
      case 'reviewer': return <CheckSquare className="w-5 h-5 text-blue-600" />;
      case 'layout_editor': return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'super_admin': return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      default: return <Users className="w-5 h-5 text-slate-600" />;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch(role) {
      case 'editor': return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'author': return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'reviewer': return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'layout_editor': return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'super_admin': return 'bg-purple-50 text-purple-700 border-purple-200/80';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getRoleTranslation = (role: string) => {
    switch(role) {
      case 'editor': return t('role.editor');
      case 'author': return t('role.author');
      case 'reviewer': return t('role.reviewer');
      case 'layout_editor': return t('role.layout_editor');
      case 'super_admin': return t('role.super_admin');
      default: return role;
    }
  };

  const formatLastActive = (val: string) => {
    if (!val) return locale === 'tr' ? 'Aktif' : 'Active';
    if (val === 'Aktif' || val === 'Active') return locale === 'tr' ? 'Aktif' : 'Active';
    if (val === 'Bugün' || val === 'Today') return locale === 'tr' ? 'Bugün' : 'Today';
    return val;
  };

  const formatTenantName = (ws: any) => {
    if (ws.role === 'super_admin') return locale === 'tr' ? 'Sistem Yönetimi' : 'System Administration';
    if (ws.role === 'author' && ws.id === 'global-author') return locale === 'tr' ? 'Yazar Portalı' : 'Author Portal';
    if (ws.role === 'reviewer' && ws.id === 'global-reviewer') return locale === 'tr' ? 'Hakem Portalı' : 'Reviewer Portal';
    return ws.tenantName;
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
        {workspaces.map((ws: any) => (
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
                {t('roleSelect.lastActive')}: {formatLastActive(ws.lastActive)}
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1.5 line-clamp-2">{formatTenantName(ws)}</h3>
              <div className={`flex items-center gap-1.5 text-xs font-bold w-fit px-2.5 py-1 rounded-md border ${getRoleBadgeStyle(ws.role)}`}>
                {getRoleIcon(ws.role)}
                {getRoleTranslation(ws.role)}
              </div>
            </div>

            <div className="flex items-center justify-between w-full pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">{ws.stat}</span>
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
