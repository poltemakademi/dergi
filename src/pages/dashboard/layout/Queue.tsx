import { Clock, AlertCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';
import { parseTitle } from '../../../utils/parseTitle';

interface QueueItem {
  id: string;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  date: string;
}

export default function Queue() {
  const { locale } = useLocaleStore();
  const { data, isLoading, error, refetch } = useApiQuery<QueueItem[]>({
    url: '/api/layout/queue',
  });

  const productionQueue = data || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            {locale === 'tr' ? 'Üretim Hattı' : 'Production Line'}
          </h2>
          <p className="text-slate-500">
            {locale === 'tr'
              ? 'Şu anda dizgi ve dil düzenleme aşamasındaki makaleler.'
              : 'Manuscripts currently in typesetting and language editing.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden z-10" />

        <div className="overflow-x-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-8">
              <TableSkeleton rows={5} cols={4} />
            </div>
          ) : error ? (
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800">
                  {locale === 'tr' ? 'Bir Hata Oluştu' : 'An Error Occurred'}
                </h3>
                <p className="text-sm text-slate-500 max-w-md">
                  {error.message ||
                    (locale === 'tr'
                      ? 'Üretim hattı yüklenirken hata oluştu.'
                      : 'Failed to load production queue.')}
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-all shadow-md"
              >
                {locale === 'tr' ? 'Yeniden Dene' : 'Retry'}
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold border-b border-slate-100">
                    {locale === 'tr' ? 'Makale ID' : 'Manuscript ID'}
                  </th>
                  <th className="p-4 font-bold border-b border-slate-100">
                    {locale === 'tr' ? 'Başlık' : 'Title'}
                  </th>
                  <th className="p-4 font-bold border-b border-slate-100">
                    {locale === 'tr' ? 'Öncelik' : 'Priority'}
                  </th>
                  <th className="p-4 font-bold border-b border-slate-100">
                    {locale === 'tr' ? 'Üretime Giriş' : 'Entered Prod.'}
                  </th>
                  <th className="p-4 font-bold border-b border-slate-100 text-right">
                    {locale === 'tr' ? 'İşlemler' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productionQueue.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      {locale === 'tr'
                        ? 'Üretim hattında makale yok.'
                        : 'No manuscripts in production line.'}
                    </td>
                  </tr>
                ) : (
                  productionQueue.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          {item.id}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p
                          className="font-bold text-slate-800 line-clamp-1"
                          title={parseTitle(item.title).title}
                        >
                          {parseTitle(item.title).title}
                        </p>
                      </td>
                      <td className="p-4">
                        {item.priority === 'HIGH' ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded w-fit">
                            <AlertCircle className="w-3 h-3" />{' '}
                            {locale === 'tr' ? 'Acil' : 'Urgent'}
                          </span>
                        ) : item.priority === 'MEDIUM' ? (
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit">
                            {locale === 'tr' ? 'Orta' : 'Medium'}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">
                            {locale === 'tr' ? 'Düşük' : 'Low'}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-slate-500 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />{' '}
                        {item.date || new Date().toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/dashboard/layout/proofs/${item.id}`}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-all shadow-md"
                        >
                          {locale === 'tr' ? 'İşle' : 'Process'}{' '}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
