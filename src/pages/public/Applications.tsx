import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  UploadCloud, CheckCircle2, ArrowRight, Server, Lock, X, FileText, Loader2
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { toast } from 'sonner';

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
      submit: "Apply for Free",
      fileSelected: "Selected file:",
      remove: "Remove",
      submitting: "Submitting...",
      invalidFile: "Please select a valid PDF file under 5MB.",
      fillRequired: "Please fill all required fields.",
      success: "Journal application submitted successfully!",
      error: "Failed to submit journal application."
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
      submit: "Ücretsiz Başvuru Yap",
      fileSelected: "Seçilen dosya:",
      remove: "Kaldır",
      submitting: "Gönderiliyor...",
      invalidFile: "Lütfen 5MB'ın altında geçerli bir PDF dosyası seçin.",
      fillRequired: "Lütfen tüm zorunlu alanları doldurun.",
      success: "Dergi başvurusu başarıyla gönderildi!",
      error: "Dergi başvurusu gönderilemedi."
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

  // Form States
  const [nativeTitle, setNativeTitle] = useState('');
  const [language, setLanguage] = useState('English');
  const [issn, setIssn] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [indexing, setIndexing] = useState<string[]>([]);
  const [permissionFile, setPermissionFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleIndexingChange = (idx: string, checked: boolean) => {
    if (checked) {
      setIndexing(prev => [...prev, idx]);
    } else {
      setIndexing(prev => prev.filter(item => item !== idx));
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error(t.platform.invalidFile);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t.platform.invalidFile);
      return;
    }
    setPermissionFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nativeTitle.trim() || !issn.trim() || !affiliation.trim() || !permissionFile) {
      toast.error(t.platform.fillRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('nativeTitle', nativeTitle.trim());
      formData.append('language', language);
      formData.append('issn', issn.trim());
      formData.append('affiliation', affiliation.trim());
      formData.append('indexing', JSON.stringify(indexing));
      formData.append('file', permissionFile);

      await apiClient.post('/api/applications/journal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(t.platform.success);
      // Reset form fields
      setNativeTitle('');
      setLanguage('English');
      setIssn('');
      setAffiliation('');
      setIndexing([]);
      setPermissionFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Failed to submit journal application:', err);
      toast.error(err?.response?.data?.message || t.platform.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 relative overflow-hidden flex flex-col">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] -z-20 pointer-events-none opacity-40" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-sky-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

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
                <form onSubmit={handleSubmit}>
                  <div className="mb-8 border-b border-slate-100 pb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                      <BookOpen className="w-6 h-6 text-indigo-600" /> {t.platform.title}
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">{t.platform.desc}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <motion.div variants={fadeUp} className="flex flex-col gap-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.platform.nativeTitle}</label>
                      <input 
                        type="text" 
                        value={nativeTitle}
                        onChange={(e) => setNativeTitle(e.target.value)}
                        disabled={isSubmitting}
                        required
                        className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all disabled:opacity-50" 
                        placeholder="e.g. Türk Tıp Dergisi" 
                      />
                    </motion.div>
                    <motion.div variants={fadeUp} className="flex flex-col gap-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.platform.language}</label>
                      <div className="relative">
                        <select 
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all appearance-none text-slate-700 disabled:opacity-50 pr-10"
                        >
                          <option value="English">English</option>
                          <option value="Turkish">Turkish</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div variants={fadeUp} className="flex flex-col gap-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.platform.issn}</label>
                      <input 
                        type="text" 
                        value={issn}
                        onChange={(e) => setIssn(e.target.value)}
                        disabled={isSubmitting}
                        required
                        className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all disabled:opacity-50" 
                        placeholder="XXXX-XXXX" 
                      />
                    </motion.div>
                    <motion.div variants={fadeUp} className="flex flex-col gap-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.platform.affiliation}</label>
                      <input 
                        type="text" 
                        value={affiliation}
                        onChange={(e) => setAffiliation(e.target.value)}
                        disabled={isSubmitting}
                        required
                        className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all disabled:opacity-50" 
                        placeholder="University or Institution Name" 
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={fadeUp} className="mb-8">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">{t.platform.indexing}</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Scopus', 'Web of Science', 'TR Dizin', 'Sobiad'].map((idx) => {
                        const isChecked = indexing.includes(idx);
                        return (
                          <label 
                            key={idx} 
                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                              isChecked 
                                ? 'border-indigo-400 bg-indigo-50/30 ring-1 ring-indigo-400' 
                                : 'border-slate-200 bg-white hover:bg-slate-50'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              disabled={isSubmitting}
                              onChange={(e) => handleIndexingChange(idx, e.target.checked)}
                              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" 
                            />
                            <span className="text-sm font-bold text-slate-700">{idx}</span>
                          </label>
                        );
                      })}
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp} className="mb-10">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">{t.platform.permission}</label>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept=".pdf" 
                      className="hidden" 
                      onChange={handleFileChange}
                      disabled={isSubmitting}
                    />

                    <div 
                      onClick={() => !isSubmitting && fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); if (!isSubmitting) setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (isSubmitting) return;
                        const file = e.dataTransfer.files[0];
                        if (file) validateAndSetFile(file);
                      }}
                      className={`h-40 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group ${
                        isDragging 
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-inner' 
                          : 'border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-300'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {permissionFile ? (
                        <div className="flex flex-col items-center gap-2 px-4 text-center">
                          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full shadow-sm">
                            <FileText className="w-6 h-6 animate-pulse" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-700 truncate max-w-xs">{permissionFile.name}</span>
                            <span className="text-xs text-slate-400 font-medium">({(permissionFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setPermissionFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1 mt-1"
                          >
                            <X className="w-3 h-3" /> {t.platform.remove}
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 bg-white rounded-full shadow-sm text-indigo-500 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-semibold text-slate-500 group-hover:text-indigo-600">{t.platform.dropzone}</span>
                        </>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp} className="flex justify-end">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 hover:shadow-[0_10px_25px_rgba(79,70,229,0.3)] transition-all flex items-center gap-2 disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t.platform.submitting}
                        </>
                      ) : (
                        <>
                          {t.platform.submit} <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.div>
                </form>
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
      
    </div>
  );
}

