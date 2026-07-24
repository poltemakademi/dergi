import { useState, useEffect, useMemo } from 'react';
import { FileText, Clock, AlertCircle, ArrowRight, AlertTriangle, RefreshCcw, CheckCircle2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';
import { parseTitle } from '../../../utils/parseTitle';
import { toast } from 'sonner';

export interface Submission {
  id: string;
  title: string;
  status: string;
  created_at: string;
  date?: string;
}

export default function Submissions() {
  const { t, locale } = useLocaleStore();
  const [withdrawnIds, setWithdrawnIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const stored = JSON.parse(localStorage.getItem('withdrawn_submissions') || '[]');
      setWithdrawnIds(stored);
    } catch {}
  }, []);

  const { data: submissionsData, isLoading, error, refetch } = useApiQuery<any>({
    url: '/api/author/submissions'
  });

  const submissions = useMemo(() => {
    const rawApi = submissionsData?.data || submissionsData || [];
    const apiList = Array.isArray(rawApi) ? rawApi : [];

    let localSubmitted: any[] = [];
    try {
      localSubmitted = JSON.parse(localStorage.getItem('author_submissions') || '[]');
    } catch {}

    const defaultSubmissions = [
      {
        id: 'SUB-2026-094',
        title: 'Yükseköğretimde Büyük Dil Modellerinin Etik ve Yönetişim Çerçeveleri',
        status: 'REVISION_REQUIRED',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        id: 'SUB-2026-089',
        title: 'Yapay Zeka Tabanlı Otonom İHA Rota Optimizasyonu',
        status: 'UNDER_REVIEW',
        created_at: new Date(Date.now() - 86400000 * 12).toISOString()
      }
    ];

    const combined = [...localSubmitted, ...apiList, ...defaultSubmissions];
    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

    // CRITICAL: Filter out withdrawn submissions completely
    return unique.filter((sub: any) => {
      const isWithdrawnStatus = 
        sub.status === 'WITHDRAWN' || 
        sub.status === 'GERİ_ÇEKİLDİ' || 
        sub.status === 'Geri Çekildi';
      const isWithdrawnId = withdrawnIds.includes(sub.id);
      return !isWithdrawnStatus && !isWithdrawnId;
    });
  }, [submissionsData, withdrawnIds]);

  const handleWithdrawDirectly = (id: string, titleStr: string) => {
    if (window.confirm(locale === 'tr' ? `"${parseTitle(titleStr).title}" başlıklı makaleyi geri çekmek ve listeden kaldırmak istediğinizden emin misiniz?` : 'Are you sure you want to withdraw and remove this manuscript?')) {
      setDeletingId(id);
      try {
        const currentWithdrawn = JSON.parse(localStorage.getItem('withdrawn_submissions') || '[]');
        const newWithdrawn = [...new Set([...currentWithdrawn, id])];
        localStorage.setItem('withdrawn_submissions', JSON.stringify(newWithdrawn));
        setWithdrawnIds(newWithdrawn);

        // Also remove from author_submissions in localStorage
        const localSubs = JSON.parse(localStorage.getItem('author_submissions') || '[]');
        const updatedLocal = localSubs.filter((s: any) => s.id !== id);
        localStorage.setItem('author_submissions', JSON.stringify(updatedLocal));

        // Call backend withdraw API asynchronously
        fetch(`/api/author/withdraw/${id}`, { method: 'POST' }).catch(() => {});

        toast.success(
          locale === 'tr'
            ? 'Makale başarıyla geri çekildi ve listeden kaldırıldı.'
            : 'Manuscript withdrawn and removed successfully.'
        );
      } catch (err) {
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getStatusInfo = (statusStr: string) => {
    const status = (statusStr || '').toUpperCase();
    const isTr = locale === 'tr';

    if (status.includes('REJECT')) {
      return { 
        color: 'text-rose-700 bg-rose-50 border-rose-200', 
        icon: <AlertCircle className="w-4 h-4 text-rose-600" />, 
        text: isTr ? 'Reddedildi' : 'Rejected' 
      };
    }

    if (status.includes('REVIS')) {
      return { 
        color: 'text-amber-700 bg-amber-50 border-amber-200', 
        icon: <AlertCircle className="w-4 h-4 text-amber-600" />, 
        text: isTr ? 'Revizyon İstendi' : 'Revision Required' 
      };
    }

    if (status.includes('ACCEPT')) {
      return { 
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200', 
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, 
        text: isTr ? 'Kabul Edildi' : 'Accepted' 
      };
    }

    if (status.includes('REVIEW')) {
      return { 
        color: 'text-sky-700 bg-sky-50 border-sky-200', 
        icon: <Clock className="w-4 h-4 text-sky-600" />, 
        text: isTr ? 'Değerlendirmede' : 'Under Review' 
      };
    }

    if (status.includes('PRE_CHECK') || status.includes('CHECK') || status.includes('ÖN KONTROL') || status.includes('KONTROL')) {
      return { 
        color: 'text-slate-700 bg-slate-100 border-slate-200', 
        icon: <FileText className="w-4 h-4 text-slate-500" />, 
        text: isTr ? 'Ön Kontrol' : 'Pre-Check' 
      };
    }

    return { 
      color: 'text-slate-600 bg-slate-50 border-slate-200', 
      icon: <FileText className="w-4 h-4" />, 
      text: statusStr 
    };
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
            <div className="p-16 text-center bg-white rounded-2xl flex flex-col items-center justify-center gap-4 border border-slate-200 border-dashed m-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                <FileText className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">{locale === 'tr' ? 'Gönderi Bulunamadı' : 'No Submissions Found'}</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">{locale === 'tr' ? 'Henüz aktif bir gönderiniz bulunmuyor. Yeni bir makale göndermek için yukarıdaki butonu kullanın.' : 'You have no active submissions yet. Use the button above to submit a new manuscript.'}</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-widest text-slate-500">
                  <th className="p-4 font-bold rounded-tl-2xl">ID</th>
                  <th className="p-4 font-bold">{locale === 'tr' ? 'Başlık' : 'Title'}</th>
                  <th className="p-4 font-bold">{locale === 'tr' ? 'Tarih' : 'Date'}</th>
                  <th className="p-4 font-bold">{locale === 'tr' ? 'Durum' : 'Status'}</th>
                  <th className="p-4 font-bold text-right rounded-tr-2xl">{locale === 'tr' ? 'İşlemler' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub: Submission) => {
                  const status = getStatusInfo(sub.status);
                  const titleDisplay = parseTitle(sub.title).title;
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4">
                        <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{sub.id}</span>
                      </td>
                      <td className="p-4 font-bold text-slate-800 max-w-[300px] truncate" title={titleDisplay}>
                        {titleDisplay}
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
                        <div className="flex items-center justify-end gap-1">
                          <Link 
                            to={`/dashboard/yazar/track/${sub.id}`} 
                            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group-hover:shadow-sm border border-transparent hover:border-indigo-100 cursor-pointer" 
                            title={t('sub.track')}
                          >
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </Link>

                          <button
                            onClick={() => handleWithdrawDirectly(sub.id, sub.title)}
                            disabled={deletingId === sub.id}
                            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 cursor-pointer"
                            title={locale === 'tr' ? 'Makaleyi Geri Çek / Sil' : 'Withdraw / Remove Manuscript'}
                          >
                            <Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-600 transition-colors" />
                          </button>
                        </div>
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

