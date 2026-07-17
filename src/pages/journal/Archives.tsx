import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowLeft, Archive, Book, Loader2 } from 'lucide-react';
import { useTenantStore } from '../../store/useTenantStore';

import { useTranslation } from '../../hooks/useTranslation';

export default function Archives() {
  const navigate = useNavigate();
  const { tenant_slug } = useParams<{ tenant_slug: string }>();
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const { t } = useTranslation();

  const { archives, isLoading, fetchArchives } = useTenantStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (tenant_slug) {
      fetchArchives(tenant_slug);
    }
  }, [tenant_slug, fetchArchives]);

  // Group issues by year dynamically
  const grouped = archives.reduce((acc: { [key: number]: typeof archives }, issue) => {
    const year = issue.published_at ? new Date(issue.published_at).getFullYear() : 2026;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(issue);
    return acc;
  }, {});

  const archivesData = Object.keys(grouped)
    .map(yearStr => {
      const year = parseInt(yearStr);
      return {
        year,
        volumes: grouped[year]
      };
    })
    .sort((a, b) => b.year - a.year);

  // Set the first year expanded by default once data is loaded
  useEffect(() => {
    if (archivesData.length > 0 && expandedYear === null) {
      setExpandedYear(archivesData[0].year);
    }
  }, [archivesData, expandedYear]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="text-slate-500 font-bold text-sm">Loading archives...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 font-sans text-slate-800 pb-20 pt-32 md:pt-36 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-white hover:bg-indigo-50/20 border border-slate-200/80 hover:border-indigo-200/60 rounded-xl shadow-sm hover:shadow transition-all duration-300 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            {t.journal.back}
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Archive className="w-6 h-6 text-indigo-600" />
              Issue Archives
            </h2>
          </div>

          {archivesData.length === 0 ? (
            <div className="text-center text-slate-500 font-medium py-10">
              No archived issues found.
            </div>
          ) : (
            <div className="space-y-4">
              {archivesData.map((archive) => (
                <div key={archive.year} className="border border-slate-200/80 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedYear(expandedYear === archive.year ? null : archive.year)}
                    className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <span className="text-lg font-bold text-slate-800">{archive.year}</span>
                    {expandedYear === archive.year ? (
                      <ChevronUp className="w-5 h-5 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedYear === archive.year && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white"
                      >
                        <div className="p-5 space-y-3">
                          {archive.volumes.map((vol, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                              onClick={() => navigate(`../current`)}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                  <Book className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-800">
                                    Volume {vol.issue_volume || 'N/A'}, Issue {vol.issue_number || 'N/A'}
                                  </h4>
                                  <p className="text-xs text-slate-500">
                                    {vol.issue_title_english || vol.issue_title_native || 'Issue details'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                                {vol.articles?.length || 0} Articles
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
