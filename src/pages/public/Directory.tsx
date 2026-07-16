import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  CheckCircle2,
  LayoutGrid,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useJournalStore } from '../../store/useJournalStore';

export default function Directory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<string>('All');
  const { t } = useTranslation();
  const labels = t.indexLabels;
  const { journals, isLoading, fetchJournals } = useJournalStore();

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredJournals = useMemo(() => {
    return journals.filter((journal) => {
      const matchesSearch =
        journal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        journal.tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        journal.issn.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesIndex = selectedIndex === 'All' || journal.index === selectedIndex;
      return matchesSearch && matchesIndex;
    });
  }, [journals, searchQuery, selectedIndex]);

  return (
    <main className="pb-24 pt-32 max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
      {/* Back button and page intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-slate-100 pb-8">
        <div className="max-w-2xl text-left">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t.directory.back}
            </Link>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300"></div>
            <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-xs md:text-sm tracking-wider uppercase">
              {t.directory.sub}
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">
            {t.directory.title}
          </h1>
          <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed">
            {t.directory.desc}
          </p>
        </div>

        <div className="shrink-0">
          <div className="px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-600 text-xs font-bold flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-indigo-600" />
            <span>{filteredJournals.length} {t.directory.activeCount}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6 md:space-y-10">
        {/* Glassmorphic Search & Filters Panel */}
        <div className="bg-slate-50/80 backdrop-blur-md border border-slate-200/80 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">

          {/* Search Box */}
          <div className="relative w-full md:w-96 group">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.directory.searchPlaceholder}
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium shadow-sm text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center px-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Index Filters */}
          <div className="flex flex-nowrap md:flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none snap-x">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0 snap-center">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t.directory.filterLabel}</span>
            </div>
            {['All', 'Scopus Indexed', 'Web of Science', 'Crossref Pending'].map((indexType) => (
              <button
                key={indexType}
                onClick={() => setSelectedIndex(indexType)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-300 whitespace-nowrap cursor-pointer shadow-sm shrink-0 snap-center ${selectedIndex === indexType
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
              >
                {labels?.[indexType] || indexType}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Layout */}
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </motion.div>
          ) : filteredJournals.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
            >
              {filteredJournals.map((journal) => (
                <motion.div
                  layout
                  key={journal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl md:rounded-[2.2rem] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_70px_-15px_rgba(79,70,229,0.15)] hover:border-indigo-300/80 transition-all duration-500 group/card relative flex flex-col overflow-hidden text-left"
                >
                  <Link to={`/${journal.id.toLowerCase()}`} className="flex flex-col flex-1 h-full cursor-pointer">
                    {/* Cover Area */}
                    <div className="h-28 md:h-48 relative overflow-hidden shrink-0 block">
                      <div className="absolute inset-0 bg-slate-900">
                        <img
                          src={journal.cover}
                          alt={journal.name}
                          className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-700"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                      <div className="absolute bottom-3 md:bottom-4 left-3 md:left-6 right-3 md:right-6 flex items-end justify-between z-10 gap-1">
                        <div className="w-8 h-8 md:w-14 md:h-14 bg-white/20 backdrop-blur-md text-white font-black text-xs md:text-xl rounded-lg md:rounded-[1rem] flex items-center justify-center border border-white/30 shadow-lg group-hover/card:bg-indigo-50 group-hover/card:border-indigo-400 group-hover/card:scale-110 transition-all duration-500 shrink-0">
                          {journal.id}
                        </div>
                        <div className={`flex items-center gap-1 md:gap-1.5 px-1.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border ${journal.indexColor} bg-white shadow-sm scale-[0.85] md:scale-90 origin-bottom-right group-hover/card:scale-[0.95] md:group-hover/card:scale-100 transition-transform duration-500 min-w-0`}>
                          <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                          <span className="text-[9px] md:text-[10px] font-bold tracking-wide uppercase truncate">{journal.index}</span>
                        </div>
                      </div>
                    </div>

                    {/* Info & Actions Area */}
                    <div className="p-3 md:p-6 flex flex-col flex-1 justify-between space-y-3 md:space-y-6">
                      <div>
                        <h3 className="text-sm md:text-2xl font-black text-slate-900 mb-1 md:mb-2 leading-tight group-hover/card:text-indigo-700 transition-colors line-clamp-2 md:line-clamp-2" title={journal.name}>{journal.name}</h3>
                        <p className="text-slate-500 font-medium text-[10px] md:text-sm italic line-clamp-1 md:line-clamp-none">{journal.tr}</p>
                      </div>

                      {/* Card CTA Actions */}
                      <div className="mt-auto pt-3 md:pt-6 border-t border-slate-100/80 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[8px] md:text-[10px] font-black tracking-widest text-slate-400 uppercase mb-0 md:mb-0.5">E-ISSN</span>
                          <span className="text-[10px] md:text-sm font-bold text-slate-700 font-mono">{journal.issn}</span>
                        </div>
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover/card:bg-indigo-50 group-hover/card:border-indigo-100 transition-colors shrink-0">
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-slate-400 group-hover/card:text-indigo-600 transition-colors group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty state */
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-50 border border-slate-200 border-dashed rounded-[2.5rem] p-16 text-center max-w-lg mx-auto"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200">
                <Search className="w-7 h-7 text-slate-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{t.directory.noResults}</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                {t.directory.noResultsDesc.replace('{query}', searchQuery)}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedIndex('All');
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                {t.directory.reset}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

