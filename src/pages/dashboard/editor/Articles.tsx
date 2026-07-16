import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../../services/api/client';

export default function Articles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await apiClient.get('/api/editor/articles');
        setArticles(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch articles:', err);
        setError('Failed to load articles.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'IN_REVIEW': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> In Review</span>;
      case 'PENDING_PRE_CHECK': return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold w-fit">Pre-Check</span>;
      case 'REVISION_REQUIRED': return <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold w-fit">Revision</span>;
      case 'ACCEPTED': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> Accepted</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold w-fit">{status || 'Unknown'}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full relative">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search ID or Title..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
          </div>
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none lg:hidden z-10" />

      <div className="overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-bold border-b border-slate-100">Manuscript ID</th>
              <th className="p-4 font-bold border-b border-slate-100">Title & Category</th>
              <th className="p-4 font-bold border-b border-slate-100">Author</th>
              <th className="p-4 font-bold border-b border-slate-100">Status</th>
              <th className="p-4 font-bold border-b border-slate-100">Submitted</th>
              <th className="p-4 font-bold border-b border-slate-100 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">Loading articles...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-rose-500 flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> {error}
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">No articles found.</td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{article.id}</span>
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors" title={article.title}>{article.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{article.category || 'Research Article'}</p>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-600">{article.author}</td>
                  <td className="p-4">{getStatusBadge(article.status)}</td>
                  <td className="p-4 text-sm text-slate-500">{article.date || new Date().toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
        <span>Showing {articles.length} entries</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
