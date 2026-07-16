import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  User,
  ExternalLink,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Layers,
  Send,
  BarChart,
  Clock,
  BookMarked,
  Bell,
  Mail,
  MapPin,
  Building
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useJournalTabStore } from '../../store/useJournalTabStore';

export default function JournalHome() {
  const navigate = useNavigate();
  const { activeTab } = useJournalTabStore();
  const [expandedAbstract, setExpandedAbstract] = useState<number | null>(null);
  const { t } = useTranslation();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Tab definitions
  const tabs = [
    { id: 'Anasayfa', label: t.journal.tabHome },
    { id: 'Hakkimizda', label: t.journal.tabAbout },
    { id: 'YayinKurulu', label: t.journal.tabEditorial },
    { id: 'DanismaKurulu', label: t.journal.tabAdvisory },
    { id: 'AmacKapsam', label: t.journal.tabScope },
    { id: 'YazimIlkeleri', label: t.journal.tabPrinciples },
    { id: 'Yayinevi', label: t.journal.tabPublisher },
    { id: 'Iletisim', label: t.journal.tabContact }
  ];

  // Editorial team
  const editorialBoard = [
    { role: t.journal.editorRole, name: 'Doç. Dr. Hüsamettin KARATAŞ', title: t.journal.editorialSub },
    { role: t.journal.assistantEditorRole, name: 'Dr. Zaidan Arif AL-ZEBARI', title: t.journal.assistantSub }
  ];

  // Quick links definitions
  const quickLinks = [
    { label: t.journal.linkSonSayi, icon: BookOpen, action: 'latest' },
    { label: t.journal.linkOncekiSayılar, icon: BookMarked, action: 'archive' },
    { label: t.journal.linkDergiIstatistik, icon: BarChart, action: 'stats' },
    { label: t.journal.linkMakaleTakip, icon: Clock, action: 'track' },
    { label: t.journal.linkOnlineMakale, icon: Send, action: 'submit' },
    { label: t.journal.linkIndeks, icon: Layers, action: 'index' }
  ];

  // Articles data
  const articles = (t.journal.articles || []).map((art: any, index: number) => ({
    id: index + 1,
    title: art.title,
    author: art.author,
    doi: `10.2667/ijar.2026.${1042 + index}`,
    abstract: art.abstract,
    pages: art.pages
  }));

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 font-sans text-slate-800 pb-20 pt-0">

      {/* 2. Premium Journal Identity Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white pt-36 pb-16 px-6 lg:px-8 relative overflow-hidden border-b border-indigo-950/40">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-[10px] font-black tracking-widest uppercase">
                  International Journal
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300 text-xs font-mono">
                  ISSN: 2667-4823
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                International Journal of Academic Research
              </h1>
              <p className="text-slate-450 text-lg font-medium max-w-2xl leading-relaxed">
                International Journal of Academic Research (IJAR)
              </p>
            </div>

            {/* Glowing Index Status Card */}
            <div className="shrink-0 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] text-center space-y-3 w-full md:w-56 shadow-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block relative z-10">Index Status</span>
              <div className="text-2xl font-black text-white relative z-10 group-hover:text-indigo-200 transition-colors">Web of Science</div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified Tenant
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tab Content Wrapper */}
      <div id="journal-content" className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Back to Directory Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-white hover:bg-indigo-50/20 border border-slate-200/80 hover:border-indigo-200/60 rounded-xl shadow-sm hover:shadow transition-all duration-300 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            {t.journal.back}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Anasayfa' ? (
            <motion.div
              key="anasayfa-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* --- LEFT SIDEBAR: Editorial Board & Quick Actions (Column Span 3) --- */}
              <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">

                {/* Editorial Board Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 text-left">
                  <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    {t.journal.editorialBoard}
                  </h3>

                  <div className="space-y-4">
                    {editorialBoard.map((editor, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1 hover:border-indigo-100 transition-colors">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block">{editor.role}</span>
                        <h4 className="text-sm font-bold text-slate-900">{editor.name}</h4>
                        <p className="text-[11px] text-slate-400 font-medium">{editor.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 text-left">
                  <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    {t.journal.quickLinks}
                  </h3>

                  <div className="flex flex-col gap-1">
                    {quickLinks.map((link, i) => (
                      <button
                        key={i}
                        className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-700 hover:text-indigo-700 font-semibold text-xs transition-colors cursor-pointer group text-left border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center gap-2.5">
                          <link.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                          <span>{link.label}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* --- MIDDLE COLUMN: Published Articles (Column Span 6) --- */}
              <div className="lg:col-span-6 space-y-8 order-1 lg:order-2">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-8">

                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {t.journal.latestArticles}
                    </h2>
                    <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 rounded-lg">
                      June/July 2026
                    </span>
                  </div>

                  <div className="space-y-6 divide-y divide-slate-100">
                    {articles.map((article, index) => (
                      <div key={article.id} className={`pt-6 text-left space-y-4 ${index === 0 ? '!pt-0' : ''}`}>

                        {/* Article Header info */}
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[10px] font-black text-indigo-600 tracking-widest font-mono uppercase">
                            DOI: {article.doi}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            Pages: {article.pages}
                          </span>
                        </div>

                        {/* Title & Author */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-indigo-700 transition-colors cursor-pointer">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{article.author}</span>
                          </div>
                        </div>

                        {/* Expandable Abstract (Özet) Drawer */}
                        <div className="space-y-2">
                          <button
                            onClick={() => setExpandedAbstract(expandedAbstract === article.id ? null : article.id)}
                            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
                          >
                            <span>{t.journal.abstract}</span>
                            {expandedAbstract === article.id ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <AnimatePresence>
                            {expandedAbstract === article.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed font-normal"
                              >
                                {article.abstract}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer">
                            <Download className="w-3.5 h-3.5" />
                            {t.journal.downloadPdf}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* --- RIGHT COLUMN: Announcements & News (Column Span 3) --- */}
              <div className="lg:col-span-3 space-y-8 order-3">
                <div className="bg-gradient-to-b from-indigo-900 to-slate-950 text-white rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden border border-indigo-950 text-left">

                  {/* Decorative glowing orb */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[40px] rounded-full pointer-events-none" />

                  <h3 className="text-base font-extrabold border-b border-white/10 pb-3 flex items-center gap-2 relative z-10">
                    <Bell className="w-4 h-4 text-indigo-400 animate-bounce" />
                    {t.journal.announcements}
                  </h3>

                  <div className="space-y-4 relative z-10">
                    <div className="space-y-2 bg-white/5 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-indigo-500 text-[9px] font-black tracking-widest uppercase rounded">CFP</span>
                        <span className="text-[10px] text-slate-400 font-mono">June 2026</span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {t.journal.cfpTitle}
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                        {t.journal.cfpDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="fallback-tabs"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center max-w-2xl mx-auto shadow-sm"
            >
              <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                Bu bölüm geliştirilmektedir. En kısa sürede güncellenecektir.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-500 text-left space-y-3 font-normal max-w-md mx-auto">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>info@academianexus.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>Ankara, Türkiye</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span>International Journal Publishing House</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
