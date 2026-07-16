import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2,
  Shield,
  Database,
  Mail,
  ArrowRight,
  BarChart3,
  Globe,
  BookOpen,
  CheckCircle2,
  Search,
  X,
  Loader2,
  AlertCircle,
  FileText,
  Fingerprint
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { apiClient } from '../../services/api/client';
import { useJournalStore } from '../../store/useJournalStore';

export default function Home() {
  const { t } = useTranslation();
  const { journals, fetchJournals, isLoading } = useJournalStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ articles: any[]; journals: any[]; doiMatches?: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAllResultsModal, setShowAllResultsModal] = useState(false);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  const handleSearch = async (queryText: string) => {
    if (!queryText.trim()) {
      setSearchResults(null);
      setShowResults(false);
      return;
    }
    setIsSearching(true);
    setShowResults(true);
    try {
      const response = await apiClient.get('/api/global/search', {
        params: { q: queryText }
      });
      const data = response.data;
      let articlesList: any[] = [];
      let journalsList: any[] = [];

      if (data && (Array.isArray(data.articles) || Array.isArray(data.journals))) {
        articlesList = Array.isArray(data.articles) ? data.articles : [];
        journalsList = Array.isArray(data.journals) ? data.journals : [];
      } else if (Array.isArray(data)) {
        articlesList = data;
      }

      const q = queryText.toLowerCase();
      // Filter DOI matches from articles list
      const doiMatches = articlesList.filter((a: any) => a.doi && a.doi.toLowerCase().includes(q));
      const remainingArticles = articlesList.filter((a: any) => !doiMatches.some((d: any) => d.id === a.id));

      setSearchResults({
        articles: remainingArticles,
        journals: journalsList,
        doiMatches: doiMatches
      });
    } catch (err: any) {
      console.warn('Search API failed, running fallback client-side search:', err);
      // Fail-safe search fallback
      const q = queryText.toLowerCase();
      const matchedJournals = journals.filter(j =>
        j.name.toLowerCase().includes(q) ||
        j.tr.toLowerCase().includes(q) ||
        j.issn.toLowerCase().includes(q)
      );

      const allArticles = journals.flatMap(j => j.articles || []).map(a => ({
        id: a.id,
        title: a.title,
        author: a.author,
        doi: a.doi,
        journalName: journals.find(j => j.articles.includes(a))?.name || 'Academic Journal',
        journalSlug: journals.find(j => j.articles.includes(a))?.slug || 'js'
      }));

      const doiMatches = allArticles.filter((a: any) => a.doi && a.doi.toLowerCase().includes(q));
      const matchedArticles = allArticles.filter((a: any) =>
        ((a.title || '').toLowerCase().includes(q) ||
        (a.author || '').toLowerCase().includes(q)) &&
        !doiMatches.some((d: any) => d.id === a.id)
      );

      setSearchResults({
        articles: matchedArticles,
        journals: matchedJournals,
        doiMatches: doiMatches
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="pb-24 pt-24">
      {/* --- Hero Section --- */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 min-h-[calc(100vh-192px)] flex items-center border-b border-slate-100">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center py-12">

          {/* Left Column: Copywriting & Actions */}
          <div className="lg:col-span-5 text-left space-y-6">


            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-serif leading-[1.15]"
            >
              {t.hero.titlePre} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500">
                {t.hero.titlePost}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-500 text-base md:text-lg leading-relaxed font-normal"
            >
              {t.hero.desc}
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link to="/dashboard" className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center">
                {t.hero.submit}
              </Link>
              <Link to="/directory" className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center">
                {t.hero.explore}
              </Link>
            </motion.div>

            {/* Search Field */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 relative max-w-lg"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value === '') {
                    setSearchResults(null);
                    setShowResults(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery);
                  }
                }}
                placeholder={t.hero.searchPlaceholder}
                className="block w-full pl-11 pr-24 py-3.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults(null);
                      setShowResults(false);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className="px-4 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  {t.hero.searchBtn}
                </button>
              </div>

              {/* Search Results Dropdown/Panel */}
              <AnimatePresence>
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 md:-left-12 md:-right-12 mt-3 p-6 md:p-8 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] z-50 overflow-hidden max-h-[520px] overflow-y-auto text-left"
                  >
                    {isSearching ? (
                      <div className="flex flex-col items-center justify-center py-10 space-y-3">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Searching across all journals...</p>
                      </div>
                    ) : searchResults && (searchResults.articles.length > 0 || searchResults.journals.length > 0 || (searchResults.doiMatches && searchResults.doiMatches.length > 0)) ? (
                      <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100/80 items-stretch">
                          {/* Journals List (Left Column) */}
                          <div className="space-y-4 flex flex-col h-full">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Matches in Journals ({searchResults.journals.length})
                            </h4>
                            {searchResults.journals.length > 0 ? (
                              <div className="flex flex-col gap-3 flex-1">
                                {searchResults.journals.slice(0, 2).map((journal: any) => {
                                  // Attempt to match search result with store data to grab rich properties
                                  const storeMatch = journals.find(j => j.id.toLowerCase() === journal.id.toLowerCase());
                                  return (
                                    <Link
                                      key={journal.id}
                                      to={`/${journal.slug || journal.id.toLowerCase()}`}
                                      onClick={() => setShowResults(false)}
                                      className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/30 hover:bg-indigo-50/40 border border-slate-100/50 hover:border-indigo-100/50 transition-all duration-300 group text-left min-h-[110px] flex-1"
                                    >
                                      <div className="w-12 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-sm border border-slate-200/50 group-hover:scale-105 transition-transform duration-300">
                                        <img
                                          src={journal.cover || storeMatch?.cover || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=100'}
                                          alt={journal.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0 text-left">
                                        <div className="font-extrabold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors truncate">{journal.name}</div>
                                        <div className="text-[11px] text-slate-400 font-medium italic mt-0.5 truncate">{journal.tr || storeMatch?.tr}</div>
                                        <div className="flex items-center gap-2 mt-1.5">
                                          <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md border border-slate-200/50 font-mono">
                                            {journal.issn || storeMatch?.issn || 'XXXX-XXXX'}
                                          </span>
                                          <span className="text-[9px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md border border-indigo-100/50">
                                            {journal.index || storeMatch?.index || 'Crossref Indexed'}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 shrink-0 transition-colors">
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors group-hover:translate-x-0.5" />
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic py-2 text-left">No journals matched your search.</p>
                            )}
                          </div>

                          {/* Articles List (Right Column) */}
                          <div className="space-y-4 md:pl-8 pt-6 md:pt-0 flex flex-col h-full">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-indigo-500" /> Matches in Articles ({searchResults.articles.length})
                            </h4>
                            {searchResults.articles.length > 0 ? (
                              <div className="flex flex-col gap-3 flex-1">
                                {searchResults.articles.slice(0, 2).map((article: any) => (
                                  <Link
                                    key={article.id}
                                    to={`/${article.journalSlug || 'js'}/article/${article.id}`}
                                    onClick={() => setShowResults(false)}
                                    className="flex flex-col justify-between p-4 rounded-2xl bg-slate-50/30 hover:bg-indigo-50/40 border border-slate-100/50 hover:border-indigo-100/50 transition-all duration-300 group text-left min-h-[110px] flex-1"
                                  >
                                    <div className="font-extrabold text-slate-800 text-xs md:text-sm leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                                      {article.title}
                                    </div>
                                    <div className="flex flex-wrap gap-2 items-center mt-2 text-[10px]">
                                      <span className="font-semibold text-slate-600">{article.author}</span>
                                      <span className="w-1 h-1 rounded-full bg-slate-350" />
                                      <span className="text-slate-400 font-medium italic truncate max-w-[150px]">{article.journalName || 'Academic Journal'}</span>
                                    </div>
                                    {article.doi && (
                                      <div className="mt-3 flex items-center justify-between">
                                        <span className="font-mono text-[9px] bg-slate-100 border border-slate-200/60 text-slate-500 px-1.5 py-0.5 rounded-md">
                                          DOI: {article.doi}
                                        </span>
                                        <span className="text-[10px] text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center gap-0.5">
                                          Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </span>
                                      </div>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic py-2 text-left">No articles matched your search.</p>
                            )}
                          </div>
                      </div>

                      {/* DOI Matches Section */}
                      {searchResults.doiMatches && searchResults.doiMatches.length > 0 && (
                        <div className="border-t border-slate-100/80 pt-6 mt-2">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                            <Fingerprint className="w-3.5 h-3.5 text-indigo-500" /> Matches by DOI ({searchResults.doiMatches.length})
                          </h4>
                          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {searchResults.doiMatches.slice(0, 5).map((article: any) => (
                              <Link
                                key={article.id}
                                to={`/${article.journalSlug || 'js'}/article/${article.id}`}
                                onClick={() => setShowResults(false)}
                                className="flex-shrink-0 w-[280px] flex flex-col justify-between p-4 rounded-2xl bg-slate-50/30 hover:bg-indigo-50/40 border border-slate-100/50 hover:border-indigo-100/50 transition-all duration-300 group text-left min-h-[110px]"
                              >
                                <div className="font-extrabold text-slate-800 text-xs leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                                  {article.title}
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                  <span className="font-mono text-[9px] bg-slate-100 border border-slate-200/60 text-slate-500 px-1.5 py-0.5 rounded-md truncate max-w-[170px]">
                                    {article.doi}
                                  </span>
                                  <span className="text-[10px] text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center gap-0.5 shrink-0">
                                    Read <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* See More Actions */}
                      {(searchResults.journals.length > 2 || searchResults.articles.length > 2) && (
                          <div className="border-t border-slate-100/80 pt-4 flex justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAllResultsModal(true);
                                setShowResults(false);
                              }}
                              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                            >
                              See More ({searchResults.journals.length + searchResults.articles.length} total results)
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 space-y-2">
                        <AlertCircle className="w-8 h-8 text-amber-500" />
                        <p className="text-slate-800 font-bold text-sm">No Results Found</p>
                        <p className="text-slate-400 text-xs">We couldn't find any articles or journals matching your search.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Micro stats under actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-6 border-t border-slate-100 flex items-center gap-6"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{t.hero.indexing}</span>
                <span className="text-sm font-bold text-slate-800">{t.hero.indexingVal}</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{t.hero.doi}</span>
                <span className="text-sm font-bold text-slate-800">{t.hero.doiVal}</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: High-Fidelity Browser Window Mock */}
          <div className="lg:col-span-7 relative">
            {/* Soft decorative background glows */}
            <div className="absolute -top-12 -left-12 w-72 h-72 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-sky-500/5 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 80 }}
              className="w-full bg-slate-900/5 p-2 rounded-[2rem] border border-slate-200 shadow-2xl relative z-10"
            >
              {/* macOS Window style wrapper */}
              <div className="bg-white rounded-[1.6rem] border border-slate-200/80 shadow-md overflow-hidden flex flex-col h-[400px] text-left">
                {/* Browser Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="bg-white border border-slate-200 text-slate-400 text-[10px] px-8 py-1 rounded-lg w-72 text-center truncate font-mono">
                    journal.academianexus.com/articles/10.2845
                  </div>
                  <div className="w-12" />
                </div>

                {/* Article interface mockup */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Article main content area */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 rounded">
                        {t.mockArticle.tag}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">DOI: 10.2845/qg.2026</span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 leading-snug font-serif">
                      {t.mockArticle.title}
                    </h2>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">{t.mockArticle.authors}</span>
                      <span>•</span>
                      <span>{t.mockArticle.dept}</span>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">{t.mockArticle.abstractTitle}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {t.mockArticle.abstractText}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[9px] font-semibold text-slate-600 rounded">
                        {t.mockArticle.scopus}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[9px] font-semibold text-slate-600 rounded">
                        {t.mockArticle.crossref}
                      </span>
                    </div>
                  </div>

                  {/* Sidebar stats panel */}
                  <div className="w-48 border-l border-slate-100 bg-slate-50/50 p-5 flex flex-col justify-between shrink-0 text-left">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{t.mockArticle.downloads}</span>
                        <div className="text-lg font-black text-slate-800">1,248</div>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{t.mockArticle.citations}</span>
                        <div className="text-lg font-black text-slate-800">142</div>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{t.mockArticle.statusTitle}</span>
                        <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 rounded block text-center mt-1">
                          {t.mockArticle.statusVal}
                        </span>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors text-center cursor-pointer">
                      {t.mockArticle.downloadPdf}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* --- Data Visualization Stats --- */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto bg-slate-900 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl p-12 md:p-16 relative overflow-hidden">
          {/* Inner background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-indigo-500/10 via-sky-500/10 to-indigo-500/10 opacity-50 pointer-events-none"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-slate-800 relative z-10">
            {[
              { value: '142', label: t.stats.journals, icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
              { value: '12.4k+', label: t.stats.reviewers, icon: Shield, color: 'from-emerald-400 to-teal-500' },
              { value: '84.2k', label: t.stats.articles, icon: Globe, color: 'from-amber-400 to-orange-500' },
              { value: '2.1M', label: t.stats.dois, icon: BarChart3, color: 'from-fuchsia-500 to-purple-600' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6 shadow-sm border border-slate-700 group-hover:scale-110 transition-transform duration-500 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500`}></div>
                  <stat.icon className="w-6 h-6 text-white transition-colors duration-500" />
                </div>
                <span className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tighter group-hover:scale-105 transition-transform duration-500">{stat.value}</span>
                <span className="text-xs font-black tracking-[0.2em] text-slate-400 group-hover:text-indigo-400 transition-colors duration-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Featured Journals Marquee (Infinite Loop) --- */}
      <section className="max-w-[1400px] mx-auto py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 px-8 md:px-4">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm tracking-wider uppercase mb-3">
              {t.marquee.sub}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">{t.marquee.title}</h2>
            <p className="text-xl text-slate-500 font-medium">{t.marquee.desc}</p>
          </div>
          <Link to="/directory" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm group">
            {t.marquee.btn} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {isLoading ? (
          <div className="flex gap-8 px-8 overflow-x-auto pb-16 max-w-7xl mx-auto w-full justify-start md:justify-center scrollbar-hide">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-[340px] shrink-0 bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between space-y-6 animate-pulse"
              >
                <div>
                  <div className="h-40 bg-slate-100 rounded-2xl w-full mb-6" />
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                </div>
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                  <div className="space-y-1 w-1/2">
                    <div className="h-2 bg-slate-100 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-hidden group [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pt-4 pb-16">
            {/* First Marquee Group */}
            <div className="flex gap-8 pr-8 animate-marquee group-hover:[animation-play-state:paused] w-max">
              {journals.map((journal, i) => (
                <Link
                  key={`${journal.id}-${i}`}
                  to={`/${journal.id.toLowerCase()}`}
                  className="w-[340px] shrink-0 bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.2)] hover:border-indigo-300 transition-all duration-500 hover:-translate-y-3 cursor-pointer group/card relative flex flex-col overflow-hidden text-left"
                >
                  {/* Journal Cover Area */}
                  <div className="h-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900">
                      <img src={journal.cover} alt={journal.name} className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-700" />
                    </div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                    <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white font-black text-xl rounded-[1rem] flex items-center justify-center border border-white/30 shadow-lg group-hover/card:bg-indigo-500 group-hover/card:border-indigo-400 group-hover/card:scale-110 transition-all duration-500">
                        {journal.id}
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${journal.indexColor} bg-white shadow-sm scale-90 origin-bottom-right group-hover/card:scale-100 transition-transform duration-500`}>
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-bold tracking-wide uppercase">{journal.index}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex flex-col flex-1 justify-between space-y-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover/card:text-indigo-700 transition-colors line-clamp-2">{journal.name}</h3>
                      <p className="text-slate-500 font-medium text-sm italic">{journal.tr}</p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100/80 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-0.5">{t.marquee.issn}</span>
                        <span className="text-sm font-bold text-slate-700 font-mono">{journal.issn}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover/card:bg-indigo-50 group-hover/card:border-indigo-100 transition-colors">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover/card:text-indigo-600 transition-colors group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Second Marquee Group (Duplicate for seamless loop) */}
            <div className="flex gap-8 pr-8 animate-marquee group-hover:[animation-play-state:paused] w-max" aria-hidden="true">
              {journals.map((journal, i) => (
                <Link
                  key={`${journal.id}-dup-${i}`}
                  to={`/${journal.id.toLowerCase()}`}
                  className="w-[340px] shrink-0 bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.2)] hover:border-indigo-300 transition-all duration-500 hover:-translate-y-3 cursor-pointer group/card relative flex flex-col overflow-hidden text-left"
                >
                  <div className="h-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900">
                      <img src={journal.cover} alt={journal.name} className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-700" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                    <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white font-black text-xl rounded-[1rem] flex items-center justify-center border border-white/30 shadow-lg group-hover/card:bg-indigo-500 group-hover/card:border-indigo-400 group-hover/card:scale-110 transition-all duration-500">
                        {journal.id}
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${journal.indexColor} bg-white shadow-sm scale-90 origin-bottom-right group-hover/card:scale-100 transition-transform duration-500`}>
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-bold tracking-wide uppercase">{journal.index}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between space-y-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover/card:text-indigo-700 transition-colors line-clamp-2">{journal.name}</h3>
                      <p className="text-slate-500 font-medium text-sm italic">{journal.tr}</p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100/80 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-0.5">{t.marquee.issn}</span>
                        <span className="text-sm font-bold text-slate-700 font-mono">{journal.issn}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover/card:bg-indigo-50 group-hover/card:border-indigo-100 transition-colors">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover/card:text-indigo-600 transition-colors group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* --- Bento Box Marketplace --- */}
      <section className="max-w-7xl mx-auto px-4 py-24 mb-20 relative z-10 border-t border-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs mb-4 uppercase tracking-widest">
            {t.bento.sub}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight font-serif">
            {t.bento.title}
          </h2>
          <p className="text-lg text-slate-500 font-normal leading-relaxed max-w-2xl mx-auto">
            {t.bento.desc}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[620px]"
        >
          {/* DOI Card (Large 2x2 card) */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2 md:row-span-2 bg-slate-900 p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden group cursor-pointer border border-slate-800 flex flex-col justify-between"
          >
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Mock Academic DOI Panel */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 font-mono text-xs text-slate-400 space-y-4 shadow-2xl relative z-10 w-full text-left">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-slate-500">SYSTEM // CROSSREF_API</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">LIVE CONNECTION</span>
              </div>
              <div className="space-y-2">
                <p className="text-indigo-400"><span className="text-slate-600">&gt;</span> POST /v1/doi/register</p>
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800/50 text-slate-300 space-y-1">
                  <p><span className="text-indigo-400">prefix:</span> "10.2845"</p>
                  <p><span className="text-indigo-400">suffix:</span> "dergip.2026.0412"</p>
                  <p><span className="text-indigo-400">status:</span> <span className="text-emerald-400">"SUCCESS"</span></p>
                  <p><span className="text-indigo-400">url:</span> "https://doi.org/10.2845/dergip..."</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1">
                <span>RESP_TIME: 142ms</span>
                <span>METADATA: VALIDATED</span>
              </div>
            </div>

            <div className="relative z-10 mt-8 text-left">
              <div className="inline-flex items-center gap-1.5 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-3">
                <Link2 className="w-3.5 h-3.5" />
                {t.bento.doiSub}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">{t.bento.doiTitle}</h3>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base font-normal max-w-md">
                {t.bento.doiDesc}
              </p>
            </div>
          </motion.div>

          {/* Plagiarism Card (Top Right 2x1 card) */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-slate-300 transition-all duration-300 group cursor-pointer flex flex-col justify-between relative overflow-hidden text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 text-rose-600 font-bold text-xs uppercase tracking-widest mb-3">
                  <Shield className="w-3.5 h-3.5" />
                  {t.bento.plagSub}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{t.bento.plagTitle}</h3>
                <p className="text-slate-500 font-normal leading-relaxed text-sm">
                  {t.bento.plagDesc}
                </p>
              </div>

              {/* Plagiarism Mock UI */}
              <div className="shrink-0 bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full sm:w-48 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.bento.plagScore}</span>
                  <span className="text-xs font-bold text-emerald-600 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100">{t.bento.plagSafe}</span>
                </div>
                <div className="text-2xl font-black text-slate-900 mb-2">12.4%</div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12.4%' }} />
                </div>
                <div className="text-[9px] text-slate-400 mt-2 font-mono">{t.bento.plagDb}</div>
              </div>
            </div>
          </motion.div>

          {/* Sobiad Card (Bottom Left 1x1 card) */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-slate-300 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between text-left"
          >
            <div className="bg-sky-50/50 border border-sky-100/50 rounded-2xl p-4 mb-6 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-semibold">Sobiad Indexer</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Metadata Push</span>
                    <span className="text-slate-600 font-medium">Completed</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Citation Links</span>
                    <span className="text-slate-600 font-medium">Mapped</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1 text-sky-600 font-bold text-[10px] uppercase tracking-widest mb-2">
                <Database className="w-3 h-3" /> {t.bento.indexSub}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5 tracking-tight">{t.bento.indexTitle}</h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">{t.bento.indexDesc}</p>
            </div>
          </motion.div>

          {/* Mass Mailer Card (Bottom Right 1x1 card) */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-slate-300 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between text-left"
          >
            <div className="bg-purple-50/50 border border-purple-100/50 rounded-2xl p-4 mb-6 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-purple-600" />
                  <span>Mailer Queue</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono space-y-1">
                  <div className="flex justify-between">
                    <span>INVITE_091</span>
                    <span className="text-emerald-600">DELIVERED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>REMINDER_02</span>
                    <span className="text-amber-600">PENDING</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1 text-purple-600 font-bold text-[10px] uppercase tracking-widest mb-2">
                <Mail className="w-3 h-3" /> {t.bento.mailSub}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5 tracking-tight">{t.bento.mailTitle}</h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">{t.bento.mailDesc}</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- Search Results Modal --- */}
      <AnimatePresence>
        {showAllResultsModal && searchResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllResultsModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200/80 w-full max-w-5xl h-[80vh] overflow-hidden flex flex-col relative z-10"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="text-left">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Search Results
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Showing all matches for "<span className="text-indigo-600 font-bold">{searchQuery}</span>" ({searchResults.journals.length} journals, {searchResults.articles.length} articles)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllResultsModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Grid */}
              <div className="flex-1 overflow-y-auto p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 divide-y md:divide-y-0 md:divide-x divide-slate-200/60">
                  {/* Journals Column */}
                  <div className="space-y-6 text-left">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-500" /> All Matches in Journals ({searchResults.journals.length})
                    </h4>
                    {searchResults.journals.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {searchResults.journals.map((journal: any) => {
                          const storeMatch = journals.find(j => j.id.toLowerCase() === journal.id.toLowerCase());
                          return (
                            <Link
                              key={journal.id}
                              to={`/${journal.slug || journal.id.toLowerCase()}`}
                              onClick={() => setShowAllResultsModal(false)}
                              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-50/40 border border-transparent hover:border-indigo-100/50 transition-all duration-300 group"
                            >
                              <div className="w-14 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-sm border border-slate-200/50 group-hover:scale-105 transition-transform duration-300">
                                <img
                                  src={journal.cover || storeMatch?.cover || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=100'}
                                  alt={journal.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-extrabold text-slate-800 text-sm md:text-base group-hover:text-indigo-600 transition-colors truncate">{journal.name}</div>
                                <div className="text-xs text-slate-400 font-medium italic mt-1 truncate">{journal.tr || storeMatch?.tr}</div>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200/50 font-mono">
                                    {journal.issn || storeMatch?.issn || 'XXXX-XXXX'}
                                  </span>
                                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100/50">
                                    {journal.index || storeMatch?.index || 'Crossref Indexed'}
                                  </span>
                                </div>
                              </div>
                              <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 shrink-0 transition-colors">
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors group-hover:translate-x-0.5" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic py-4">No journals matched your search.</p>
                    )}
                  </div>

                  {/* Articles Column */}
                  <div className="space-y-6 md:pl-8 pt-6 md:pt-0 text-left">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-500" /> All Matches in Articles ({searchResults.articles.length})
                    </h4>
                    {searchResults.articles.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {searchResults.articles.map((article: any) => (
                          <Link
                            key={article.id}
                            to={`/${article.journalSlug || 'js'}/article/${article.id}`}
                            onClick={() => setShowAllResultsModal(false)}
                            className="block p-5 rounded-2xl hover:bg-indigo-50/40 border border-transparent hover:border-indigo-100/50 transition-all duration-300 group text-left"
                          >
                            <div className="font-extrabold text-slate-800 text-sm md:text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                              {article.title}
                            </div>
                            <div className="flex flex-wrap gap-2 items-center mt-2.5 text-xs">
                              <span className="font-semibold text-slate-600">{article.author}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-350" />
                              <span className="text-slate-400 font-medium italic truncate max-w-[200px]">{article.journalName || 'Academic Journal'}</span>
                            </div>
                            {article.doi && (
                              <div className="mt-4 flex items-center justify-between">
                                <span className="font-mono text-[10px] bg-slate-100 border border-slate-200/60 text-slate-500 px-2 py-0.5 rounded-md">
                                  DOI: {article.doi}
                                </span>
                                <span className="text-xs text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                                  Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic py-4">No articles matched your search.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
