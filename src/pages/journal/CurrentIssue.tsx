import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, User, ChevronDown, ChevronUp, ArrowLeft, Loader2 } from 'lucide-react';
import { useTenantStore } from '../../store/useTenantStore';
import { toast } from 'sonner';

import { useTranslation } from '../../hooks/useTranslation';

export default function CurrentIssue() {
  const navigate = useNavigate();
  const { tenant_slug } = useParams<{ tenant_slug: string }>();
  const [expandedAbstract, setExpandedAbstract] = useState<number | string | null>(null);
  const { t } = useTranslation();

  const { currentIssue, isLoading, fetchCurrentIssue, trackDownload } = useTenantStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (tenant_slug) {
      fetchCurrentIssue(tenant_slug);
    }
  }, [tenant_slug, fetchCurrentIssue]);

  if (isLoading || !currentIssue) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="text-slate-500 font-bold text-sm">Loading current issue...</span>
        </div>
      </div>
    );
  }

  const issueDate = currentIssue.published_at
    ? new Date(currentIssue.published_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })
    : 'June/July 2026';

  const articles = currentIssue.articles || [];

  const handleDownload = async (artId: string | number) => {
    await trackDownload(artId);
    
    const article = articles.find(a => a.id === artId);
    const pdfUrl = article?.pdf_url && article.pdf_url !== '#'
      ? article.pdf_url
      : '/sample.pdf';
      
    try {
      // Fetch as blob to force a direct browser download on the device
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${(article?.title || 'article').replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('Direct Blob download failed, falling back to link click:', err);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.setAttribute('download', `${(article?.title || 'article').replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    toast.success("PDF download started & analytic logged!");
  };

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
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {currentIssue.issue_title_english || 'Current Issue'}
            </h2>
            <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 rounded-lg">
              {issueDate}
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="text-center text-slate-500 font-medium py-10">
              No articles published in this issue yet.
            </div>
          ) : (
            <div className="space-y-6 divide-y divide-slate-100">
              {articles.map((article, index) => (
                <div key={`${article.id}-${index}`} className={`pt-6 text-left space-y-4 ${index === 0 ? '!pt-0' : ''}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-black text-indigo-600 tracking-widest font-mono uppercase">
                      DOI: {article.doi || '10.xxxx/xxxx'}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Pages: {article.pages || 'N/A'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3
                      onClick={() => {
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                        navigate(`../article/${article.id}`);
                      }}
                      className="text-lg font-bold text-slate-900 leading-snug hover:text-indigo-700 transition-colors cursor-pointer"
                    >
                      {article.title || article.titleEn || article.titleTr}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{article.author || article.authors?.map(a => a.name).join(', ')}</span>
                    </div>
                  </div>

                  {(article.abstract || article.abstractEn || article.abstractTr) && (
                    <div className="space-y-2">
                      <button
                        onClick={() => setExpandedAbstract(expandedAbstract === article.id ? null : article.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
                      >
                        <span>Abstract</span>
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
                            {article.abstract || article.abstractEn || article.abstractTr}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleDownload(article.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
