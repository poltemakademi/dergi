import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck,
  CheckCircle2, ArrowRight, ShieldCheck, Zap
} from 'lucide-react';

const dict = {
  EN: {
    hero: {
      title: "DOI & Indexing Integration",
      subtitle: "Get official Crossref DOI registration for your articles with automated metadata syncing."
    },
    form: {
      title: "DOI Integration Request",
      desc: "Apply to enable automatic DOI minting for your journal.",
      journalName: "Journal Name",
      email: "Contact Email",
      articleCount: "Expected Annual Article Count",
      package: "Select Package",
      submit: "Submit Request"
    },
    trust: {
      col1Title: "Official Crossref Sponsor",
      col1Desc: "We handle all technical registration directly with Crossref.",
      col2Title: "Automated Minting",
      col2Desc: "DOIs are minted instantly when an article moves to Published state.",
      col3Title: "Metadata Sync",
      col3Desc: "References and citations are automatically deposited."
    }
  },
  TR: {
    hero: {
      title: "DOI ve İndeksleme Entegrasyonu",
      subtitle: "Makaleleriniz için otomatik üstveri senkronizasyonu ile resmi Crossref DOI kaydı alın."
    },
    form: {
      title: "DOI Entegrasyon Talebi",
      desc: "Derginiz için otomatik DOI atamasını etkinleştirmek üzere başvurun.",
      journalName: "Dergi Adı",
      email: "İletişim E-posta",
      articleCount: "Beklenen Yıllık Makale Sayısı",
      package: "Paket Seçimi",
      submit: "Talebi Gönder"
    },
    trust: {
      col1Title: "Resmi Crossref Sponsoru",
      col1Desc: "Tüm teknik kayıt süreçlerini doğrudan Crossref ile yönetiyoruz.",
      col2Title: "Otomatik Atama",
      col2Desc: "Bir makale Yayınlandı durumuna geçtiğinde DOI anında oluşturulur.",
      col3Title: "Üstveri Senkronizasyonu",
      col3Desc: "Referanslar ve atıflar otomatik olarak depolanır."
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function DoiApplication() {
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
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 relative overflow-hidden flex flex-col">
      <div className="fixed inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] -z-20 pointer-events-none opacity-40" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-sky-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      <main className="pt-40 pb-24 px-6 flex-1 flex flex-col items-center max-w-[1200px] mx-auto w-full z-10">
        
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
              <motion.div 
                key="doi-form"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                exit="exit"
                className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-[2rem] p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]"
              >
                <div className="mb-8 border-b border-slate-100 pb-6">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <FileCheck className="w-6 h-6 text-indigo-600" /> {t.form.title}
                  </h2>
                  <p className="text-slate-500 mt-2 font-medium">{t.form.desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <motion.div variants={fadeUp} className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.form.journalName}</label>
                    <input type="text" className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" placeholder="Journal Name" />
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.form.email}</label>
                    <input type="email" className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" placeholder="editor@journal.com" />
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.form.articleCount}</label>
                    <input type="number" className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" placeholder="e.g. 50" />
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.form.package}</label>
                    <select className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all appearance-none text-slate-700">
                      <option>Starter (up to 50 DOIs)</option>
                      <option>Pro (up to 200 DOIs)</option>
                      <option>Enterprise (Unlimited)</option>
                    </select>
                  </motion.div>
                </div>

                <motion.div variants={fadeUp} className="flex justify-end mt-10">
                  <button className="px-8 py-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 hover:shadow-[0_10px_25px_rgba(79,70,229,0.3)] transition-all flex items-center gap-2">
                    {t.form.submit} <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              </motion.div>
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-slate-200/60"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">{t.trust.col1Title}</h4>
            <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[250px]">{t.trust.col1Desc}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
              <Zap className="w-6 h-6" />
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
    </div>
  );
}
