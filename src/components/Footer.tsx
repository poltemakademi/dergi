import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fingerprint, X, Info,
  Cpu, Link2, Clock, Mail, FileEdit, BookOpen, Terminal, Scale, Globe, ShieldCheck, FileText
} from 'lucide-react';

// Import actual page components to render inside popup modals
import AuthorApplications from '../pages/public/AuthorApplications';
import TechnicalDocs from '../pages/public/TechnicalDocs';
import ApiReference from '../pages/public/ApiReference';
import EthicalGuidelines from '../pages/public/EthicalGuidelines';
import OpenAccessPolicy from '../pages/public/OpenAccessPolicy';
import Kvkk from '../pages/public/Kvkk';
import SalesAgreement from '../pages/public/SalesAgreement';
import TermsOfService from '../pages/public/TermsOfService';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import CookieSettings from '../pages/public/CookieSettings';

const dict = {
  EN: {
    footer: {
      platform: "Platform", sys: "System Features", int: "Integrations", early: "Early Access",
      res: "Resources", apply: "Author Applications", docs: "Technical Docs", api: "API Reference",
      legal: "Legal & Ethics", ethics: "Ethical Guidelines", openAccess: "Open Access Policy",
      kvkk: "GDPR / KVKK", sales: "Sales Agreement", contact: "Contact",
      rights: "All rights reserved.", terms: "Terms of Service", privacy: "Privacy Policy", cookies: "Cookie Settings",
      desc: "The next-generation infrastructure for academic publishing. Streamlining peer review, indexing, and dissemination globally."
    },
    modal: {
      desc: "This section is currently under construction. The relevant legal texts and content will be provided by the administrative department before the production launch.",
      close: "Close"
    }
  },
  TR: {
    footer: {
      platform: "Platform", sys: "Sistem Özellikleri", int: "Entegrasyonlar", early: "Erken Erişim",
      res: "Kaynaklar", apply: "Yazar Başvuruları", docs: "Teknik Dokümanlar", api: "API Referansı",
      legal: "Yasal & Etik", ethics: "Etik İlkeler", openAccess: "Açık Erişim",
      kvkk: "KVKK Aydınlatma Metni", sales: "Mesafeli Satış Sözleşmesi", contact: "İletişim",
      rights: "Tüm hakları saklıdır.", terms: "Hizmet Şartları", privacy: "Gizlilik Politikası", cookies: "Çerez Ayarları",
      desc: "Akademik yayıncılık için yeni nesil altyapı. Hakem değerlendirmesi, indeksleme ve yayımı küresel olarak kolaylaştırıyor."
    },
    modal: {
      desc: "Bu bölüm şu anda yapım aşamasındadır. İlgili yasal metinler ve içerikler canlı ortama geçilmeden önce yönetim departmanı tarafından eklenecektir.",
      close: "Kapat"
    }
  }
};

export default function Footer() {
  const [lang, setLangState] = useState<'EN' | 'TR'>(() => {
    const stored = localStorage.getItem('app_lang');
    if (stored) {
      const upper = stored.toUpperCase();
      if (upper === 'EN' || upper === 'TR') return upper;
    }
    return 'TR';
  });
  const [activeModal, setActiveModal] = useState<{ title: string, id: string } | null>(null);

  const t = dict[lang] || dict.TR;

  useEffect(() => {
    const handleLangChange = () => {
      const stored = localStorage.getItem('app_lang');
      const upper = stored ? stored.toUpperCase() : 'TR';
      setLangState((upper === 'EN' || upper === 'TR' ? upper : 'TR') as 'EN' | 'TR');
    };
    window.addEventListener('lang-change', handleLangChange);
    return () => window.removeEventListener('lang-change', handleLangChange);
  }, []);

  const openModal = (e: React.MouseEvent, title: string, id: string) => {
    e.preventDefault();
    setActiveModal({ title, id });
  };

  const renderModalContent = (id: string) => {
    switch (id) {
      case 'apply': return <AuthorApplications />;
      case 'docs': return <TechnicalDocs />;
      case 'api': return <ApiReference />;
      case 'ethics': return <EthicalGuidelines />;
      case 'openAccess': return <OpenAccessPolicy />;
      case 'kvkk': return <Kvkk />;
      case 'sales': return <SalesAgreement />;
      case 'terms': return <TermsOfService />;
      case 'privacy': return <PrivacyPolicy />;
      case 'cookies': return <CookieSettings />;
      default: return <p className="text-slate-600 leading-relaxed text-lg p-8">{t.modal.desc}</p>;
    }
  };

  return (
    <>
      <footer className="bg-slate-950 text-slate-400 py-20 px-6 relative z-10 overflow-hidden">
        {/* Top Gradient Border */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 via-sky-400 to-emerald-500" />
        
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        {/* Ambient Glows */}
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-24 -right-48 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            
            {/* Brand Section */}
            <div className="lg:col-span-4 space-y-6 text-left">
              <div className="flex items-center gap-3">
                <div className="flex gap-[3px] items-center">
                  <div className="w-1.5 h-6 bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
                  <div className="w-1.5 h-4 bg-sky-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.4)]" />
                  <div className="w-1.5 h-5 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.4)]" />
                </div>
                <span className="text-2xl font-black tracking-tight text-white font-serif">
                  novaijournal
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                {t.footer.desc}
              </p>

              {/* Social links */}
              <div className="flex gap-3 pt-2">
                <a href="#" onClick={(e) => e.preventDefault()} className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 hover:-translate-y-0.5 transition-all duration-300 shadow-sm" aria-label="Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-950 hover:border-slate-800 hover:-translate-y-0.5 transition-all duration-300 shadow-sm" aria-label="GitHub">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-700 hover:border-indigo-600 hover:-translate-y-0.5 transition-all duration-300 shadow-sm" aria-label="LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              
              {/* Platform Column */}
              <div className="flex flex-col gap-4 items-start text-left">
                <h4 className="text-white font-bold tracking-wider text-xs uppercase mb-1 border-b border-slate-800 pb-2 w-full">
                  {t.footer.platform}
                </h4>
                
                <Link to="/sistem-ozellikleri" className="group text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:rotate-12 transition-all duration-300" />
                  <span>{t.footer.sys}</span>
                </Link>

                <Link to="/entegrasyonlar" className="group text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center gap-2.5">
                  <Link2 className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:-rotate-12 transition-all duration-300" />
                  <span>{t.footer.int}</span>
                </Link>

                <Link to="/early-access" className="group text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300" />
                  <span>{t.footer.early}</span>
                </Link>

                <button onClick={(e) => openModal(e, t.footer.contact, 'contact')} className="group text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left">
                  <Mail className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-300" />
                  <span>{t.footer.contact}</span>
                </button>
              </div>

              {/* Resources Column */}
              <div className="flex flex-col gap-4 items-start text-left">
                <h4 className="text-white font-bold tracking-wider text-xs uppercase mb-1 border-b border-slate-800 pb-2 w-full">
                  {t.footer.res}
                </h4>

                <button onClick={(e) => openModal(e, t.footer.apply, 'apply')} className="group text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left">
                  <FileEdit className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300" />
                  <span>{t.footer.apply}</span>
                </button>

                <button onClick={(e) => openModal(e, t.footer.docs, 'docs')} className="group text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left">
                  <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-y-[-1px] transition-all duration-300" />
                  <span>{t.footer.docs}</span>
                </button>

                <button onClick={(e) => openModal(e, t.footer.api, 'api')} className="group text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left">
                  <Terminal className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-300" />
                  <span>{t.footer.api}</span>
                </button>
              </div>

              {/* Legal & Ethics Column */}
              <div className="flex flex-col gap-4 items-start text-left">
                <h4 className="text-white font-bold tracking-wider text-xs uppercase mb-1 border-b border-slate-800 pb-2 w-full">
                  {t.footer.legal}
                </h4>

                <button onClick={(e) => openModal(e, t.footer.ethics, 'ethics')} className="group text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left">
                  <Scale className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:scale-105 transition-all duration-300" />
                  <span>{t.footer.ethics}</span>
                </button>

                <button onClick={(e) => openModal(e, t.footer.openAccess, 'openAccess')} className="group text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left">
                  <Globe className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:rotate-45 transition-all duration-300" />
                  <span>{t.footer.openAccess}</span>
                </button>

                <button onClick={(e) => openModal(e, t.footer.kvkk, 'kvkk')} className="group text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left">
                  <ShieldCheck className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300" />
                  <span>{t.footer.kvkk}</span>
                </button>

                <button onClick={(e) => openModal(e, t.footer.sales, 'sales')} className="group text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left">
                  <FileText className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-300" />
                  <span>{t.footer.sales}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Copyright & Bottom section */}
          <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-slate-600" />
              <span>&copy; {new Date().getFullYear()} novaijournal. {t.footer.rights}</span>
            </div>
            <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
              <button onClick={(e) => openModal(e, t.footer.terms, 'terms')} className="hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-0 p-0">{t.footer.terms}</button>
              <button onClick={(e) => openModal(e, t.footer.privacy, 'privacy')} className="hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-0 p-0">{t.footer.privacy}</button>
              <button onClick={(e) => openModal(e, t.footer.cookies, 'cookies')} className="hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-0 p-0">{t.footer.cookies}</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal/Construction Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white border border-slate-200/80 rounded-[2rem] w-full max-w-5xl h-[80vh] shadow-2xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50/50 shrink-0">
                <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-3">
                  <Info className="w-5 h-5 text-indigo-600" />
                  {activeModal.title}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto bg-slate-50 relative">
                {/* Offset the pt-32 padding of the imported subpages inside modal */}
                <div className="-mt-24">
                  {renderModalContent(activeModal.id)}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
