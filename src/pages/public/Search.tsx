import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search as SearchIcon,
  X,
  Loader2,
  BookOpen,
  FileText,
  Fingerprint,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { apiClient } from '../../services/api/client';
import { useJournalStore } from '../../store/useJournalStore';

export default function Search() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const { journals, fetchJournals, isLoading: isJournalsLoading } = useJournalStore();
  const [searchInput, setSearchInput] = useState(queryParam);
  const [searchResults, setSearchResults] = useState<{ articles: any[]; journals: any[]; doiMatches?: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  useEffect(() => {
    setSearchInput(queryParam);
    handleSearch(queryParam);
  }, [queryParam, journals]);

  const handleSearch = async (queryText: string) => {
    if (!queryText.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
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

  const executeSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchParams({ q: searchInput });
  };

  const handleClear = () => {
    setSearchInput('');
    setSearchParams({});
    setSearchResults(null);
  };

  return (
    <main className="pb-24 pt-32 max-w-7xl mx-auto px-6 lg:px-8 relative z-10 min-h-[80vh]">
      {/* Back button and page intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-slate-100 pb-8">
        <div className="max-w-2xl text-left">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t.directory?.back || 'Back to Home'}
            </Link>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-350"></div>
            <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-xs md:text-sm tracking-wider uppercase">
              Global Platform Registry
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">
            Search Results
          </h1>
          <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed">
            Discover peer-reviewed journals, research articles, and DOIs across our entire academic network.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Glassmorphic Search Input Bar */}
        <form onSubmit={executeSearch} className="bg-slate-50/80 backdrop-blur-md border border-slate-200/80 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm flex gap-3 max-w-2xl">
          <div className="relative flex-1 group">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <SearchIcon className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.hero?.searchPlaceholder || 'Search journals, articles, DOI...'}
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium shadow-sm text-sm"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-3 flex items-center px-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
          >
            {t.hero?.searchBtn || 'Search'}
          </button>
        </form>

        {/* Results Sections */}
        <div className="w-full">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Searching across all databases...</p>
            </div>
          ) : searchResults && (searchResults.articles.length > 0 || searchResults.journals.length > 0 || (searchResults.doiMatches && searchResults.doiMatches.length > 0)) ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/60 items-stretch">
                
                {/* Journals Section */}
                <div className="space-y-6 text-left flex flex-col">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-indigo-500" /> Matches in Journals ({searchResults.journals.length})
                  </h4>
                  {searchResults.journals.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-4">
                      {searchResults.journals.map((journal: any) => {
                        const storeMatch = journals.find(j => j.id.toLowerCase() === journal.id.toLowerCase());
                        return (
                          <Link
                            key={journal.id}
                            to={`/${journal.slug || journal.id.toLowerCase()}`}
                            className="flex items-center gap-4 p-5 rounded-2xl bg-white hover:bg-indigo-50/30 border border-slate-200/80 hover:border-indigo-200 transition-all duration-300 group shadow-sm min-h-[110px]"
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
                              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200/50 font-mono">
                                  {journal.issn || storeMatch?.issn || 'XXXX-XXXX'}
                                </span>
                                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100/50">
                                  {journal.index || storeMatch?.index || 'Crossref Indexed'}
                                </span>
                              </div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-150 group-hover:bg-indigo-50 group-hover:border-indigo-100 shrink-0 transition-colors">
                              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors group-hover:translate-x-0.5" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic py-4">No journals matched your search query.</p>
                  )}
                </div>

                {/* Articles Section */}
                <div className="space-y-6 lg:pl-12 pt-8 lg:pt-0 text-left flex flex-col">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-indigo-500" /> Matches in Articles ({searchResults.articles.length})
                  </h4>
                  {searchResults.articles.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {searchResults.articles.map((article: any) => (
                        <Link
                          key={article.id}
                          to={`/${article.journalSlug || 'js'}/article/${article.id}`}
                          className="flex flex-col justify-between p-5 rounded-2xl bg-white hover:bg-indigo-50/30 border border-slate-200/80 hover:border-indigo-200 transition-all duration-300 group shadow-sm min-h-[110px]"
                        >
                          <div className="font-extrabold text-slate-800 text-sm md:text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {article.title}
                          </div>
                          <div className="flex flex-wrap gap-2 items-center mt-3 text-xs">
                            <span className="font-semibold text-slate-600">{article.author}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-slate-400 font-medium italic truncate max-w-[200px]">{article.journalName || 'Academic Journal'}</span>
                          </div>
                          {article.doi && (
                            <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                              <span className="font-mono text-[10px] bg-slate-100 border border-slate-200/60 text-slate-500 px-2 py-0.5 rounded-md">
                                DOI: {article.doi}
                              </span>
                              <span className="text-xs text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                                Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </span>
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic py-4">No articles matched your search query.</p>
                  )}
                </div>
              </div>

              {/* DOI Matches Section */}
              {searchResults.doiMatches && searchResults.doiMatches.length > 0 && (
                <div className="border-t border-slate-200/60 pt-10">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 text-left">
                    <Fingerprint className="w-4.5 h-4.5 text-indigo-500" /> All Matches by DOI ({searchResults.doiMatches.length})
                  </h4>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {searchResults.doiMatches.map((article: any) => (
                      <Link
                        key={article.id}
                        to={`/${article.journalSlug || 'js'}/article/${article.id}`}
                        className="flex-shrink-0 w-[290px] flex flex-col justify-between p-5 rounded-2xl bg-white hover:bg-indigo-50/30 border border-slate-200/80 hover:border-indigo-200 transition-all duration-300 group shadow-sm min-h-[110px]"
                      >
                        <div className="font-extrabold text-slate-800 text-sm leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 text-left">
                          {article.title}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="font-mono text-[9px] bg-slate-105 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded-md truncate max-w-[170px]">
                            {article.doi}
                          </span>
                          <span className="text-[10px] text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center gap-0.5 shrink-0">
                            Read <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : queryParam ? (
            /* Empty state for non-empty search query with no results */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-50 border border-slate-200 border-dashed rounded-[2.5rem] p-16 text-center max-w-lg mx-auto"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-250">
                <SearchIcon className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Results Found</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                We couldn't find any journals, articles, or DOIs matching "{queryParam}". Try checking spelling or using broader search terms.
              </p>
              <button
                onClick={handleClear}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Reset Search
              </button>
            </motion.div>
          ) : (
            /* Initial state before search query is entered */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-slate-400"
            >
              <SearchIcon className="w-12 h-12 mb-4 text-slate-300" />
              <p className="text-sm font-semibold">Enter a search query above to browse journals and articles.</p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
