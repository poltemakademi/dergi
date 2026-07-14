import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Check, ChevronDown, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const dict = {
  EN: {
    nav: { journals: "Directory", sys: "System Features", early: "Early Access", pricing: "Pricing", login: "Log In", apply: "Author Application", about: "About Us", dashboard: "Dashboard" }
  },
  TR: {
    nav: { journals: "Dergiler Dizini", sys: "Sistem Özellikleri", early: "Erken Erişim", pricing: "Fiyatlandırma", login: "Giriş Yap", apply: "Yazar Başvurusu", about: "Hakkımızda", dashboard: "Kontrol Paneli" }
  }
};

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout, activeRole } = useAuthStore();
  const [lang, setLangState] = useState<'EN' | 'TR'>(
    () => (localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR'
  );

  const t = dict[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleLangChange = () => {
      setLangState((localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR');
    };
    window.addEventListener('lang-change', handleLangChange);
    return () => window.removeEventListener('lang-change', handleLangChange);
  }, []);

  const setLang = (l: 'EN' | 'TR') => {
    localStorage.setItem('app_lang', l);
    setLangState(l);
    window.dispatchEvent(new Event('lang-change'));
  };

  return (
    <nav className={`fixed z-50 transition-all duration-500 left-1/2 -translate-x-1/2 max-w-[1200px] w-[calc(100%-2rem)] flex items-center justify-between ${scrolled ? 'top-4 bg-white/90 backdrop-blur-2xl border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] py-3 px-4 rounded-[2.5rem]' : 'top-6 bg-white border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] py-3.5 px-5 rounded-[2.5rem]'}`}>

      <Link to="/" className="flex items-center gap-3 cursor-pointer group pl-2">
        <div className="flex gap-[3px] items-center">
          <div className="w-1.5 h-7 bg-indigo-600 rounded-full group-hover:h-8 group-hover:bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
          <div className="w-1.5 h-5 bg-sky-400 rounded-full group-hover:h-7 group-hover:bg-sky-300 transition-all duration-300 delay-75 shadow-[0_0_10px_rgba(56,189,248,0.4)]" />
          <div className="w-1.5 h-6 bg-indigo-300 rounded-full group-hover:h-5 group-hover:bg-indigo-200 transition-all duration-300 delay-150" />
        </div>
        <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-950 transition-colors">
          novaijournal
        </span>
      </Link>

      <div className="hidden lg:flex items-center gap-8 text-sm font-bold">
        <Link to="/" className="hover:text-indigo-600 text-slate-600 transition-colors py-2">{t.nav.journals}</Link>
        <Link to="/early-access" className="hover:text-indigo-600 text-slate-600 transition-colors py-2">{t.nav.early}</Link>
        <Link to="/sistem-ozellikleri" className="hover:text-indigo-600 text-slate-600 transition-colors py-2">{t.nav.sys}</Link>
        <Link to="/about" className="hover:text-indigo-600 text-slate-600 transition-colors py-2">{t.nav.about}</Link>
      </div>

      <div className="flex items-center gap-2.5 pr-1">
        {/* Language Switcher */}
        <div className="relative group/lang hidden sm:block">
          <button className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-indigo-600 transition-colors rounded-full font-bold text-xs cursor-pointer">
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

        {!isAuthenticated ? (
          <>
            <Link to="/auth" className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-700 text-xs font-black tracking-widest uppercase rounded-full hover:bg-slate-100 transition-colors border border-slate-200/50 cursor-pointer shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              {t.nav.login}
            </Link>
            <Link to="/auth" className="relative group overflow-hidden px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-full shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_-5px_rgba(79,70,229,0.4)] transition-all duration-300 cursor-pointer flex items-center gap-2">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">{t.nav.apply}</span>
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => { logout(); navigate('/auth'); }}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title={lang === 'TR' ? 'Çıkış Yap' : 'Log Out'}
            >
              <LogOut className="w-4 h-4" />
            </button>
            <Link to="/dashboard" className="relative group overflow-hidden px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-full shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_-5px_rgba(79,70,229,0.4)] transition-all duration-300 cursor-pointer flex items-center gap-2">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)] relative z-10" />
              <span className="relative z-10 flex items-center gap-2">
                {activeRole ? (lang === 'TR' ?
                  (activeRole === 'author' ? 'Yazar' :
                    activeRole === 'editor' ? 'Editör' :
                      activeRole === 'reviewer' ? 'Hakem' :
                        activeRole === 'layout_editor' ? 'Mizanpaj' : 'Panel') :
                  activeRole.charAt(0).toUpperCase() + activeRole.slice(1).replace('_', ' ')) : ''} {t.nav.dashboard}
              </span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
