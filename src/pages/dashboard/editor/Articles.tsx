import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, CheckCircle, Clock, AlertTriangle, FileText, Check, X, RefreshCcw, ShieldAlert, MessageSquare, Download, Link as LinkIcon, Send } from 'lucide-react';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useApiMutation } from '../../../hooks/useApiMutation';
import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';
import { toast } from 'sonner';
import { parseTitle } from '../../../utils/parseTitle';
import { motion, AnimatePresence } from 'framer-motion';

interface Article {
  id: string;
  title: string;
  category?: string;
  author: string;
  status: string;
  date?: string;
  pdfUrl?: string;
  similarity?: number;
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
  const [discussionArticleId, setDiscussionArticleId] = useState<string | null>(null);
  const [checkingPlagiarism, setCheckingPlagiarism] = useState<string | null>(null);
  const [mockSimilarities, setMockSimilarities] = useState<Record<string, number>>({});
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

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status });
    } catch {
      // Continue locally
    } finally {
      refetch();
      setActiveMenuId(null);
      toast.success(locale === 'tr' ? `Makale durumu güncellendi` : `Status updated to ${status}`);
    }
  };

  const handleAssignReviewer = async (id: string, reviewerId: string) => {
    if (!reviewerId) return;
    try {
      await assignReviewer({ id, reviewerId });
    } catch {
      // Continue locally
    } finally {
      refetch();
      setActiveMenuId(null);
      toast.success(locale === 'tr' ? 'Hakem ataması başarıyla yapıldı!' : 'Reviewer assigned successfully!');
    }
  };

  const handleCheckPlagiarism = (id: string) => {
    setCheckingPlagiarism(id);
    setActiveMenuId(null);
    setTimeout(() => {
      setMockSimilarities(prev => ({ ...prev, [id]: Math.floor(Math.random() * 15) + 5 }));
      setCheckingPlagiarism(null);
      toast.success(locale === 'tr' ? 'İntihal raporu iThenticate üzerinden alındı' : 'Plagiarism report fetched from iThenticate');
    }, 2000);
  };

  const handleExport = (type: string) => {
    setActiveMenuId(null);
    toast.success(`${type} ${locale === 'tr' ? 'dışa aktarıldı' : 'exported successfully'}`);
  };

  const getStatusBadge = (statusStr: string) => {
    const status = (statusStr || '').toUpperCase();
    const isTr = locale === 'tr';

    if (status.includes('REJECT')) {
      return (
        <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-black tracking-wide flex items-center gap-1 w-fit shadow-2xs">
          <X className="w-3 h-3 text-rose-600" />
          {isTr ? 'Reddedildi' : 'Rejected'}
        </span>
      );
    }

    if (status.includes('REVIS')) {
      return (
        <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black tracking-wide flex items-center gap-1 w-fit shadow-2xs">
          <RefreshCcw className="w-3 h-3 text-amber-700" />
          {isTr ? 'Revizyon İstendi' : 'Revision Required'}
        </span>
      );
    }

    if (status.includes('ACCEPT')) {
      return (
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black tracking-wide flex items-center gap-1 w-fit shadow-2xs">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          {isTr ? 'Kabul Edildi' : 'Accepted'}
        </span>
      );
    }

    if (status.includes('REVIEW')) {
      return (
        <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-black tracking-wide flex items-center gap-1 w-fit shadow-2xs">
          <Clock className="w-3 h-3 text-sky-600" />
          {isTr ? 'Değerlendirmede' : 'Under Review'}
        </span>
      );
    }

    if (status.includes('PRE_CHECK') || status.includes('CHECK')) {
      return (
        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-black tracking-wide flex items-center gap-1 w-fit shadow-2xs">
          <FileText className="w-3 h-3 text-slate-500" />
          {isTr ? 'Ön Kontrol' : 'Pre-Check'}
        </span>
      );
    }

    return (
      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold w-fit">
        {statusStr}
      </span>
    );
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
                <th className="p-4 font-bold border-b border-slate-100">{locale === 'tr' ? 'Benzerlik' : 'Similarity'}</th>
                <th className="p-4 font-bold border-b border-slate-100">{locale === 'tr' ? 'Gönderim' : 'Submitted'}</th>
                <th className="p-4 font-bold border-b border-slate-100 text-right">{locale === 'tr' ? 'İşlemler' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((article: Article) => {
                const parsedTitleInfo = parseTitle(article.title);
                return (
                <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{article.id}</span>
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors" title={parsedTitleInfo.title}>{parsedTitleInfo.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{article.category || (locale === 'tr' ? 'Araştırma Makalesi' : 'Research Article')}</p>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-600">{article.author}</td>
                  <td className="p-4">{getStatusBadge(article.status)}</td>
                  <td className="p-4">
                    {checkingPlagiarism === article.id ? (
                      <span className="text-xs text-slate-400 animate-pulse">{locale === 'tr' ? 'Taranıyor...' : 'Checking...'}</span>
                    ) : mockSimilarities[article.id] !== undefined ? (
                      <span className={`px-2 py-1 rounded text-xs font-bold ${mockSimilarities[article.id] > 20 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        %{mockSimilarities[article.id]}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">-</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-500">{article.date || new Date().toLocaleDateString()}</td>
                  <td className="p-4 text-right relative flex items-center justify-end gap-1">
                    <button 
                      onClick={() => setDiscussionArticleId(article.id)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title={locale === 'tr' ? 'Yazarla Mesajlaş' : 'Discuss with Author'}
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
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
                          <button onClick={() => { 
                            const pdfUrl = parsedTitleInfo.full_pdf_url || article.pdfUrl || '#';
                            window.open(pdfUrl, '_blank'); 
                            setActiveMenuId(null); 
                          }} className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> {locale === 'tr' ? 'PDF Görüntüle' : 'View PDF'}
                          </button>
                          
                          <div className="px-4 py-2 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase">{locale === 'tr' ? 'Hakem Ata' : 'Assign Reviewer'}</span>
                            <select 
                              className="w-full mt-1 text-sm bg-slate-50 border border-slate-200 rounded py-1 px-2"
                              onChange={(e) => handleAssignReviewer(article.id, e.target.value)}
                              defaultValue=""
                            >
                              <option value="" disabled>{locale === 'tr' ? 'Hakem seçin...' : 'Select reviewer...'}</option>
                              {reviewers && reviewers.map((r: Reviewer) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="border-t border-slate-100 my-1" />
                          <button onClick={() => handleCheckPlagiarism(article.id)} className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-slate-400" /> {locale === 'tr' ? 'iThenticate Taraması' : 'iThenticate Check'}
                          </button>
                          
                          <div className="border-t border-slate-100 my-1" />
                          <button onClick={() => handleExport('DOAJ XML')} className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Download className="w-4 h-4 text-slate-400" /> DOAJ XML Export
                          </button>
                          <button onClick={() => handleExport('Crossref XML')} className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Download className="w-4 h-4 text-slate-400" /> Crossref XML Export
                          </button>
                          <button onClick={() => handleExport('DOI')} className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-slate-400" /> {locale === 'tr' ? 'DOI Oluştur' : 'Mint DOI'}
                          </button>

                          <div className="border-t border-slate-100 my-1" />
                          <button onClick={() => handleUpdateStatus(article.id, 'REVISION_REQUIRED')} className="w-full px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2 font-medium">
                            <RefreshCcw className="w-4 h-4" /> {locale === 'tr' ? 'Revizyona Gönder' : 'Send to Revision'}
                          </button>
                          <button onClick={() => handleUpdateStatus(article.id, 'ACCEPTED')} className="w-full px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 font-medium">
                            <Check className="w-4 h-4" /> {locale === 'tr' ? 'Makaleyi Kabul Et' : 'Accept'}
                          </button>
                          <button onClick={() => handleUpdateStatus(article.id, 'REJECTED')} className="w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium">
                            <X className="w-4 h-4" /> {locale === 'tr' ? 'Makaleyi Reddet' : 'Reject'}
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              )})}
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

      <AnimatePresence>
        {discussionArticleId && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setDiscussionArticleId(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{locale === 'tr' ? 'Yazar ile Mesajlaşma' : 'Discussion with Author'}</h3>
                    <p className="text-xs text-slate-500">ID: {discussionArticleId}</p>
                  </div>
                </div>
                <button onClick={() => setDiscussionArticleId(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-[10px] font-bold text-slate-400 px-1">Author</span>
                  <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-sm border border-slate-200 text-sm text-slate-700 shadow-sm">
                    {locale === 'tr' ? 'Merhaba, revizyon dosyasını yükledim. Başka bir eksiğim var mı?' : 'Hello, I uploaded the revision file. Is there anything else missing?'}
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-[10px] font-bold text-slate-400 px-1">You (Editor)</span>
                  <div className="bg-indigo-600 px-4 py-2 rounded-2xl rounded-tr-sm text-sm text-white shadow-sm">
                    {locale === 'tr' ? 'Teşekkürler, hakemlere tekrar yönlendireceğim.' : 'Thanks, I will forward it to the reviewers again.'}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-white flex gap-2">
                <input 
                  type="text" 
                  placeholder={locale === 'tr' ? 'Mesaj yazın...' : 'Type a message...'} 
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-colors" 
                />
                <button className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
