import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, CheckCircle, Clock, AlertTriangle, FileText, Check, X, RefreshCcw } from 'lucide-react';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useApiMutation } from '../../../hooks/useApiMutation';
import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  category?: string;
  author: string;
  status: string;
  date?: string;
  pdfUrl?: string;
}

interface Reviewer {
  id: string;
  name: string;
}

export default function Articles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const { t, locale } = useLocaleStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: articlesData, isLoading, error, refetch } = useApiQuery<{ data: Article[], totalPages: number }>({
    url: '/api/editor/articles',
    params: { search: debouncedSearch, status: statusFilter, page, limit: 10 }
  });

  const articles: Article[] = articlesData?.data || ([] as Article[]);
  const totalPages = articlesData?.totalPages || 1;

  const { data: reviewers = [] } = useApiQuery<Reviewer[]>({ url: '/api/editor/reviewers' });

  const { mutate: updateStatus } = useApiMutation<{ id: string, status: string }, any>(
    (payload: { id: string, status: string }) => `/api/editor/articles/${payload.id}/status`,
    {
      method: 'PATCH',
      onSuccess: () => {
        refetch();
        setActiveMenuId(null);
      }
    }
  );

  const { mutate: assignReviewer } = useApiMutation<{ id: string, reviewerId: string }, any>(
    (payload: { id: string, reviewerId: string }) => `/api/editor/articles/${payload.id}/assign-reviewer`,
    {
      method: 'POST',
      onSuccess: () => {
        refetch();
        setActiveMenuId(null);
      },
      showSuccessToast: 'Reviewer assigned'
    }
  );

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatus({ id, status }, { 
      data: { status } 
    }).then(() => {
      toast.success(`Status updated to ${status}`);
    }).catch((err) => {
      toast.error(`Failed to update: ${err.message || 'Error'}`);
    });
  };

  const handleAssignReviewer = (id: string, reviewerId: string) => {
    if (!reviewerId) return;
    assignReviewer({ id, reviewerId }, { data: { reviewerId } });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'IN_REVIEW': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> {t('stat.inReview') || 'In Review'}</span>;
      case 'PENDING_PRE_CHECK': return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold w-fit">{locale === 'tr' ? 'Ön Kontrol' : 'Pre-Check'}</span>;
      case 'REVISION_REQUIRED': return <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold w-fit">{locale === 'tr' ? 'Revizyon' : 'Revision'}</span>;
      case 'ACCEPTED': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> {locale === 'tr' ? 'Kabul Edildi' : 'Accepted'}</span>;
      case 'REJECTED': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold w-fit">Rejected</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold w-fit">{status || 'Unknown'}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full relative">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'tr' ? 'ID veya Başlık ara...' : 'Search ID or Title...'} 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
            />
          </div>
          <div className="relative">
            <select 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none"
            >
              <option value="">{locale === 'tr' ? 'Tüm Durumlar' : 'All Statuses'}</option>
              <option value="PENDING_PRE_CHECK">Pending Pre-Check</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="REVISION_REQUIRED">Revision Required</option>
              <option value="ACCEPTED">Accepted</option>
            </select>
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar flex-1 pb-32">
        {isLoading ? (
          <div className="p-8">
            <TableSkeleton rows={5} cols={6} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500 flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {error.message || 'Failed to load articles'}
          </div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-slate-400">{t('dashboard.noData')}</div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-slate-100">{locale === 'tr' ? 'Makale ID' : 'Manuscript ID'}</th>
                <th className="p-4 font-bold border-b border-slate-100">{locale === 'tr' ? 'Başlık ve Kategori' : 'Title & Category'}</th>
                <th className="p-4 font-bold border-b border-slate-100">{locale === 'tr' ? 'Yazar' : 'Author'}</th>
                <th className="p-4 font-bold border-b border-slate-100">{locale === 'tr' ? 'Durum' : 'Status'}</th>
                <th className="p-4 font-bold border-b border-slate-100">{locale === 'tr' ? 'Gönderim' : 'Submitted'}</th>
                <th className="p-4 font-bold border-b border-slate-100 text-right">{locale === 'tr' ? 'İşlemler' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((article: Article) => (
                <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{article.id}</span>
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors" title={article.title}>{article.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{article.category || (locale === 'tr' ? 'Araştırma Makalesi' : 'Research Article')}</p>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-600">{article.author}</td>
                  <td className="p-4">{getStatusBadge(article.status)}</td>
                  <td className="p-4 text-sm text-slate-500">{article.date || new Date().toLocaleDateString()}</td>
                  <td className="p-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === article.id ? null : article.id)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {activeMenuId === article.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                        <div className="absolute right-8 top-10 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 text-left">
                          <button onClick={() => { window.open(article.pdfUrl || '#', '_blank'); setActiveMenuId(null); }} className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> View PDF
                          </button>
                          
                          <div className="px-4 py-2 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase">Assign Reviewer</span>
                            <select 
                              className="w-full mt-1 text-sm bg-slate-50 border border-slate-200 rounded py-1 px-2"
                              onChange={(e) => handleAssignReviewer(article.id, e.target.value)}
                              defaultValue=""
                            >
                              <option value="" disabled>Select reviewer...</option>
                              {reviewers && reviewers.map((r: Reviewer) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="border-t border-slate-100 my-1" />
                          <button onClick={() => handleUpdateStatus(article.id, 'REVISION_REQUIRED')} className="w-full px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                            <RefreshCcw className="w-4 h-4" /> Send to Revision
                          </button>
                          <button onClick={() => handleUpdateStatus(article.id, 'ACCEPTED')} className="w-full px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                            <Check className="w-4 h-4" /> Accept
                          </button>
                          <button onClick={() => handleUpdateStatus(article.id, 'REJECTED')} className="w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                            <X className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50">
        <span>{locale === 'tr' ? `${articles.length} kayıt gösteriliyor` : `Showing ${articles.length} entries`}</span>
        <div className="flex gap-1">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-slate-200 bg-white rounded hover:bg-slate-50 disabled:opacity-50" 
          >
            {locale === 'tr' ? 'Önceki' : 'Prev'}
          </button>
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 border border-slate-200 bg-white rounded hover:bg-slate-50 disabled:opacity-50"
          >
            {locale === 'tr' ? 'Sonraki' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
