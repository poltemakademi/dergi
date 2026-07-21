import { useState, useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLocaleStore } from '../store/useLocaleStore';
import { isProfileComplete } from '../utils/profileValidation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, FileText, Settings, 
  Inbox, BookOpen, PenTool, CheckSquare, Search, BarChart3, Globe, LogOut, Menu, X, AlertCircle,
  Mail, History, ChevronDown
} from 'lucide-react';
import NotificationDropdown from '../components/NotificationDropdown';
import Profile from '../pages/dashboard/Profile'; // Intercept component

export default function DashboardLayout() {
  const { isAuthenticated, activeRole, user, activeTenant, roles, logout, setActiveTenant } = useAuthStore();
  const { locale, setLocale, t } = useLocaleStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed] = useState(true); // Default to slim
  const [isHovered, setIsHovered] = useState(false);

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

  const navLinkClass = (path: string) => `py-2.5 flex items-center transition-all duration-700 ease-in-out ${
    !showExpanded ? 'px-0 justify-center rounded-xl' : 'px-3.5 justify-start gap-3 rounded-lg'
  } ${
    !isProfileValid && !path.includes('/profile') && !path.includes('/role-selector')
      ? 'opacity-40 pointer-events-none'
      : isActive(path) 
        ? 'text-slate-900 font-semibold bg-slate-100/80 shadow-sm border border-slate-200/50' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
  }`;

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
        className={`fixed inset-y-0 left-0 bg-white flex flex-col z-50 border-r border-slate-200/80 shadow-2xl lg:shadow-[4px_0_24px_rgba(0,0,0,0.01)] transition-all duration-700 ease-in-out lg:relative lg:translate-x-0 ${
          showExpanded ? 'w-60' : 'w-16'
        } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Sidebar Header */}
        <div className={`p-4 border-b border-slate-100 flex items-center justify-between ${!showExpanded ? 'flex-col gap-2 p-3' : ''}`}>
          <Link to="/" onClick={closeSidebar} className="flex items-center gap-2.5 hover:bg-slate-50 transition-colors group overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            {showExpanded && (
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors font-serif truncate">novaijournal</h2>
                <span className="text-[9px] text-slate-500 font-medium tracking-wide mt-1 block truncate">{t('nav.enterprise')}</span>
              </div>
            )}
          </Link>

          {/* Mobile Drawer Close Button */}
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50"
            onClick={closeSidebar}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Switcher - Forced Click */}
        <div 
          onClick={handleWorkspaceSwitch}
          className={`block p-3 border-b border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-100 transition-colors active:bg-slate-200 group relative z-50 ${!showExpanded ? 'flex justify-center' : ''}`}
          title={locale === 'tr' ? 'Çalışma Alanı Değiştir' : 'Switch Workspace'}
        >
          {showExpanded ? (
            <div className="flex items-center justify-between w-full pointer-events-none">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <LayoutDashboard className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-1.5">{t('nav.workspace')}</span>
                  <span className={`text-sm font-bold truncate leading-none transition-colors ${!activeTenant ? 'text-indigo-600' : 'text-slate-900 group-hover:text-indigo-700'}`}>
                    {activeTenant ? activeTenant.name : (locale === 'tr' ? 'Seçiniz...' : 'Select...')}
                  </span>
                </div>
              </div>
              <div className="shrink-0 text-slate-400 group-hover:text-indigo-600 transition-colors">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <div className="pointer-events-none w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:border-indigo-300 group-hover:text-indigo-600 text-indigo-500 transition-all">
              <LayoutDashboard className="w-4 h-4" />
            </div>
          )}
        </div>
        
        {/* Sidebar Navigation Items */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 flex flex-col gap-1 custom-scrollbar">
          <motion.div variants={itemVariants}>
            <Link 
              to={!isProfileValid ? '#' : "/dashboard/messages"} 
              onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} 
              className={navLinkClass('/dashboard/messages')}
              title={!showExpanded ? t('nav.communications') : undefined}
            >
              <Inbox className={`w-4 h-4 shrink-0 ${isActive('/dashboard/messages') ? 'text-slate-900' : 'text-slate-400'}`} />
              {showExpanded && <span className="text-xs font-semibold truncate">{t('nav.communications')}</span>}
              {showExpanded && <span className="ml-auto bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">3</span>}
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link 
              to="/dashboard/profile" 
              onClick={closeSidebar} 
              className={navLinkClass('/dashboard/profile')}
              title={!showExpanded ? t('nav.profile') : undefined}
            >
              <Users className={`w-4 h-4 shrink-0 ${isActive('/dashboard/profile') || !isProfileValid ? 'text-slate-900' : 'text-slate-400'}`} />
              {showExpanded && <span className="text-xs font-semibold truncate">{t('nav.profile')}</span>}
              {!isProfileValid && (
                <div className={`${!showExpanded ? 'absolute top-1 right-1' : 'ml-auto'} w-2 h-2 rounded-full bg-rose-500 animate-pulse`} />
              )}
            </Link>
          </motion.div>

          <AnimatePresence>
            {/* Editor Routes */}
            {(activeRole === 'editor') && (
              <motion.div 
                key="editor-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {showExpanded && (
                  <div className="mt-4 mb-1 px-3 border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('nav.executiveEditor')}</p>
                  </div>
                )}
                <Link to={!isProfileValid ? '#' : "/dashboard/editor/overview"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/editor/overview')} title={!showExpanded ? t('nav.analytics') : undefined}>
                  <BarChart3 className={`w-4 h-4 shrink-0 ${isActive('/dashboard/editor/overview') ? 'text-slate-900' : 'text-slate-400'}`} />
                  {showExpanded && <span className="text-xs font-semibold truncate">{t('nav.analytics')}</span>}
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/editor/articles"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/editor/articles')} title={!showExpanded ? t('nav.manuscripts') : undefined}>
                  <FileText className={`w-4 h-4 shrink-0 ${isActive('/dashboard/editor/articles') ? 'text-slate-900' : 'text-slate-400'}`} />
                  {showExpanded && <span className="text-xs font-semibold truncate">{t('nav.manuscripts')}</span>}
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/editor/issues"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/editor/issues')} title={!showExpanded ? t('nav.issueStudio') : undefined}>
                  <BookOpen className={`w-4 h-4 shrink-0 ${isActive('/dashboard/editor/issues') ? 'text-slate-900' : 'text-slate-400'}`} />
                  {showExpanded && <span className="text-xs font-semibold truncate">{t('nav.issueStudio')}</span>}
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/editor/settings"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/editor/settings')} title={!showExpanded ? t('nav.configuration') : undefined}>
                  <Settings className={`w-4 h-4 shrink-0 ${isActive('/dashboard/editor/settings') ? 'text-slate-900' : 'text-slate-400'}`} />
                  {showExpanded && <span className="text-xs font-semibold truncate">{t('nav.configuration')}</span>}
                </Link>
              </motion.div>
            )}

            {/* Reviewer Routes */}
            {(roles.includes('reviewer') || activeRole === 'reviewer') && (
              <motion.div 
                key="reviewer-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {showExpanded && (
                  <div className="mt-4 mb-1 px-3 border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('nav.reviewer')}</p>
                  </div>
                )}
                <Link to={!isProfileValid ? '#' : "/dashboard/reviewer/invitations"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/reviewer/invitations')} title={!showExpanded ? (locale === 'tr' ? 'Davetler' : 'Invitations') : undefined}>
                  <Mail className={`w-4 h-4 shrink-0 ${isActive('/dashboard/reviewer/invitations') ? 'text-slate-900' : 'text-slate-400'}`} />
                  {showExpanded && <span className="text-xs font-semibold truncate">{locale === 'tr' ? 'Davetler' : 'Invitations'}</span>}
                  {showExpanded && <span className="ml-auto bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">1</span>}
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/reviewer/assigned"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/reviewer/assigned')} title={!showExpanded ? t('nav.reviewQueue') : undefined}>
                  <CheckSquare className={`w-4 h-4 shrink-0 ${isActive('/dashboard/reviewer/assigned') ? 'text-slate-900' : 'text-slate-400'}`} />
                  {showExpanded && <span className="text-xs font-semibold truncate">{t('nav.reviewQueue')}</span>}
                  {showExpanded && <span className="ml-auto bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">2</span>}
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/reviewer/history"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/reviewer/history')} title={!showExpanded ? (locale === 'tr' ? 'Geçmiş' : 'History') : undefined}>
                  <History className={`w-4 h-4 shrink-0 ${isActive('/dashboard/reviewer/history') ? 'text-slate-900' : 'text-slate-400'}`} />
                  {showExpanded && <span className="text-xs font-semibold truncate">{locale === 'tr' ? 'Geçmiş' : 'History'}</span>}
                </Link>
              </motion.div>
            )}

            {/* Author Routes */}
            {(activeRole === 'author') && (
              <motion.div 
                key="author-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {showExpanded && (
                  <div className="mt-4 mb-1 px-3 border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('nav.author')}</p>
                  </div>
                )}
                <Link to={!isProfileValid ? '#' : "/dashboard/yazar/submissions"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/yazar/submissions')} title={!showExpanded ? t('nav.mySubmissions') : undefined}>
                  <FileText className={`w-4 h-4 shrink-0 ${isActive('/dashboard/yazar/submissions') ? 'text-slate-900' : 'text-slate-400'}`} />
                  {showExpanded && <span className="text-xs font-semibold truncate">{t('nav.mySubmissions')}</span>}
                </Link>
                <div className={!showExpanded ? 'mt-2 flex justify-center' : 'mt-3 px-2'}>
                  <Link 
                    to={!isProfileValid ? '#' : "/dashboard/yazar/submit-wizard"} 
                    onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} 
                    className={`bg-slate-900 hover:bg-slate-800 rounded-lg text-white font-medium transition-colors shadow-sm flex items-center justify-center gap-2 ${
                      !showExpanded ? 'w-9 h-9 p-0' : 'w-full py-2 px-3 text-xs'
                    } ${!isProfileValid ? 'opacity-40 pointer-events-none' : ''}`}
                    title={!showExpanded ? t('nav.newSubmission') : undefined}
                  >
                    <PenTool className="w-3.5 h-3.5 shrink-0" />
                    {showExpanded && <span className="truncate">{t('nav.newSubmission')}</span>}
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Layout Routes */}
            {(activeRole === 'layout_editor') && (
              <motion.div 
                key="layout-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {showExpanded && (
                  <div className="mt-4 mb-1 px-3 border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('nav.layoutEditor')}</p>
                  </div>
                )}
                <Link to={!isProfileValid ? '#' : "/dashboard/layout/queue"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/layout/queue')} title={!showExpanded ? t('nav.productionLine') : undefined}>
                  <Inbox className={`w-4 h-4 shrink-0 ${isActive('/dashboard/layout/queue') ? 'text-slate-900' : 'text-slate-400'}`} />
                  {showExpanded && <span className="text-xs font-semibold truncate">{t('nav.productionLine')}</span>}
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/layout/proofs"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/layout/proofs')} title={!showExpanded ? t('nav.galleyProofs') : undefined}>
                  <BookOpen className={`w-4 h-4 shrink-0 ${isActive('/dashboard/layout/proofs') ? 'text-slate-900' : 'text-slate-400'}`} />
                  {showExpanded && <span className="text-xs font-semibold truncate">{t('nav.galleyProofs')}</span>}
                </Link>
              </motion.div>
            )}

            {/* Super Admin Routes */}
            {(activeRole === 'super_admin') && (
              <motion.div 
                key="admin-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {showExpanded && (
                  <div className="mt-4 mb-1 px-3 border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Super Admin</p>
                  </div>
                )}
                <Link to={!isProfileValid ? '#' : "/dashboard/admin/system"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/admin/system')} title={!showExpanded ? 'System Overview' : undefined}>
                  <Settings className={`w-4 h-4 shrink-0 ${isActive('/dashboard/admin/system') ? 'text-slate-900' : 'text-slate-400'}`} />
                  {showExpanded && <span className="text-xs font-semibold truncate">System Overview</span>}
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/admin/users"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/admin/users')} title={!showExpanded ? 'User Management' : undefined}>
                  <Users className={`w-4 h-4 shrink-0 ${isActive('/dashboard/admin/users') ? 'text-slate-900' : 'text-slate-400'}`} />
                  {showExpanded && <span className="text-xs font-semibold truncate">User Management</span>}
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/admin/journals"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/admin/journals')} title={!showExpanded ? 'Journal Management' : undefined}>
                  <BookOpen className={`w-4 h-4 shrink-0 ${isActive('/dashboard/admin/journals') ? 'text-slate-900' : 'text-slate-400'}`} />
                  {showExpanded && <span className="text-xs font-semibold truncate">Journal Management</span>}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* User Mini Profile Footer */}
        <div className="p-2 sm:p-3 border-t border-slate-100 bg-white">
          <div className={`flex items-center ${!showExpanded ? 'justify-center flex-col gap-1.5' : 'gap-2 px-1'}`}>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
              <Users className="w-3.5 h-3.5 text-slate-500" />
            </div>
            {showExpanded && (
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            )}
            <button 
              onClick={() => { logout(); navigate('/auth'); }} 
              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
              title={locale === 'tr' ? 'Çıkış Yap' : 'Log Out'}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
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
              {!isProfileValid && !location.pathname.includes('/profile') && !location.pathname.includes('/role-selector') ? (
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

