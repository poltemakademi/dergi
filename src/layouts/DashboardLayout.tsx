import { useState, useMemo, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLocaleStore } from '../store/useLocaleStore';
import { isProfileComplete } from '../utils/profileValidation';
import { useApiQuery } from '../hooks/useApiQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, FileText, Settings, 
  Inbox, BookOpen, PenTool, CheckSquare, Search, BarChart3, Globe, LogOut, Menu, X, AlertCircle,
  Mail, History, ChevronDown
} from 'lucide-react';
import NotificationDropdown from '../components/NotificationDropdown';
import Profile from '../pages/dashboard/Profile'; // Intercept component

export default function DashboardLayout() {
  const { isAuthenticated, activeRole, user, activeTenant, logout, setActiveTenant } = useAuthStore();
  const { locale, setLocale, t } = useLocaleStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed] = useState(true); // Default to slim
  const [isHovered, setIsHovered] = useState(false);

  // Fetch real dynamic counts for sidebar badges
  const { data: invitationsData, refetch: refetchInvitations } = useApiQuery<any[]>({
    url: '/api/reviewer/invitations',
    enabled: isAuthenticated && activeRole === 'reviewer',
  });

  const { data: assignedData } = useApiQuery<any[]>({
    url: '/api/reviewer/assigned',
    enabled: isAuthenticated && activeRole === 'reviewer',
  });

  const { data: messagesData, refetch: refetchMessages } = useApiQuery<any[]>({
    url: '/api/messages',
    enabled: isAuthenticated,
  });

  // Listen for invitation accept/decline → update sidebar badge instantly
  useEffect(() => {
    const handleInvUpdate = () => refetchInvitations();
    window.addEventListener('invitations-updated', handleInvUpdate);
    return () => window.removeEventListener('invitations-updated', handleInvUpdate);
  }, [refetchInvitations]);

  // Listen for message read/delete → update sidebar badge instantly
  useEffect(() => {
    const handleMsgUpdate = () => refetchMessages();
    window.addEventListener('messages-updated', handleMsgUpdate);
    return () => window.removeEventListener('messages-updated', handleMsgUpdate);
  }, [refetchMessages]);

  // Sidebar badge: invitations count from server minus locally hidden ones
  const invitationsCount = useMemo(() => {
    if (!invitationsData) return 0;
    const list = Array.isArray(invitationsData) ? invitationsData : (invitationsData as any)?.data;
    return Array.isArray(list) ? list.length : 0;
  }, [invitationsData]);

  const assignedCount = useMemo(() => {
    if (!assignedData) return 0;
    const list = Array.isArray(assignedData) ? assignedData : (assignedData as any)?.data;
    return Array.isArray(list) ? list.length : 0;
  }, [assignedData]);

  const unreadMessagesCount = useMemo(() => {
    if (!messagesData) return 0;
    const list = Array.isArray(messagesData) ? messagesData : (messagesData as any)?.data;
    return Array.isArray(list) ? list.filter((m: any) => m.unread).length : 0;
  }, [messagesData]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const { isValid: isProfileValid } = useMemo(() => isProfileComplete(activeRole, user), [activeRole, user]);

  const handleWorkspaceSwitch = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("🔵 Switcher Clicked!");
    
    if (setActiveTenant) setActiveTenant(null);
    
    navigate('/dashboard/role-selector');
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const isActive = (path: string) => location.pathname.includes(path);

  // Expanded if not collapsed, or if currently hovered in slim mode
  const showExpanded = !isCollapsed || isHovered;

  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { staggerChildren: 0.03, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-transparent flex text-slate-800 font-sans selection:bg-slate-200 selection:text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Enterprise Sidebar */}
      <motion.aside 
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed inset-y-0 left-0 bg-white flex flex-col z-50 border-r border-slate-200/80 shadow-2xl lg:shadow-[4px_0_24px_rgba(0,0,0,0.01)] transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 overflow-hidden ${
          showExpanded ? 'w-60' : 'w-16'
        } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Sidebar Header */}
        <div className="px-3 border-b border-slate-100 flex items-center h-16 shrink-0 overflow-hidden">
          <Link to="/" onClick={closeSidebar} className="flex items-center gap-3 group overflow-hidden w-full">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col whitespace-nowrap min-w-0 ${showExpanded ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>
              <h2 className="text-base font-bold text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors font-serif truncate">novaijournal</h2>
              <span className="text-[9px] text-slate-500 font-medium tracking-wide mt-1 block truncate">{t('nav.enterprise')}</span>
            </div>
          </Link>

          {/* Mobile Drawer Close Button */}
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50 shrink-0"
            onClick={closeSidebar}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Switcher - Forced Click */}
        <div 
          onClick={handleWorkspaceSwitch}
          className="px-3 border-b border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-100 transition-colors active:bg-slate-200 group relative z-50 flex items-center gap-3 overflow-hidden h-16 shrink-0"
          title={locale === 'tr' ? 'Çalışma Alanı Değiştir' : 'Switch Workspace'}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:border-indigo-300 group-hover:text-indigo-600 text-indigo-500 transition-all">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div className={`transition-all duration-300 ease-in-out flex-1 flex items-center justify-between overflow-hidden min-w-0 ${showExpanded ? 'opacity-100 max-w-[180px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-[10px] font-bold text-indigo-600 uppercase leading-none mb-1 block tracking-wider truncate">
                {activeTenant && activeRole 
                  ? `${t('nav.workspace')} • ${
                      activeRole === 'reviewer' ? (locale === 'tr' ? 'Hakem' : 'Reviewer') :
                      activeRole === 'author' ? (locale === 'tr' ? 'Yazar' : 'Author') :
                      activeRole === 'editor' ? (locale === 'tr' ? 'Editör' : 'Editor') :
                      activeRole === 'layout_editor' ? (locale === 'tr' ? 'Mizanpaj' : 'Layout') :
                      activeRole === 'super_admin' ? (locale === 'tr' ? 'Yönetici' : 'Admin') : activeRole
                    }` 
                  : t('nav.workspace')}
              </span>
              <span className={`text-xs font-bold truncate leading-none transition-colors ${!activeTenant ? 'text-indigo-600' : 'text-slate-900 group-hover:text-indigo-700'}`}>
                {activeTenant ? activeTenant.name : (locale === 'tr' ? 'Seçiniz...' : 'Select...')}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0 ml-1" />
          </div>
        </div>
        
        {/* Sidebar Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5 custom-scrollbar overflow-x-hidden">
          <motion.div variants={itemVariants}>
            <Link 
              to={!isProfileValid ? '#' : "/dashboard/messages"} 
              onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} 
              className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${
                !isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/messages') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`}
              title={!showExpanded ? t('nav.communications') : undefined}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <Inbox className={`w-5 h-5 ${isActive('/dashboard/messages') ? 'text-slate-900' : 'text-slate-400'}`} />
              </div>
              <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.communications')}</span>
              {unreadMessagesCount > 0 && (
                <span className={`transition-all duration-300 ease-in-out ml-auto bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold ${showExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  {unreadMessagesCount}
                </span>
              )}
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link 
              to="/dashboard/profile" 
              onClick={closeSidebar} 
              className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 relative ${
                isActive('/dashboard/profile') || !isProfileValid ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`}
              title={!showExpanded ? t('nav.profile') : undefined}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0 relative">
                <Users className={`w-5 h-5 ${isActive('/dashboard/profile') || !isProfileValid ? 'text-slate-900' : 'text-slate-400'}`} />
                {!isProfileValid && !showExpanded && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </div>
              <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.profile')}</span>
              {!isProfileValid && showExpanded && (
                <div className="ml-auto w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
              )}
            </Link>
          </motion.div>

          <AnimatePresence>
            {/* Editor Routes */}
            {(activeTenant && activeRole === 'editor' && !location.pathname.includes('/role-selector')) && (
              <motion.div 
                key="editor-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden flex flex-col gap-1.5"
              >
                <div className={`mt-3 mb-1 px-3 border-t border-slate-100 pt-3 transition-all duration-300 overflow-hidden ${showExpanded ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 py-0 border-t-0 pointer-events-none'}`}>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{t('nav.executiveEditor')}</p>
                </div>
                <Link to={!isProfileValid ? '#' : "/dashboard/editor/overview"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${!isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/editor/overview') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`} title={!showExpanded ? t('nav.analytics') : undefined}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <BarChart3 className={`w-5 h-5 ${isActive('/dashboard/editor/overview') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.analytics')}</span>
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/editor/articles"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${!isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/editor/articles') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`} title={!showExpanded ? t('nav.manuscripts') : undefined}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <FileText className={`w-5 h-5 ${isActive('/dashboard/editor/articles') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.manuscripts')}</span>
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/editor/issues"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${!isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/editor/issues') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`} title={!showExpanded ? t('nav.issueStudio') : undefined}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <BookOpen className={`w-5 h-5 ${isActive('/dashboard/editor/issues') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.issueStudio')}</span>
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/editor/settings"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${!isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/editor/settings') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`} title={!showExpanded ? t('nav.configuration') : undefined}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Settings className={`w-5 h-5 ${isActive('/dashboard/editor/settings') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.configuration')}</span>
                </Link>
              </motion.div>
            )}

            {/* Reviewer Routes */}
            {(activeTenant && activeRole === 'reviewer' && !location.pathname.includes('/role-selector')) && (
              <motion.div 
                key="reviewer-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden flex flex-col gap-1.5"
              >
                <div className={`mt-3 mb-1 px-3 border-t border-slate-100 pt-3 transition-all duration-300 overflow-hidden ${showExpanded ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 py-0 border-t-0 pointer-events-none'}`}>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{t('nav.reviewer')}</p>
                </div>
                <Link to={!isProfileValid ? '#' : "/dashboard/reviewer/invitations"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${!isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/reviewer/invitations') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`} title={!showExpanded ? (locale === 'tr' ? 'Davetler' : 'Invitations') : undefined}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Mail className={`w-5 h-5 ${isActive('/dashboard/reviewer/invitations') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{locale === 'tr' ? 'Davetler' : 'Invitations'}</span>
                  {invitationsCount > 0 && (
                    <span className={`transition-all duration-300 ease-in-out ml-auto bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold ${showExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      {invitationsCount}
                    </span>
                  )}
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/reviewer/assigned"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${!isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/reviewer/assigned') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`} title={!showExpanded ? t('nav.reviewQueue') : undefined}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <CheckSquare className={`w-5 h-5 ${isActive('/dashboard/reviewer/assigned') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.reviewQueue')}</span>
                  {assignedCount > 0 && (
                    <span className={`transition-all duration-300 ease-in-out ml-auto bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold ${showExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      {assignedCount}
                    </span>
                  )}
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/reviewer/history"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${!isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/reviewer/history') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`} title={!showExpanded ? (locale === 'tr' ? 'Geçmiş' : 'History') : undefined}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <History className={`w-5 h-5 ${isActive('/dashboard/reviewer/history') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{locale === 'tr' ? 'Geçmiş' : 'History'}</span>
                </Link>
              </motion.div>
            )}

            {/* Author Routes */}
            {(activeTenant && activeRole === 'author' && !location.pathname.includes('/role-selector')) && (
              <motion.div 
                key="author-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden flex flex-col gap-1.5"
              >
                <div className={`mt-3 mb-1 px-3 border-t border-slate-100 pt-3 transition-all duration-300 overflow-hidden ${showExpanded ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 py-0 border-t-0 pointer-events-none'}`}>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{t('nav.author')}</p>
                </div>
                <Link to={!isProfileValid ? '#' : "/dashboard/yazar/submissions"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${!isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/yazar/submissions') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`} title={!showExpanded ? t('nav.mySubmissions') : undefined}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <FileText className={`w-5 h-5 ${isActive('/dashboard/yazar/submissions') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.mySubmissions')}</span>
                </Link>
                <div className="w-full flex items-center justify-center">
                  <Link 
                    to={!isProfileValid ? '#' : "/dashboard/yazar/submit-wizard"} 
                    onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} 
                    className={`bg-slate-900 hover:bg-slate-800 rounded-xl text-white font-medium transition-all duration-300 shadow-sm flex items-center justify-center gap-2 overflow-hidden h-10 ${
                      !showExpanded ? 'w-10 p-0' : 'w-full py-2 px-3 text-xs'
                    } ${!isProfileValid ? 'opacity-40 pointer-events-none' : ''}`}
                    title={!showExpanded ? t('nav.newSubmission') : undefined}
                  >
                    <PenTool className="w-4 h-4 shrink-0" />
                    <span className={`transition-all duration-300 ease-in-out truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.newSubmission')}</span>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Layout Routes */}
            {(activeTenant && activeRole === 'layout_editor' && !location.pathname.includes('/role-selector')) && (
              <motion.div 
                key="layout-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden flex flex-col gap-1.5"
              >
                <div className={`mt-3 mb-1 px-3 border-t border-slate-100 pt-3 transition-all duration-300 overflow-hidden ${showExpanded ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 py-0 border-t-0 pointer-events-none'}`}>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{t('nav.layoutEditor')}</p>
                </div>
                <Link to={!isProfileValid ? '#' : "/dashboard/layout/queue"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${!isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/layout/queue') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`} title={!showExpanded ? t('nav.productionLine') : undefined}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Inbox className={`w-5 h-5 ${isActive('/dashboard/layout/queue') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.productionLine')}</span>
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/layout/proofs"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${!isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/layout/proofs') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`} title={!showExpanded ? t('nav.galleyProofs') : undefined}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <BookOpen className={`w-5 h-5 ${isActive('/dashboard/layout/proofs') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.galleyProofs')}</span>
                </Link>
              </motion.div>
            )}

            {/* Super Admin Routes */}
            {(activeTenant && activeRole === 'super_admin' && !location.pathname.includes('/role-selector')) && (
              <motion.div 
                key="admin-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden flex flex-col gap-1.5"
              >
                <div className={`mt-3 mb-1 px-3 border-t border-slate-100 pt-3 transition-all duration-300 overflow-hidden ${showExpanded ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 py-0 border-t-0 pointer-events-none'}`}>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{t('nav.superAdmin')}</p>
                </div>
                <Link to={!isProfileValid ? '#' : "/dashboard/admin/system"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${!isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/admin/system') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`} title={!showExpanded ? t('nav.systemOverview') : undefined}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Settings className={`w-5 h-5 ${isActive('/dashboard/admin/system') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.systemOverview')}</span>
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/admin/users"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${!isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/admin/users') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`} title={!showExpanded ? t('nav.userManagement') : undefined}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Users className={`w-5 h-5 ${isActive('/dashboard/admin/users') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.userManagement')}</span>
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/admin/journals"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={`flex items-center gap-3 rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden h-10 ${!isProfileValid ? 'opacity-40 pointer-events-none' : isActive('/dashboard/admin/journals') ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`} title={!showExpanded ? t('nav.journalManagement') : undefined}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <BookOpen className={`w-5 h-5 ${isActive('/dashboard/admin/journals') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <span className={`transition-all duration-300 ease-in-out text-xs font-semibold truncate ${showExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>{t('nav.journalManagement')}</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* User Mini Profile Footer */}
        <div className="px-3 border-t border-slate-100 bg-white shrink-0 h-16 flex items-center">
          <div className="flex items-center gap-3 overflow-hidden w-full">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 font-bold text-xs text-slate-700">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className={`transition-all duration-300 ease-in-out flex-1 flex items-center justify-between overflow-hidden min-w-0 ${showExpanded ? 'opacity-100 max-w-[160px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate leading-tight">{user?.name || 'Academic User'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
              <button 
                onClick={() => { logout(); navigate('/auth'); }} 
                className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0 ml-1 cursor-pointer"
                title={locale === 'tr' ? 'Çıkış Yap' : 'Log Out'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Minimal Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-3 sm:px-8 shrink-0 z-10 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-sm sm:text-lg font-bold text-slate-900 capitalize truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none">
              {location.pathname.includes('role-selector') 
                ? (locale === 'tr' ? 'Çalışma Alanları' : 'Workspaces') 
                : location.pathname.split('/').pop()?.replace('-', ' ')}
            </h1>
            
          </div>
          
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="relative group hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              <input 
                type="text" 
                placeholder={t('header.search')} 
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all w-48 lg:w-64"
                disabled={!isProfileValid}
              />
            </div>
            
            {/* Language Switcher */}
            <button 
              onClick={() => setLocale(locale === 'en' ? 'tr' : 'en')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              {locale === 'en' ? 'EN' : 'TR'}
            </button>

            <NotificationDropdown />
          </div>
        </header>

        {/* Profile Completion Gate Warning Banner */}
        <AnimatePresence>
          {!isProfileValid && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-amber-50 to-rose-50 border-b border-amber-200/50 shrink-0"
            >
              <div className="px-4 sm:px-8 py-3 flex items-start sm:items-center gap-3">
                <div className="p-1.5 bg-amber-100 rounded-md shrink-0">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-amber-800">
                  {locale === 'tr' 
                    ? "Lütfen devam etmek için aktif rolünüzün gerektirdiği zorunlu alanları doldurun." 
                    : "Please complete required fields for your active role to unlock navigation."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={!isProfileValid ? 'profile-lock' : location.pathname}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {/* Force intercept if profile is incomplete */}
              {!isProfileValid && !location.pathname.includes('/profile') ? (
                <Profile />
              ) : (
                <Outlet />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}

