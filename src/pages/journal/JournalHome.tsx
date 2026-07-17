import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Building,
  Loader2
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useJournalTabStore } from '../../store/useJournalTabStore';
import { useTenantStore } from '../../store/useTenantStore';

export default function JournalHome() {
  const navigate = useNavigate();
  const { tenant_slug } = useParams<{ tenant_slug: string }>();
  const { activeTab } = useJournalTabStore();
  const [expandedAbstract, setExpandedAbstract] = useState<number | null>(null);
  const { t, lang } = useTranslation();

  const { metadata, isLoading, fetchMetadata } = useTenantStore();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Fetch metadata if missing or slug changed
  useEffect(() => {
    if (tenant_slug && (!metadata || metadata.slug !== tenant_slug)) {
      fetchMetadata(tenant_slug);
    }
  }, [tenant_slug, metadata, fetchMetadata]);

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

  if (isLoading || !metadata) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="text-slate-500 font-bold text-sm">Loading journal identity...</span>
        </div>
      </div>
    );
  }

  // Editorial team mapping
  const editorialBoard = metadata.editorialBoard && metadata.editorialBoard.length > 0
    ? metadata.editorialBoard
    : [
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

  // Articles data mapping
  const articles = (metadata.featuredArticles || []).map((art: any, index: number) => ({
    id: art.id || index + 1,
    title: art.titleEn || art.title || '',
    author: art.author || (art.authors?.map((a: any) => a.name).join(', ')) || '',
    doi: art.doi || `10.2667/ijar.2026.${1042 + index}`,
    abstract: art.abstractEn || art.abstract || '',
    pages: art.pages || '1-10'
  }));

  const displayTitle = lang === 'TR' ? (metadata.tr || metadata.name) : metadata.name;
  const displayDesc = typeof metadata.description === 'string'
    ? metadata.description
    : (metadata.description?.[lang] || metadata.description?.['EN'] || '');

  const getTabContent = (field: any) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field['EN'] || '';
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 font-sans text-slate-800 pb-20 pt-0">

      {/* 2. Premium Journal Identity Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white pt-32 md:pt-36 pb-12 md:pb-16 px-4 md:px-6 lg:px-8 relative overflow-hidden border-b border-indigo-950/40">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="text-left space-y-4 w-full">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <span className="px-2 md:px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-[9px] md:text-[10px] font-black tracking-widest uppercase">
                  International Journal
                </span>
                <span className="px-2 md:px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300 text-[10px] md:text-xs font-mono">
                  ISSN: {metadata.issn}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                {displayTitle}
              </h1>
              <p className="text-slate-400 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
                {displayDesc}
              </p>
            </div>

            {/* Glowing Index Status Card */}
            <div className="shrink-0 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-5 md:p-6 rounded-2xl md:rounded-[2rem] text-center space-y-2 md:space-y-3 w-full md:w-56 shadow-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />
              <span className="text-[9px] md:text-[10px] font-black text-indigo-300 uppercase tracking-widest block relative z-10">Index Status</span>
              <div className="text-xl md:text-2xl font-black text-white relative z-10 group-hover:text-indigo-200 transition-colors">{metadata.index}</div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified Tenant
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 4. Tab Content Wrapper */}
      <div id="journal-content" className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Back to Directory Link */}
        <div className="mb-4 md:mb-6">
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
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          if (link.action === 'latest') navigate('./current');
                          else if (link.action === 'archive') navigate('./archives');
                          else if (link.action === 'submit') navigate('/dashboard/yazar/submit-wizard');
                          else if (link.action === 'track') navigate('/dashboard/yazar/submissions');
                        }}
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
                <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 p-5 md:p-8 shadow-sm space-y-6 md:space-y-8">

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                    <h2 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
                      {t.journal.latestArticles}
                    </h2>
                    <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 rounded-lg shrink-0">
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
                          <h3
                            onClick={() => navigate(`./article/${article.id}`)}
                            className="text-lg font-bold text-slate-900 leading-snug hover:text-indigo-700 transition-colors cursor-pointer"
                          >
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
                          <button
                            onClick={() => navigate(`./article/${article.id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                          >
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
                    {(metadata.announcements && metadata.announcements.length > 0 ? metadata.announcements : [
                      { type: 'CFP', date: 'June 2026', title: t.journal.cfpTitle, content: t.journal.cfpDesc }
                    ]).map((ann: any, idx: number) => (
                      <div key={idx} className="space-y-2 bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-indigo-500 text-[9px] font-black tracking-widest uppercase rounded">{ann.type || 'News'}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{ann.date || 'June 2026'}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug">
                          {ann.title}
                        </h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                          {ann.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active-tab-content"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 text-left max-w-4xl mx-auto shadow-sm space-y-6"
            >
              <h3 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-4">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h3>

              {activeTab === 'Hakkimizda' && (
                <div className="prose prose-indigo max-w-none text-sm text-slate-600 leading-relaxed font-normal" dangerouslySetInnerHTML={{ __html: getTabContent(metadata.about) }} />
              )}
              {activeTab === 'AmacKapsam' && (
                <div className="prose prose-indigo max-w-none text-sm text-slate-600 leading-relaxed font-normal" dangerouslySetInnerHTML={{ __html: getTabContent(metadata.aimsScope) }} />
              )}
              {activeTab === 'YazimIlkeleri' && (
                <div className="prose prose-indigo max-w-none text-sm text-slate-600 leading-relaxed font-normal" dangerouslySetInnerHTML={{ __html: getTabContent(metadata.writingPrinciples) }} />
              )}
              {activeTab === 'Yayinevi' && (
                <div className="prose prose-indigo max-w-none text-sm text-slate-600 leading-relaxed font-normal" dangerouslySetInnerHTML={{ __html: getTabContent(metadata.publisher) }} />
              )}
              {activeTab === 'Iletisim' && (
                <div className="prose prose-indigo max-w-none text-sm text-slate-600 leading-relaxed font-normal" dangerouslySetInnerHTML={{ __html: getTabContent(metadata.contact) }} />
              )}

              {activeTab === 'YayinKurulu' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {editorialBoard.map((member: any, i: number) => (
                    <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors">
                      <span className="text-xs font-black text-indigo-600 uppercase tracking-widest block mb-1">{member.role}</span>
                      <h4 className="text-lg font-bold text-slate-900">{member.name}</h4>
                      <p className="text-sm text-slate-500 font-medium">{member.title}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'DanismaKurulu' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(metadata.advisoryBoard && metadata.advisoryBoard.length > 0 ? metadata.advisoryBoard : [
                    { name: 'Prof. Dr. Jane Doe', institution: 'MIT, USA' },
                    { name: 'Prof. Dr. John Smith', institution: 'Oxford University, UK' },
                    { name: 'Assoc. Prof. Ayşe Yılmaz', institution: 'METU, Turkey' }
                  ]).map((member: any, i: number) => (
                    <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors">
                      <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{member.institution}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
