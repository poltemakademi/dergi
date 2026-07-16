import { useState, useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLocaleStore } from '../store/useLocaleStore';
import { isProfileComplete } from '../utils/profileValidation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, FileText, Settings, 
  Inbox, BookOpen, PenTool, CheckSquare, Search, BarChart3, Globe, ArrowLeft, LogOut, Menu, X, AlertCircle
} from 'lucide-react';
import NotificationDropdown from '../components/NotificationDropdown';
import Profile from '../pages/dashboard/Profile'; // Intercept component

export default function DashboardLayout() {
  const { activeRole, user, activeTenant, roles, logout } = useAuthStore();
  const { locale, setLocale, t } = useLocaleStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { isValid: isProfileValid } = useMemo(() => isProfileComplete(activeRole, user), [activeRole, user]);

  const isActive = (path: string) => location.pathname.includes(path);

  const navLinkClass = (path: string) => `px-4 py-2.5 flex items-center gap-3 rounded-lg transition-all duration-200 ${
    !isProfileValid && path !== '/dashboard/profile'
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
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Enterprise Sidebar */}
      <motion.aside 
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        className={`fixed inset-y-0 left-0 w-72 bg-white flex flex-col z-30 border-r border-slate-200/80 shadow-[4px_0_24px_rgba(0,0,0,0.01)] transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" onClick={closeSidebar} className="flex items-center gap-3 hover:bg-slate-50 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-white shadow-sm group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors font-serif">novaijournal</h2>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-1 block">{t('nav.enterprise')}</span>
            </div>
          </Link>
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50"
            onClick={closeSidebar}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 custom-scrollbar">
          <motion.div variants={itemVariants} className="mb-2 px-4 mt-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('nav.workspace')}</p>
          </motion.div>
          
          {roles.length > 1 && (
            <motion.div variants={itemVariants}>
              <Link 
                to={!isProfileValid ? '#' : "/dashboard/role-selector"} 
                onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} 
                className={navLinkClass('/dashboard/role-selector')}
              >
                <LayoutDashboard className={`w-4 h-4 ${isActive('/dashboard/role-selector') ? 'text-slate-900' : 'text-slate-400'}`} />
                <span className="text-sm">{t('nav.contextMatrix')}</span>
              </Link>
            </motion.div>
          )}
          <motion.div variants={itemVariants}>
            <Link 
              to={!isProfileValid ? '#' : "/dashboard/messages"} 
              onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} 
              className={navLinkClass('/dashboard/messages')}
            >
              <Inbox className={`w-4 h-4 ${isActive('/dashboard/messages') ? 'text-slate-900' : 'text-slate-400'}`} />
              <span className="text-sm">{t('nav.communications')}</span>
              <span className="ml-auto bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">3</span>
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link to="/dashboard/profile" onClick={closeSidebar} className={navLinkClass('/dashboard/profile')}>
              <Users className={`w-4 h-4 ${isActive('/dashboard/profile') || !isProfileValid ? 'text-slate-900' : 'text-slate-400'}`} />
              <span className="text-sm">{t('nav.profile')}</span>
              {!isProfileValid && (
                <div className="ml-auto w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </Link>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Editor Routes */}
            {activeRole === 'editor' && (
              <motion.div 
                key="editor-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-8 mb-2 px-4 border-t border-slate-100 pt-6">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('nav.executiveEditor')}</p>
                </div>
                <Link to={!isProfileValid ? '#' : "/dashboard/editor/overview"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/editor/overview')}>
                  <BarChart3 className={`w-4 h-4 ${isActive('/dashboard/editor/overview') ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span className="text-sm">{t('nav.analytics')}</span>
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/editor/articles"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/editor/articles')}>
                  <FileText className={`w-4 h-4 ${isActive('/dashboard/editor/articles') ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span className="text-sm">{t('nav.manuscripts')}</span>
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/editor/issues"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/editor/issues')}>
                  <BookOpen className={`w-4 h-4 ${isActive('/dashboard/editor/issues') ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span className="text-sm">{t('nav.issueStudio')}</span>
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/editor/settings"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/editor/settings')}>
                  <Settings className={`w-4 h-4 ${isActive('/dashboard/editor/settings') ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span className="text-sm">{t('nav.configuration')}</span>
                </Link>
              </motion.div>
            )}

            {/* Author Routes */}
            {activeRole === 'author' && (
              <motion.div 
                key="author-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-8 mb-2 px-4 border-t border-slate-100 pt-6">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('nav.author')}</p>
                </div>
                <Link to={!isProfileValid ? '#' : "/dashboard/yazar/submissions"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/yazar/submissions')}>
                  <FileText className={`w-4 h-4 ${isActive('/dashboard/yazar/submissions') ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span className="text-sm">{t('nav.mySubmissions')}</span>
                </Link>
                <div className="mt-4 px-4">
                  <Link 
                    to={!isProfileValid ? '#' : "/dashboard/yazar/submit-wizard"} 
                    onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} 
                    className={`w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 rounded-lg text-white text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 ${!isProfileValid ? 'opacity-40 pointer-events-none' : ''}`}
                  >
                    <PenTool className="w-4 h-4" />
                    <span>{t('nav.newSubmission')}</span>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Reviewer Routes */}
            {activeRole === 'reviewer' && (
              <motion.div 
                key="reviewer-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-8 mb-2 px-4 border-t border-slate-100 pt-6">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('nav.reviewer')}</p>
                </div>
                <Link to={!isProfileValid ? '#' : "/dashboard/reviewer/assigned"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/reviewer/assigned')}>
                  <CheckSquare className={`w-4 h-4 ${isActive('/dashboard/reviewer/assigned') ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span className="text-sm">{t('nav.reviewQueue')}</span>
                  <span className="ml-auto bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">2</span>
                </Link>
              </motion.div>
            )}

            {/* Layout Routes */}
            {activeRole === 'layout_editor' && (
              <motion.div 
                key="layout-nav"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-8 mb-2 px-4 border-t border-slate-100 pt-6">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('nav.layoutEditor')}</p>
                </div>
                <Link to={!isProfileValid ? '#' : "/dashboard/layout/queue"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/layout/queue')}>
                  <Inbox className={`w-4 h-4 ${isActive('/dashboard/layout/queue') ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span className="text-sm">{t('nav.productionLine')}</span>
                </Link>
                <Link to={!isProfileValid ? '#' : "/dashboard/layout/proofs"} onClick={!isProfileValid ? (e) => e.preventDefault() : closeSidebar} className={navLinkClass('/dashboard/layout/proofs')}>
                  <BookOpen className={`w-4 h-4 ${isActive('/dashboard/layout/proofs') ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span className="text-sm">{t('nav.galleyProofs')}</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* User Mini Profile */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <Link to="/" className="mb-4 flex items-center justify-center gap-2 w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> {t('nav.returnToWebsite')}
          </Link>
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
              <Users className="w-4 h-4 text-slate-500" />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{user?.name}</p>
              <p className="text-[11px] text-slate-500 truncate mb-1.5">{user?.email}</p>
              {activeRole && (
                <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase bg-indigo-50 text-indigo-600 border border-indigo-100/50 shadow-sm">
                  {locale === 'tr' ? 
                    (activeRole === 'author' ? 'Yazar' : 
                     activeRole === 'editor' ? 'Editör' : 
                     activeRole === 'reviewer' ? 'Hakem' : 
                     activeRole === 'layout_editor' ? 'Mizanpaj' : activeRole) : 
                    activeRole.replace('_', ' ')}
                </div>
              )}
            </div>
            <button 
              onClick={() => { logout(); navigate('/auth'); }} 
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              title={locale === 'tr' ? 'Çıkış Yap' : 'Log Out'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Minimal Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-lg font-bold text-slate-900 capitalize hidden sm:block">
              {location.pathname.split('/').pop()?.replace('-', ' ')}
            </h1>
            
            {activeTenant && (
              <div className="hidden sm:block h-4 w-px bg-slate-200 mx-2" />
            )}
            
            {activeTenant && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={activeTenant.id}
                className="hidden sm:flex text-xs font-semibold text-slate-500 items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                {activeTenant.name}
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
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
              className="bg-gradient-to-r from-amber-50 to-rose-50 border-b border-amber-200/50"
            >
              <div className="px-4 sm:px-8 py-3 flex items-start sm:items-center gap-3">
                <div className="p-1.5 bg-amber-100 rounded-md shrink-0">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-sm font-medium text-amber-800">
                  {locale === 'tr' 
                    ? "Lütfen devam etmek için aktif rolünüzün gerektirdiği zorunlu alanları doldurun." 
                    : "Please complete required fields for your active role to unlock navigation."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
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
              {!isProfileValid ? (
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
