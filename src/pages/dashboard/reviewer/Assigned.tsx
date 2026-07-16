import { useState, useEffect } from 'react';
import { CheckSquare, Calendar, ChevronRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../services/api/client';
import { useLocaleStore } from '../../../store/useLocaleStore';

export default function Assigned() {
  const [assignedQueue, setAssignedQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, locale } = useLocaleStore();

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const response = await apiClient.get('/api/reviewer/assigned');
        setAssignedQueue(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch assigned manuscripts:', err);
        setError(t('dashboard.error'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssigned();
  }, [t]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800">{locale === 'tr' ? 'Atanan İncelemeler' : 'Assigned Queue'}</h2>
        <p className="text-slate-500">{locale === 'tr' ? 'Akran değerlendirmenizi bekleyen makaleler.' : 'Manuscripts awaiting your peer review.'}</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
             <p className="text-slate-500">{t('dashboard.loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed text-rose-500 flex flex-col items-center gap-2">
            <AlertTriangle className="w-8 h-8 mb-2" />
            <p>{error}</p>
          </div>
        ) : assignedQueue.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">{locale === 'tr' ? 'Atama Yok' : 'No Assignments'}</h3>
            <p className="text-slate-500">{locale === 'tr' ? 'Şu anda incelemeniz için atanmış bir makale bulunmamaktadır.' : 'You currently have no manuscripts assigned for review.'}</p>
          </div>
        ) : (
          assignedQueue.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow group">
              <div className="flex-1">
                <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded mb-2 inline-block">{item.id}</span>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-rose-600 transition-colors">{item.title}</h3>
                
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center text-sm font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                    <Calendar className="w-4 h-4 mr-1.5" /> {locale === 'tr' ? 'Bitiş:' : 'Due:'} {item.deadline || 'N/A'}
                  </div>
                  <div className="text-sm font-medium text-slate-500 flex items-center">
                    <CheckSquare className="w-4 h-4 mr-1.5" /> {item.status || (locale === 'tr' ? 'Değerlendirme Bekliyor' : 'Pending Evaluation')}
                  </div>
                </div>
              </div>
              
              <Link to={`/dashboard/reviewer/evaluate/${item.id}`} className="w-full md:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/20">
                {locale === 'tr' ? 'Değerlendirmeye Başla' : 'Start Evaluation'} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
