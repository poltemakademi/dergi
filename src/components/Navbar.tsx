import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Check, ChevronDown, Menu, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuthStore } from '../store/useAuthStore';
import { useJournalTabStore } from '../store/useJournalTabStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, lang, setLang } = useTranslation();
  const { isAuthenticated, activeRole, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const { activeTab, setActiveTab } = useJournalTabStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isJournalPage = path !== '/' && 
    !path.startsWith('/dashboard') &&
    !['/directory', '/sistem-ozellikleri', '/entegrasyonlar', '/early-access', '/auth', '/about', '/author-applications', '/technical-docs', '/api-reference', '/ethical-guidelines', '/open-access-policy', '/kvkk', '/sales-agreement'].includes(path);

  const tenantSlug = path.split('/')[1];

  const tabs = [
    { id: 'Anasayfa', label: t.journal?.tabHome || 'Home' },
    { id: 'Hakkimizda', label: t.journal?.tabAbout || 'About' },
    { id: 'YayinKurulu', label: t.journal?.tabEditorial || 'Editorial Board' },
    { id: 'DanismaKurulu', label: t.journal?.tabAdvisory || 'Advisory Board' },
    { id: 'AmacKapsam', label: t.journal?.tabScope || 'Aims & Scope' },
    { id: 'YazimIlkeleri', label: t.journal?.tabPrinciples || 'Writing Principles' },
    { id: 'Yayinevi', label: t.journal?.tabPublisher || 'About Publisher' },
    { id: 'Iletisim', label: t.journal?.tabContact || 'Contact' }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (path !== `/${tenantSlug}`) {
      navigate(`/${tenantSlug}`);
    }
    setTimeout(() => {
      const element = document.getElementById('journal-content');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <nav className={`fixed z-50 transition-all duration-500 left-1/2 -translate-x-1/2 max-w-[1200px] w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] flex flex-col justify-between ${scrolled ? 'top-2 md:top-4 bg-white/90 backdrop-blur-2xl border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] py-2.5 px-4 rounded-[2rem]' : 'top-3 md:top-6 bg-white border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] py-3 px-5 rounded-[2.2rem]'}`}>

      {/* Main Navbar Top Row */}
      <div className="flex items-center justify-between w-full">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group pl-2">
          <div className="flex gap-[3px] items-center">
            <div className="w-1.5 h-7 bg-indigo-600 rounded-full group-hover:h-8 group-hover:bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
            <div className="w-1.5 h-5 bg-sky-400 rounded-full group-hover:h-7 group-hover:bg-sky-300 transition-all duration-300 delay-75 shadow-[0_0_10px_rgba(56,189,248,0.4)]" />
            <div className="w-1.5 h-6 bg-indigo-300 rounded-full group-hover:h-5 group-hover:bg-indigo-200 transition-all duration-300 delay-150" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-950 transition-colors font-serif">
            novai<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500 animate-gradient-x bg-[length:200%_auto]">journal</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm font-bold">
          <Link to="/directory" className="hover:text-indigo-600 text-slate-600 transition-colors py-2">{t.nav.journals}</Link>
          <Link to="/early-access" className="hover:text-indigo-600 text-slate-600 transition-colors py-2">{t.nav.early}</Link>
          <Link to="/sistem-ozellikleri" className="hover:text-indigo-600 text-slate-600 transition-colors py-2">{t.nav.sys}</Link>
          <Link to="/about" className="hover:text-indigo-600 text-slate-600 transition-colors py-2">{t.nav.about}</Link>
        </div>

        <div className="flex items-center gap-2.5 pr-1">
          {/* Language Switcher */}
          <div className="relative group/lang hidden sm:block">
            <button className="flex items-center gap-1.5 px-3 py-2.5 text-slate-600 hover:text-indigo-600 transition-colors rounded-full font-bold text-xs cursor-pointer">
              <Globe className="w-4 h-4" />
              <span>{lang}</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </button>
            <div className="absolute top-full right-0 mt-2 w-32 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-300 z-50 translate-y-2 group-hover/lang:translate-y-0 origin-top overflow-hidden">
              <div className="p-1.5">
                <button onClick={() => setLang('EN')} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-between ${lang === 'EN' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                  English
                  {lang === 'EN' && <Check className="w-3 h-3" />}
                </button>
                <button onClick={() => setLang('TR')} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-between ${lang === 'TR' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                  Türkçe
                  {lang === 'TR' && <Check className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="hidden sm:flex relative group overflow-hidden px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_-5px_rgba(79,70,229,0.4)] transition-all duration-300 cursor-pointer items-center gap-2">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  {t.nav.dashboard}
                  {activeRole && <span className="opacity-80">({t.roles?.[activeRole] || activeRole})</span>}
                </span>
              </Link>
              <button 
                onClick={() => { logout(); navigate('/auth'); }}
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-rose-100 transition-colors border border-rose-200/50 cursor-pointer shadow-sm"
              >
                {lang === 'EN' ? 'Log Out' : 'Çıkış Yap'}
              </button>
            </div>
          ) : (
            <>
              <Link to="/auth" className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-slate-100 transition-colors border border-slate-200/50 cursor-pointer shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                {t.nav.login}
              </Link>
              <Link to="/auth" className="hidden sm:flex relative group overflow-hidden px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_-5px_rgba(79,70,229,0.4)] transition-all duration-300 cursor-pointer items-center gap-2">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">{t.nav.apply}</span>
              </Link>
            </>
          )}

          <button 
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Burger Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full lg:hidden flex flex-col pt-6 overflow-hidden"
          >
            <div className="flex flex-col gap-4 text-base font-bold text-slate-800 px-4 pb-6">
              <Link to="/directory" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-indigo-600 transition-colors">{t.nav.journals}</Link>
              <Link to="/early-access" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-indigo-600 transition-colors">{t.nav.early}</Link>
              <Link to="/sistem-ozellikleri" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-indigo-600 transition-colors">{t.nav.sys}</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-indigo-600 transition-colors">{t.nav.about}</Link>
            </div>
            
            <div className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col gap-4 rounded-b-[2rem] -mx-4 -mb-2.5 sm:-mx-5 sm:-mb-3">
              <div className="flex items-center justify-between text-sm font-bold text-slate-600 mb-2">
                <span>{lang === 'EN' ? 'Language' : 'Dil'}</span>
                <div className="flex bg-slate-200/50 rounded-lg p-1">
                  <button onClick={() => setLang('EN')} className={`px-4 py-1.5 rounded-md transition-colors ${lang === 'EN' ? 'bg-white text-indigo-600 shadow-sm' : ''}`}>EN</button>
                  <button onClick={() => setLang('TR')} className={`px-4 py-1.5 rounded-md transition-colors ${lang === 'TR' ? 'bg-white text-indigo-600 shadow-sm' : ''}`}>TR</button>
                </div>
              </div>
              
              {!isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3.5 bg-white text-slate-900 text-center text-sm font-bold uppercase tracking-wider rounded-xl border border-slate-200 shadow-sm">{t.nav.login}</Link>
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3.5 bg-indigo-600 text-white text-center text-sm font-bold uppercase tracking-wider rounded-xl shadow-sm">{t.nav.apply}</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3.5 bg-indigo-600 text-white text-center text-sm font-bold uppercase tracking-wider rounded-xl shadow-sm">{t.nav.dashboard}</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/auth'); }} className="w-full py-3.5 bg-rose-50 text-rose-600 text-center text-sm font-bold uppercase tracking-wider rounded-xl border border-rose-200 shadow-sm">{lang === 'EN' ? 'Log Out' : 'Çıkış Yap'}</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Secondary Navigation Tabs Row for Journal Pages */}
      <AnimatePresence>
        {isJournalPage && scrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 10 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full border-t border-slate-100/80 pt-2 flex items-center justify-start lg:justify-center gap-4 md:gap-5 overflow-x-auto scrollbar-none px-2"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative pb-2 pt-1 px-1 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${activeTab === tab.id
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="navActiveTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
