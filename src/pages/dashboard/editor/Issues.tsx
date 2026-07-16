import { useState, useEffect } from 'react';
import { Plus, Book, FileText, CheckCircle, Upload, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../../services/api/client';
import { toast } from 'sonner';

export default function Issues() {
  const [acceptedArticles, setAcceptedArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await apiClient.get('/api/editor/issues');
        // Assuming API returns { acceptedArticles: [...] }
        setAcceptedArticles(response.data?.acceptedArticles || response.data || []);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch issues:', err);
        setError('Failed to load accepted articles.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Simulation of publishing
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Issue published successfully!');
    } catch (err: any) {
      toast.error('Failed to publish issue.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Left: Unassigned Accepted Articles */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 h-[600px] lg:h-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Accepted (Awaiting Issue)</h3>
          <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">{acceptedArticles.length} items</span>
        </div>
        
        <div className="bg-slate-100 rounded-2xl p-4 flex-1 overflow-y-auto space-y-3 border border-slate-200 border-dashed custom-scrollbar">
          {isLoading ? (
            <div className="text-center text-slate-500 py-8">Loading articles...</div>
          ) : error ? (
            <div className="text-center text-rose-500 py-8 flex flex-col items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> {error}
            </div>
          ) : acceptedArticles.length === 0 ? (
            <div className="text-center text-slate-500 py-8">No accepted articles waiting.</div>
          ) : (
            acceptedArticles.map(article => (
              <div key={article.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-grab hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{article.id}</span>
                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug">{article.title}</h4>
                <p className="text-xs text-slate-500">{article.category || 'Research Article'}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: Issue Composer */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col">
        <div className="flex flex-col md:flex-row items-start justify-between border-b border-slate-100 pb-6 mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <Book className="w-7 h-7 text-indigo-500" />
              Volume 15, Issue 2 (Upcoming)
            </h2>
            <p className="text-slate-500 mt-2 text-sm">Drag and drop accepted articles here to build the next issue.</p>
          </div>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full md:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" /> {isPublishing ? 'Publishing...' : 'Publish Issue'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer group">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5 text-indigo-500" />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">Upload Generic (Jenerik)</h4>
            <p className="text-xs text-slate-500 mt-1">PDF file containing editorial board etc.</p>
          </div>
          
          <div className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer group">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5 text-indigo-500" />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">Upload Cover Image</h4>
            <p className="text-xs text-slate-500 mt-1">High-res JPG or PNG</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Table of Contents</h3>
          <div className="flex-1 min-h-[200px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center flex-col text-slate-400">
            <Plus className="w-8 h-8 mb-2 opacity-50" />
            <p className="font-medium text-sm">Drag articles here to add them to this issue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
