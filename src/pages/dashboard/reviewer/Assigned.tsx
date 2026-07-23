import { useMemo } from 'react';
import { Calendar, ChevronRight, AlertTriangle, CheckSquare, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { CardSkeleton } from '../../../components/skeletons/CardSkeleton';
import { applyBlindingFilter } from '../../../utils/blindingFilter';
import type { DeepOmitBlinded } from '../../../utils/blindingFilter';
import { parseTitle } from '../../../utils/parseTitle';

interface AssignedManuscript {
  id: string;
  title: string;
  deadline: string;
  status: string;
}

export default function Assigned() {
  const { locale } = useLocaleStore();

  const { data: assignedQueue, isLoading, error, refetch } = useApiQuery<
    AssignedManuscript[],
    DeepOmitBlinded<AssignedManuscript[]>
  >({
    url: '/api/reviewer/assigned',
    transform: applyBlindingFilter,
  });

  const formatDeadline = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const queue = useMemo(() => {
    const apiList = Array.isArray(assignedQueue) 
      ? assignedQueue 
      : Array.isArray((assignedQueue as any)?.data) 
        ? (assignedQueue as any).data 
        : [];

    let localAccepted: AssignedManuscript[] = [];
    let hiddenIds: string[] = [];
    try {
      localAccepted = JSON.parse(localStorage.getItem('accepted_reviews') || '[]');
      hiddenIds = JSON.parse(localStorage.getItem('completed_reviews_hidden') || '[]');
    } catch {}

    const combined = [...localAccepted, ...apiList];
    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
    return unique.filter(item => !hiddenIds.includes(item.id));
  }, [assignedQueue]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800">
          {locale === 'tr' ? 'Atanan İncelemeler' : 'Assigned Queue'}
        </h2>
        <p className="text-slate-500">
          {locale === 'tr'
            ? 'Akran değerlendirmenizi bekleyen makaleler.'
            : 'Manuscripts awaiting your peer review.'}
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <CardSkeleton count={3} />
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed text-rose-500 flex flex-col items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
            <h3 className="text-lg font-bold text-slate-800">
              {locale === 'tr' ? 'Veri Yüklenemedi' : 'Failed to Load Reviews'}
            </h3>
            <p className="text-sm text-slate-500 max-w-md">
              {error.message ||
                (locale === 'tr'
                  ? 'Değerlendirme listesi alınırken bir hata oluştu.'
                  : 'An error occurred while fetching the assigned reviews.')}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl font-bold shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-colors"
            >
              {locale === 'tr' ? 'Yeniden Dene' : 'Retry'}
            </button>
          </div>
        ) : queue.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">
              {locale === 'tr' ? 'Atama Yok' : 'No Assignments'}
            </h3>
            <p className="text-slate-500">
              {locale === 'tr'
                ? 'Şu anda incelemeniz için atanmış bir makale bulunmamaktadır.'
                : 'You currently have no manuscripts assigned for review.'}
            </p>
          </div>
        ) : (
          queue.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex-1">
                <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded mb-2 inline-block">
                  {item.id}
                </span>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                  {parseTitle(item.title).title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <div
                    className="flex items-center text-sm font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md"
                    role="status"
                    aria-label={
                      locale === 'tr'
                        ? `Son teslim tarihi: ${formatDeadline(item.deadline)}`
                        : `Deadline: ${formatDeadline(item.deadline)}`
                    }
                  >
                    <Calendar className="w-4 h-4 mr-1.5" aria-hidden="true" />
                    <span>
                      {locale === 'tr' ? 'Son Teslim:' : 'Due:'}{' '}
                      {formatDeadline(item.deadline)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-500 flex items-center">
                    <CheckSquare className="w-4 h-4 mr-1.5" />
                    {item.status ||
                      (locale === 'tr' ? 'Değerlendirme Bekliyor' : 'Pending Evaluation')}
                  </div>
                  {/* Double-Blind badge */}
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <Shield className="w-3.5 h-3.5" />
                    {locale === 'tr' ? 'Yazar Gizli' : 'Author Hidden'}
                  </div>
                </div>
              </div>

              <Link
                to={`/dashboard/reviewer/evaluate/${item.id}`}
                className="w-full md:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/20"
              >
                {locale === 'tr' ? 'Değerlendirmeye Başla' : 'Start Evaluation'}{' '}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
