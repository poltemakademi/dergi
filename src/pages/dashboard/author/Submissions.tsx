import { useState, useEffect } from 'react';
import { FileText, Clock, AlertCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../services/api/client';
import { useLocaleStore } from '../../../store/useLocaleStore';

export default function Submissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, locale } = useLocaleStore();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await apiClient.get('/api/author/submissions');
        setSubmissions(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch submissions:', err);
        setError(t('dashboard.error'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, [t]);

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'IN_REVIEW': 
        return { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: <Clock className="w-4 h-4" />, text: t('stat.inReview') };
      case 'REVISION_REQUIRED': 
        return { color: 'text-rose-600 bg-rose-50 border-rose-200', icon: <AlertCircle className="w-4 h-4" />, text: locale === 'tr' ? 'Revizyon' : 'Revision' };
      case 'PENDING_PRE_CHECK':
        return { color: 'text-sky-600 bg-sky-50 border-sky-200', icon: <FileText className="w-4 h-4" />, text: locale === 'tr' ? 'Ön Kontrol' : 'Pre-Check' };
      case 'ACCEPTED':
        return { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <FileText className="w-4 h-4" />, text: locale === 'tr' ? 'Kabul Edildi' : 'Accepted' };
      default: 
        return { color: 'text-slate-600 bg-slate-50 border-slate-200', icon: <FileText className="w-4 h-4" />, text: status || 'Unknown' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800">{t('sub.mySubmissions')}</h2>
          <p className="text-slate-500">{locale === 'tr' ? 'Aktif makalelerinizin durumunu takip edin.' : 'Track the status of your active manuscripts.'}</p>
        </div>
        <Link to="/dashboard/yazar/submit-wizard" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all">
          {t('sub.new')}
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        {/* Right-aligned fade gradient for mobile horizontal scrolling indication */}
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden z-10" />
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-widest text-slate-500">
                <th className="p-4 font-bold rounded-tl-2xl">ID</th>
                <th className="p-4 font-bold">{locale === 'tr' ? 'Başlık' : 'Title'}</th>
                <th className="p-4 font-bold">{locale === 'tr' ? 'Tarih' : 'Date'}</th>
                <th className="p-4 font-bold">{locale === 'tr' ? 'Durum' : 'Status'}</th>
                <th className="p-4 font-bold text-right rounded-tr-2xl">{locale === 'tr' ? 'İşlem' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">{t('dashboard.loading')}</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-rose-500 flex items-center justify-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> {error}
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">{t('dashboard.noData')}</td>
                </tr>
              ) : (
                submissions.map((sub: any) => {
                  const status = getStatusInfo(sub.status);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4">
                        <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{sub.id}</span>
                      </td>
                      <td className="p-4 font-bold text-slate-800 max-w-[300px] truncate" title={sub.title}>
                        {sub.title}
                      </td>
                      <td className="p-4 text-sm text-slate-500 font-medium">
                        {sub.date || new Date().toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-bold ${status.color}`}>
                          {status.icon} {status.text}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Link to={`/dashboard/yazar/track/${sub.id}`} className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group-hover:shadow-sm border border-transparent hover:border-indigo-100" title={t('sub.track')}>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
