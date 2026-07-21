import { History as HistoryIcon, Download, CheckCircle, Search, Award } from 'lucide-react';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';
import { toast } from 'sonner';

export default function History() {
  const { locale } = useLocaleStore();

  const { data: historyData, isLoading, error, refetch } = useApiQuery<any>({
    url: '/api/reviewer/history'
  });

  const reviews = historyData?.data || historyData || [
    {
      id: 'REV-2025-102',
      title: 'Deep Reinforcement Learning for Autonomous Drone Navigation in GPS-Denied Environments',
      completedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      recommendation: 'accept'
    },
    {
      id: 'REV-2025-088',
      title: 'Evaluating the Security Posture of Next-Generation IoT Devices via Fuzzing',
      completedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
      recommendation: 'revision'
    }
  ];

  const handleDownloadCertificate = (_id: string) => {
    toast.info(locale === 'tr' ? 'Sertifika oluşturma özelliği V2\'de sunulacaktır.' : 'Certificate generation will be available in V2.', {
      icon: <Award className="w-4 h-4 text-indigo-500" />
    });
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'accept':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold uppercase tracking-wide">Accept</span>;
      case 'revision':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold uppercase tracking-wide">Revision</span>;
      case 'reject':
        return <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-md text-xs font-bold uppercase tracking-wide">Reject</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold uppercase tracking-wide">{rec}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <HistoryIcon className="w-6 h-6 text-indigo-600" />
          {locale === 'tr' ? 'Değerlendirme Geçmişi' : 'Review History'}
        </h2>
        <p className="text-slate-500">
          {locale === 'tr' 
            ? 'Tamamladığınız makale değerlendirmeleri ve akademik katkı sertifikalarınız.' 
            : 'Your completed peer reviews and academic contribution certificates.'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={locale === 'tr' ? 'Geçmişte ara...' : 'Search history...'} 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-64 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-8">
              <TableSkeleton rows={4} cols={4} />
            </div>
          ) : error && !historyData ? (
             <div className="p-8 text-center text-rose-500">
               <p className="font-bold mb-2">Error loading history</p>
               <button onClick={() => refetch()} className="text-sm underline">Try again</button>
             </div>
          ) : reviews.length === 0 ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3">
              <HistoryIcon className="w-10 h-10 text-slate-300" />
              <p>{locale === 'tr' ? 'Henüz tamamlanmış bir değerlendirmeniz yok.' : 'You have no completed reviews yet.'}</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-widest text-slate-500">
                  <th className="p-4 font-bold rounded-tl-2xl">ID</th>
                  <th className="p-4 font-bold">{locale === 'tr' ? 'Makale Başlığı' : 'Article Title'}</th>
                  <th className="p-4 font-bold">{locale === 'tr' ? 'Kararınız' : 'Your Decision'}</th>
                  <th className="p-4 font-bold">{locale === 'tr' ? 'Tarih' : 'Date'}</th>
                  <th className="p-4 font-bold text-right rounded-tr-2xl">{locale === 'tr' ? 'Sertifika' : 'Certificate'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <span className="font-mono text-sm font-bold text-slate-500">{review.id}</span>
                    </td>
                    <td className="p-4 font-bold text-slate-800 max-w-[350px] truncate" title={review.title}>
                      {review.title}
                    </td>
                    <td className="p-4">
                      {getRecommendationBadge(review.recommendation)}
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {new Date(review.completedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDownloadCertificate(review.id)}
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-all border border-indigo-100 hover:border-indigo-600 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {locale === 'tr' ? 'Sertifika' : 'Certificate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
