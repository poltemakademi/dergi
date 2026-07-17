import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, FileText, User, Share2, Quote, CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useTenantStore } from '../../store/useTenantStore';
import { toast } from 'sonner';

import { useTranslation } from '../../hooks/useTranslation';

export default function ArticleDetail() {
  const navigate = useNavigate();
  const { tenant_slug, id } = useParams<{ tenant_slug: string; id: string }>();
  const { t } = useTranslation();

  const { activeArticle, isLoading, fetchArticleDetail, trackDownload } = useTenantStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (tenant_slug && id) {
      fetchArticleDetail(tenant_slug, id);
    }
  }, [tenant_slug, id, fetchArticleDetail]);

  if (isLoading || !activeArticle) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="text-slate-500 font-bold text-sm">Loading article details...</span>
        </div>
      </div>
    );
  }

  const publishedDate = activeArticle.published || (activeArticle.published_at
    ? new Date(activeArticle.published_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'July 15, 2026');

  const authors = activeArticle.authors || [];
  const keywordsEn = activeArticle.keywordsEn || activeArticle.keywords || [];
  const keywordsTr = activeArticle.keywordsTr || activeArticle.keywords || [];

  const handleDownload = async () => {
    if (id) {
      await trackDownload(id);
      
      const pdfUrl = activeArticle?.pdf_url && activeArticle.pdf_url !== '#'
        ? activeArticle.pdf_url
        : '/sample.pdf';
        
      try {
        // Fetch as blob to force a direct browser download on the device
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', `${(activeArticle?.title || 'article').replace(/\s+/g, '_')}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (err) {
        console.warn('Direct Blob download failed, falling back to link click:', err);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.target = '_blank';
        link.setAttribute('download', `${(activeArticle?.title || 'article').replace(/\s+/g, '_')}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast.success("PDF download metric recorded & download started!");
    }
  };

  const handleCite = () => {
    const citation = `${authors.map(a => a.name).join(', ')}. "${activeArticle.titleEn || activeArticle.title}". ${activeArticle.issue || 'Journal'}. DOI: ${activeArticle.doi || 'N/A'}`;
    navigator.clipboard.writeText(citation);
    toast.success("APA Citation copied to clipboard!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 font-sans text-slate-800 pb-20 pt-32 md:pt-36 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="mb-2">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-white hover:bg-indigo-50/20 border border-slate-200/80 hover:border-indigo-200/60 rounded-xl shadow-sm hover:shadow transition-all duration-300 group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              {t.journal.back}
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-8">
            {/* Header info */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 rounded-lg">
                  Research Article
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Published: {publishedDate}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                {activeArticle.titleEn || activeArticle.title}
              </h1>
              {(activeArticle.titleTr && activeArticle.titleTr !== activeArticle.titleEn) && (
                <h2 className="text-xl md:text-2xl font-bold text-slate-500 leading-tight">
                  {activeArticle.titleTr}
                </h2>
              )}

              <div className="flex flex-col gap-3 pt-2">
                {authors.map((author, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{author.name}</div>
                      {author.affiliation && <div className="text-xs text-slate-500">{author.affiliation}</div>}
                      {author.orcid && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> ORCID: {author.orcid}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* English Abstract & Keywords */}
            {(activeArticle.abstractEn || activeArticle.abstract) && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">
                  Abstract
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed text-justify">
                  {activeArticle.abstractEn || activeArticle.abstract}
                </p>
                {keywordsEn.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {keywordsEn.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Turkish Abstract & Keywords */}
            {(activeArticle.abstractTr && activeArticle.abstractTr !== activeArticle.abstractEn) && (
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">
                  Özet
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed text-justify">
                  {activeArticle.abstractTr}
                </p>
                {keywordsTr.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {keywordsTr.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Sidebar Info & Actions */}
        <div className="lg:col-span-4 space-y-6">

          {/* Download Action */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-lg space-y-6">
            <h3 className="font-bold text-lg">Access Article</h3>
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-indigo-700 font-extrabold text-sm rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Download className="w-5 h-5" />
              Download Full PDF
            </button>
            <div className="text-xs text-indigo-200 text-center flex items-center justify-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Size: 1.2 MB
            </div>
          </div>

          {/* Metrics & Meta */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Article Metrics</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">DOI</span>
                {activeArticle.doi ? (
                  <a href={`https://doi.org/${activeArticle.doi}`} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">
                    {activeArticle.doi}
                  </a>
                ) : (
                  <span className="text-slate-400">N/A</span>
                )}
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">Issue</span>
                <span className="text-slate-800 font-bold">{activeArticle.issue || 'Vol. 5 No. 1 (2026)'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">Pages</span>
                <span className="text-slate-800 font-bold">{activeArticle.pages || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">Downloads</span>
                <span className="text-slate-800 font-bold flex items-center gap-1">
                  <Download className="w-3 h-3 text-slate-400" /> {activeArticle.downloads_count || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Tools</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleCite}
                className="w-full flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-lg text-left"
              >
                <Quote className="w-4 h-4" /> Cite This Article
              </button>
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-lg text-left"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
