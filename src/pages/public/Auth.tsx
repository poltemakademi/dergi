import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api/client';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User, ArrowRight, Shield, Briefcase
} from 'lucide-react';

const dict = {
  EN: {
    nav: { journals: "Journals Directory", sys: "System Features", early: "Early Access", login: "Log In", apply: "Submit Manuscript" },
    auth: {
      loginTitle: "Welcome Back",
      loginSubtitle: "Enter your credentials to access your academic dashboard.",
      registerTitle: "Create Account",
      registerSubtitle: "Join novaijournal and transform your publishing workflow.",
      email: "Email Address",
      password: "Password",
      name: "Full Name",
      forgot: "Forgot password?",
      loginBtn: "Sign In",
      registerBtn: "Create Account",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      registerLink: "Sign up now",
      loginLink: "Log in instead",
      or: "Or continue with",
      github: "GitHub",
      google: "Google",
      roleLabel: "Role / Account Type",
      roleAuthor: "Author",
      roleReviewer: "Reviewer",
      roleEditor: "Editor",
      roleLayout: "Layout Editor"
    },
    footer: {
      platform: "Platform", sys: "System Features", int: "Integrations", early: "Early Access",
      res: "Resources", apply: "Journal Applications", docs: "Technical Docs", api: "API Reference",
      rights: "All rights reserved.", terms: "Terms", privacy: "Privacy", cookies: "Cookies"
    }
  },
  TR: {
    nav: { journals: "Dergiler Dizini", sys: "Sistem Özellikleri", early: "Erken Erişim", login: "Giriş Yap", apply: "Yazar Başvurusu" },
    auth: {
      loginTitle: "Tekrar Hoş Geldiniz",
      loginSubtitle: "Akademik panelinize erişmek için bilgilerinizi girin.",
      registerTitle: "Hesap Oluştur",
      registerSubtitle: "novaijournal'a katılın ve yayın iş akışınızı dönüştürün.",
      email: "E-posta Adresi",
      password: "Şifre",
      name: "Ad Soyad",
      forgot: "Şifremi unuttum?",
      loginBtn: "Giriş Yap",
      registerBtn: "Hesap Oluştur",
      noAccount: "Hesabınız yok mu?",
      hasAccount: "Zaten bir hesabınız var mı?",
      registerLink: "Şimdi kaydolun",
      loginLink: "Bunun yerine giriş yapın",
      or: "Veya şununla devam edin",
      github: "GitHub",
      google: "Google",
      roleLabel: "Hesap Türü / Rol",
      roleAuthor: "Yazar",
      roleReviewer: "Hakem",
      roleEditor: "Editör",
      roleLayout: "Mizanpaj Editörü"
    },
    footer: {
      platform: "Platform", sys: "Sistem Özellikleri", int: "Entegrasyonlar", early: "Erken Erişim",
      res: "Kaynaklar", apply: "Dergi Başvuruları", docs: "Teknik Dokümanlar", api: "API Referansı",
      rights: "Tüm hakları saklıdır.", terms: "Şartlar", privacy: "Gizlilik", cookies: "Çerezler"
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

export default function Auth() {
  const [lang, setLangState] = useState<'EN' | 'TR'>(
    () => (localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR'
  );

  useEffect(() => {
    const handleLangChange = () => {
      setLangState((localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR');
    };
    window.addEventListener('lang-change', handleLangChange);
    return () => window.removeEventListener('lang-change', handleLangChange);
  }, []);
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('author');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        const response = await apiClient.post('/api/auth/login', { email, password });
        // Expected response format: { token: string, user: User, roles: Role[] }
        const { token, user, roles } = response.data;
        
        useAuthStore.getState().setAuth(token, user, roles);
        toast.success(lang === 'TR' ? 'Giriş başarılı!' : 'Login successful!');
        navigate('/dashboard');
      } else {
        const response = await apiClient.post('/api/auth/register', { 
          email, 
          password, 
          full_name: name, 
          role: role 
        });
        
        setSuccessMsg(lang === 'TR' ? 'Kayıt başarılı! Giriş yapabilirsiniz.' : 'Registration successful! You can now log in.');
        toast.success(lang === 'TR' ? 'Kayıt başarılı!' : 'Registration successful!');
        setIsLogin(true);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'An error occurred';
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const t = dict[lang];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 relative overflow-hidden flex flex-col">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] -z-20 pointer-events-none opacity-40" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-sky-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Navbar (Reused Layout) */}
      

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6 flex-1 flex flex-col items-center justify-center max-w-[1200px] mx-auto w-full z-10">
        
        <div className="w-full max-w-[440px] relative">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div 
                key="login"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                exit="exit"
                className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-[2rem] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-sky-400" />
                
                <div className="mb-8 text-center">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-sm border border-indigo-100/50">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{t.auth.loginTitle}</h1>
                  <p className="text-sm font-medium text-slate-500">{t.auth.loginSubtitle}</p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                    {errorMsg}
                  </div>
                )}
                
                {successMsg && (
                  <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200">
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleAuth}>
                  <div className="flex flex-col gap-5 mb-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">{t.auth.email}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-slate-800" 
                        placeholder="academic@university.edu" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center pl-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.auth.password}</label>
                      <a href="#" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">{t.auth.forgot}</a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-slate-800" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 hover:shadow-[0_10px_25px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2 mb-6 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : t.auth.loginBtn} <ArrowRight className="w-4 h-4" />
                </button>
                </form>

                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative px-4 bg-white text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.auth.or}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg> {t.auth.github}
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    {t.auth.google}
                  </button>
                </div>

                <div className="text-center text-sm font-medium text-slate-500">
                  {t.auth.noAccount} <button onClick={() => setIsLogin(false)} className="text-indigo-600 hover:text-indigo-700 font-bold ml-1">{t.auth.registerLink}</button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="register"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                exit="exit"
                className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-[2rem] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-indigo-500" />
                
                <div className="mb-8 text-center">
                  <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 mx-auto mb-4 shadow-sm border border-sky-100/50">
                    <User className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{t.auth.registerTitle}</h1>
                  <p className="text-sm font-medium text-slate-500">{t.auth.registerSubtitle}</p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleAuth}>
                  <div className="flex flex-col gap-4 mb-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">{t.auth.name}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-slate-800" 
                        placeholder="Dr. Jane Doe" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">{t.auth.email}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-slate-800" 
                        placeholder="academic@university.edu" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">{t.auth.password}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-slate-800" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">{t.auth.roleLabel}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-slate-400" />
                      </div>
                      <select 
                        required
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-slate-800 appearance-none" 
                      >
                        <option value="author">{t.auth.roleAuthor}</option>
                        <option value="reviewer">{t.auth.roleReviewer}</option>
                        <option value="editor">{t.auth.roleEditor}</option>
                        <option value="layout_editor">{t.auth.roleLayout}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 hover:shadow-[0_10px_25px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2 mb-6 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : t.auth.registerBtn} <ArrowRight className="w-4 h-4" />
                </button>
                </form>

                <div className="text-center text-sm font-medium text-slate-500">
                  {t.auth.hasAccount} <button onClick={() => setIsLogin(true)} className="text-indigo-600 hover:text-indigo-700 font-bold ml-1">{t.auth.loginLink}</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Footer Reused */}
      
    </div>
  );
}
