import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  UploadCloud, CheckCircle2, ArrowRight, Server, Lock
} from 'lucide-react';

const dict = {
  EN: {
    nav: { journals: "Journals Directory", sys: "System Features", early: "Early Access", pricing: "Pricing", login: "Log In", apply: "Submit Manuscript" },
    hero: {
      title: "Join novaijournal for Free",
      subtitle: "Experience the next generation of academic publishing. 100% free enterprise hosting for your journal."
    },
    platform: {
      title: "Free Journal Onboarding",
      desc: "Full infrastructure onboarding for academic journals at zero cost.",
      nativeTitle: "Journal Native Title",
      language: "Primary Language",
      issn: "E-ISSN / ISSN",
      affiliation: "Institutional Affiliation",
      indexing: "Indexing Compliance Targets",
      permission: "Official Hosting Permission Asset",
      dropzone: "Drop signed PDF here (Max 5MB)",
      submit: "Apply for Free"
    },
    trust: {
      col1Title: "Automated Crossref Minting",
      col1Desc: "Zero-delay DOI registration upon publication approval.",
      col2Title: "TLS 1.3 Data Vault Hashing",
      col2Desc: "Military-grade encryption for all manuscript assets.",
      col3Title: "24-Hour Editorial Approval",
      col3Desc: "Rapid onboarding verification by our global compliance team."
    }
  },
  TR: {
    nav: { journals: "Dergiler Dizini", sys: "Sistem Özellikleri", early: "Erken Erişim", pricing: "Fiyatlandırma", login: "Giriş Yap", apply: "Yazar Başvurusu" },
    hero: {
      title: "novaijournal'a Ücretsiz Katılın",
      subtitle: "Akademik yayıncılığın yeni neslini deneyimleyin. Derginiz için %100 ücretsiz kurumsal barındırma."
    },
    platform: {
      title: "Ücretsiz Dergi Kayıt Portalı",
      desc: "Akademik dergiler için ücretsiz ve tam kapsamlı altyapı katılımı.",
      nativeTitle: "Dergi Orijinal Adı",
      language: "Birincil Dil",
      issn: "E-ISSN / ISSN",
      affiliation: "Kurumsal Üyelik",
      indexing: "Hedeflenen İndeksleme",
      permission: "Resmi Barındırma İzin Belgesi",
      dropzone: "İmzalı PDF'i buraya bırakın (Maks 5MB)",
      submit: "Ücretsiz Başvuru Yap"
    },
    trust: {
      col1Title: "Otomatik Crossref Ataması",
      col1Desc: "Yayın onayında sıfır gecikmeli DOI kaydı.",
      col2Title: "TLS 1.3 Veri Kasası (Hashing)",
      col2Desc: "Tüm makale varlıkları için askeri düzeyde şifreleme.",
      col3Title: "24 Saat İçinde Editoryal Onay",
      col3Desc: "Küresel uyum ekibimiz tarafından hızlı katılım doğrulaması."
    }
  }
};

/* =========================================================
   ANIMATION VARIANTS
   ========================================================= */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
export default function Applications() {
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



  const t = dict[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 relative overflow-hidden flex flex-col">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] -z-20 pointer-events-none opacity-40" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-sky-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Navbar (Reused Layout) */}
      

      {/* Main Content */}
      <main className="pt-40 pb-24 px-6 flex-1 flex flex-col items-center max-w-[1200px] mx-auto w-full z-10">
        
        {/* 1. MINIMALIST DUAL-OPTION HERO */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">{t.hero.title}</h1>
          <p className="text-lg font-medium text-slate-500">{t.hero.subtitle}</p>
        </motion.div>

        <div className="w-full relative min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* COLUMN A: Journal Platform Application */}
              <motion.div 
                key="platform"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                exit="exit"
                className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-[2rem] p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]"
              >
                <div className="mb-8 border-b border-slate-100 pb-6">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-indigo-600" /> {t.platform.title}
                  </h2>
                  <p className="text-slate-500 mt-2 font-medium">{t.platform.desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <motion.div variants={fadeUp} className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.platform.nativeTitle}</label>
                    <input type="text" className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" placeholder="e.g. Türk Tıp Dergisi" />
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.platform.language}</label>
                    <select className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all appearance-none text-slate-700">
                      <option>English</option>
                      <option>Turkish</option>
                      <option>Arabic</option>
                    </select>
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.platform.issn}</label>
                    <input type="text" className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" placeholder="XXXX-XXXX" />
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.platform.affiliation}</label>
                    <input type="text" className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" placeholder="University or Institution Name" />
                  </motion.div>
                </div>

                <motion.div variants={fadeUp} className="mb-8">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">{t.platform.indexing}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Scopus', 'Web of Science', 'TR Dizin', 'Sobiad'].map((idx) => (
                      <label key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors has-[:checked]:border-indigo-400 has-[:checked]:bg-indigo-50/30 has-[:checked]:ring-1 has-[:checked]:ring-indigo-400">
                        <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                        <span className="text-sm font-bold text-slate-700">{idx}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="mb-10">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">{t.platform.permission}</label>
                  <div className="h-40 rounded-2xl border-2 border-dashed border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-300 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group">
                    <div className="p-3 bg-white rounded-full shadow-sm text-indigo-500 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-slate-500 group-hover:text-indigo-600">{t.platform.dropzone}</span>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="flex justify-end">
                  <button className="px-8 py-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 hover:shadow-[0_10px_25px_rgba(79,70,229,0.3)] transition-all flex items-center gap-2">
                    {t.platform.submit} <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. PREMIUM ASSURANCE & TRUST ROW */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-slate-200/60"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
              <Server className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">{t.trust.col1Title}</h4>
            <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[250px]">{t.trust.col1Desc}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">{t.trust.col2Title}</h4>
            <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[250px]">{t.trust.col2Desc}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-4 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">{t.trust.col3Title}</h4>
            <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[250px]">{t.trust.col3Desc}</p>
          </div>
        </motion.div>

      </main>

      {/* Footer Reused */}
      
    </div>
  );
}
