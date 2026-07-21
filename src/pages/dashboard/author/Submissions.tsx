import { useEffect } from 'react';
import { FileText, Clock, AlertCircle, ArrowRight, AlertTriangle, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';
export interface Submission {
  id: string;
  title: string;
  status: 'PENDING_PRE_CHECK' | 'UNDER_REVIEW' | 'REVISION_REQUIRED' | 'IN_COPYEDITING' | 'READY_FOR_PRODUCTION' | 'PUBLISHED' | 'WITHDRAWN';
  created_at: string;
  date?: string;
}

export default function Submissions() {
  const { t, locale } = useLocaleStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: submissionsData, isLoading, error, refetch } = useApiQuery<any>({
    url: '/api/author/submissions'
  });

  const submissions = submissionsData?.data || [];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'IN_REVIEW':
      case 'UNDER_REVIEW':
        return { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: <Clock className="w-4 h-4" />, text: locale === 'tr' ? 'Değerlendirmede' : 'Under Review' };
      case 'REVISION_REQUIRED':
        return { color: 'text-rose-600 bg-rose-50 border-rose-200', icon: <AlertCircle className="w-4 h-4" />, text: locale === 'tr' ? 'Revizyon Gerekli' : 'Revision Required' };
      case 'PENDING_PRE_CHECK':
        return { color: 'text-sky-600 bg-sky-50 border-sky-200', icon: <FileText className="w-4 h-4" />, text: locale === 'tr' ? 'Ön Kontrol' : 'Pre-Check' };
      case 'ACCEPTED':
        return { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <CheckCircle2 className="w-4 h-4" />, text: locale === 'tr' ? 'Kabul Edildi' : 'Accepted' };
      case 'IN_COPYEDITING':
        return { color: 'text-purple-600 bg-purple-50 border-purple-200', icon: <FileText className="w-4 h-4" />, text: locale === 'tr' ? 'Kopya Düzenlemede' : 'In Copyediting' };
      case 'READY_FOR_PRODUCTION':
        return { color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: <CheckCircle2 className="w-4 h-4" />, text: locale === 'tr' ? 'Yayına Hazır' : 'Ready for Production' };
      case 'PUBLISHED':
        return { color: 'text-emerald-700 bg-emerald-50 border-emerald-300', icon: <CheckCircle2 className="w-4 h-4" />, text: locale === 'tr' ? 'Yayınlandı' : 'Published' };
      case 'WITHDRAWN':
        return { color: 'text-slate-500 bg-slate-50 border-slate-200', icon: <AlertCircle className="w-4 h-4" />, text: locale === 'tr' ? 'Geri Çekildi' : 'Withdrawn' };
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
          {isLoading ? (
            <div className="p-8">
              <TableSkeleton rows={5} cols={4} />
            </div>
          ) : error ? (
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800">{locale === 'tr' ? 'Bir Hata Oluştu' : 'An Error Occurred'}</h3>
                <p className="text-sm text-slate-500 max-w-md">
                  {error.message || (locale === 'tr' ? 'Makaleler yüklenirken hata oluştu.' : 'Failed to load submissions.')}
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-600 rounded-xl font-bold text-sm transition-all border border-indigo-100 flex items-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-95"
              >
                <RefreshCcw className="w-4 h-4" />
                {locale === 'tr' ? 'Yeniden Dene' : 'Retry'}
              </button>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center text-slate-400">{t('dashboard.noData')}</div>
          ) : (
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
                {submissions.map((sub: Submission) => {
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
                        {sub.date || (sub.created_at ? new Date(sub.created_at).toLocaleDateString() : new Date().toLocaleDateString())}
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
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
