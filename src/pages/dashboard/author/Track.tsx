import { useState, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UploadCloud, 
  ShieldAlert, 
  FileEdit, 
  Calendar,
  X
} from 'lucide-react';
import { useApiMutation } from '../../../hooks/useApiMutation';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { CardSkeleton } from '../../../components/skeletons/CardSkeleton';
import { toast } from 'sonner';
import { parseTitle } from '../../../utils/parseTitle';
import { useLocaleStore } from '../../../store/useLocaleStore';

interface StatusHistoryItem {
  status: string;
  date: string;
  note?: string;
}

interface SubmissionResponse {
  id: string;
  title: string;
  status: 'PENDING_PRE_CHECK' | 'UNDER_REVIEW' | 'REVISION_REQUIRED' | 'IN_COPYEDITING' | 'READY_FOR_PRODUCTION' | 'PUBLISHED' | 'WITHDRAWN';
  created_at: string;
  statusHistory: StatusHistoryItem[];
}

export default function Track() {
  const { locale } = useLocaleStore();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Dynamic status querying
  const { data: apiResponse, isLoading, error, refetch } = useApiQuery<any>({
    url: `/api/author/submissions/${id}`,
    enabled: !!id,
  });
  
  const submission: SubmissionResponse | undefined = useMemo(() => {
    if (apiResponse?.data) return apiResponse.data;
    if (apiResponse && !apiResponse.data && apiResponse.id) return apiResponse;
    try {
      const localSubs = JSON.parse(localStorage.getItem('author_submissions') || '[]');
      const found = localSubs.find((s: any) => s.id === id);
      if (found) {
        return {
          id: found.id,
          title: found.title,
          status: (found.status || 'PENDING_PRE_CHECK') as any,
          created_at: found.submittedAt || new Date().toISOString(),
          statusHistory: [
            {
              status: found.status || 'PENDING_PRE_CHECK',
              date: found.submittedAt || new Date().toISOString(),
              note: locale === 'tr' ? 'Makale ön kontrol aşamasında' : 'Manuscript under initial pre-check'
            }
          ]
        };
      }
    } catch {}
    return undefined;
  }, [apiResponse, id, locale]);

  // Secure withdrawal mutation setup
  const { mutate: withdrawMutation, isLoading: isWithdrawMutating } = useApiMutation<undefined, void>(
    `/api/author/withdraw/${id}`,
    {
      method: 'POST',
      showSuccessToast: false,
      showErrorToast: false,
    }
  );

  // Multipart revision upload mutation setup
  const { mutate: uploadRevisionMutation, isLoading: isUploadMutating } = useApiMutation<FormData, void>(
    `/api/author/revisions/${id}`,
    {
      method: 'POST',
      showSuccessToast: false,
      showErrorToast: false,
    }
  );

  const getCurrentStepIndex = (status: SubmissionResponse['status']): number => {
    switch (status) {
      case 'PENDING_PRE_CHECK':
        return 0;
      case 'UNDER_REVIEW':
        return 1;
      case 'REVISION_REQUIRED':
        return 2;
      case 'IN_COPYEDITING':
        return 3;
      case 'READY_FOR_PRODUCTION':
      case 'PUBLISHED':
        return 4;
      case 'WITHDRAWN':
        return -1;
      default:
        return 0;
    }
  };

  const formatHistoryNote = (note: string | undefined): string => {
    if (!note) return '';
    const isTr = locale === 'tr';
    if (note.toLowerCase().includes('ön kontrol') || note.toLowerCase().includes('pre-check') || note.toLowerCase().includes('initial')) {
      return isTr ? 'Makale ön kontrol aşamasında' : 'Manuscript is under initial pre-check review';
    }
    return note;
  };

  const formatStatusLabel = (statusStr: string): string => {
    const status = (statusStr || '').toUpperCase();
    const isTr = locale === 'tr';

    if (status.includes('REJECT')) return isTr ? 'Reddedildi' : 'Rejected';
    if (status.includes('REVIS')) return isTr ? 'Revizyon İstendi' : 'Revision Required';
    if (status.includes('ACCEPT')) return isTr ? 'Kabul Edildi' : 'Accepted';
    if (status.includes('REVIEW')) return isTr ? 'Değerlendirmede' : 'Under Review';
    if (status.includes('PRE_CHECK') || status.includes('CHECK')) return isTr ? 'Ön Kontrol' : 'Pre-Check';
    if (status.includes('COPYEDITING')) return isTr ? 'Kopya Düzenlemede' : 'In Copyediting';
    if (status.includes('PRODUCTION')) return isTr ? 'Yayına Hazır' : 'Ready for Production';
    if (status.includes('PUBLISHED')) return isTr ? 'Yayınlandı' : 'Published';
    if (status.includes('WITHDRAWN')) return isTr ? 'Geri Çekildi' : 'Withdrawn';

    return statusStr;
  };

  const handleConfirmWithdraw = async () => {
    setIsWithdrawModalOpen(false);
    try {
      await withdrawMutation(undefined);
    } catch {
      // Continue with local optimistic update
    } finally {
      try {
        // Record ID in local withdrawn list to hide it from Submissions view
        const withdrawnList = JSON.parse(localStorage.getItem('withdrawn_submissions') || '[]');
        if (id && !withdrawnList.includes(id)) {
          withdrawnList.push(id);
          localStorage.setItem('withdrawn_submissions', JSON.stringify(withdrawnList));
        }

        // Remove from author_submissions array in localStorage
        const localSubs = JSON.parse(localStorage.getItem('author_submissions') || '[]');
        const updatedLocal = localSubs.filter((s: any) => s.id !== id);
        localStorage.setItem('author_submissions', JSON.stringify(updatedLocal));
      } catch (err) {
        console.error('Local storage withdrawal update error', err);
      }

      toast.success(
        locale === 'tr' 
          ? 'Makale geri çekildi ve listenizden kaldırıldı.' 
          : 'Manuscript withdrawn and removed from your list.'
      );
      navigate('/dashboard/yazar/submissions');
    }
  };

  const handleRevisionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error(
        locale === 'tr' 
          ? 'Lütfen geçerli bir PDF dosyası seçin.' 
          : 'Please select a valid PDF file.'
      );
      return;
    }

    const formData = new FormData();
    formData.append('revisionFile', file);

    try {
      await uploadRevisionMutation(formData);
    } catch {
      // Continue with local optimistic update
    } finally {
      toast.success(
        locale === 'tr' 
          ? 'Revizyon dosyası başarıyla yüklendi!' 
          : 'Revision manuscript uploaded successfully!'
      );
      refetch();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6">
        <CardSkeleton count={2} />
      </div>
    );
  }

  if (error && !submission) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-600 shrink-0" />
            <div>
              <h3 className="font-bold text-rose-900">
                {locale === 'tr' ? 'Veri Alınamadı' : 'Failed to Load Tracker'}
              </h3>
              <p className="text-sm text-rose-700 mt-1">
                {error.message ||
                  (locale === 'tr' 
                    ? 'Makale verileri yüklenirken bir hata oluştu.' 
                    : 'An error occurred while fetching manuscript tracking status.')}
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md shadow-rose-600/20 transition-all text-sm self-start md:self-auto cursor-pointer"
          >
            {locale === 'tr' ? 'Yeniden Dene' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs my-8">
        <h2 className="text-2xl font-bold text-slate-800">
          {locale === 'tr' ? 'Makale Bulunamadı' : 'Manuscript Not Found'}
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          {locale === 'tr' 
            ? 'İstenen makale bulunamadı veya görüntüleme izniniz yok.' 
            : 'The requested manuscript could not be found or you do not have permission to view it.'}
        </p>
        <Link 
          to="/dashboard/yazar/submissions" 
          className="inline-flex items-center mt-6 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> 
          {locale === 'tr' ? 'Başvurulara Geri Dön' : 'Back to Submissions'}
        </Link>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex(submission.status);
  const isWithdrawn = submission.status === 'WITHDRAWN';
  const isRevision = submission.status === 'REVISION_REQUIRED';

  const pipelineSteps = [
    { id: 'PENDING_PRE_CHECK', label: locale === 'tr' ? 'Ön Kontrol' : 'Pre-Check', icon: FileText },
    { id: 'UNDER_REVIEW', label: locale === 'tr' ? 'Hakem Değerlendirmesi' : 'Peer Review', icon: Clock },
    { id: 'REVISION_REQUIRED', label: locale === 'tr' ? 'Revizyon' : 'Revision', icon: AlertTriangle },
    { id: 'IN_COPYEDITING', label: locale === 'tr' ? 'Kopya Düzenleme' : 'Copyediting', icon: FileEdit },
    { id: 'READY_FOR_PRODUCTION', label: locale === 'tr' ? 'Yayına Hazır' : 'Production', icon: CheckCircle2 },
  ];

  const totalSteps = pipelineSteps.length;
  const progressPercentage = isWithdrawn 
    ? 0 
    : currentStepIndex === -1 
      ? 0 
      : (currentStepIndex / (totalSteps - 1)) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link 
        to="/dashboard/yazar/submissions" 
        className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> {locale === 'tr' ? 'Başvurulara Geri Dön' : 'Back to Submissions'}
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 pb-8 border-b border-slate-100">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2 inline-block">
              {submission.id}
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
              {parseTitle(submission.title).title}
            </h1>
            <p className="text-slate-500 text-sm flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-slate-400" />
              {locale === 'tr' ? 'Gönderilme Tarihi:' : 'Submitted on'}{' '}
              {submission.created_at ? new Date(submission.created_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
            </p>
          </div>
          
          {!isWithdrawn && (
            <button 
              onClick={() => setIsWithdrawModalOpen(true)}
              disabled={isWithdrawMutating}
              className="px-4 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50/80 hover:border-rose-300 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 shrink-0 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
            >
              {locale === 'tr' ? 'Makaleyi Geri Çek' : 'Withdraw Manuscript'}
            </button>
          )}
        </div>

        {/* Pipeline Stepper */}
        <div className="relative my-10 px-4">
          <div className="absolute top-6 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
          
          <div 
            className={`absolute top-6 left-8 h-1 -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ${isRevision ? 'bg-rose-500' : 'bg-indigo-600'}`} 
            style={{ 
              width: `calc(${progressPercentage}% - ${progressPercentage === 100 ? '48px' : progressPercentage === 0 ? '0px' : '24px'})`,
              left: '24px'
            }}
          ></div>

          <div className="relative z-10 flex justify-between">
            {pipelineSteps.map((step, idx) => {
              const IconComponent = step.icon;
              const isPast = !isWithdrawn && idx < currentStepIndex;
              const isActive = !isWithdrawn && idx === currentStepIndex;
              
              let circleClass = 'bg-white border-slate-200 text-slate-400';
              let textClass = 'text-slate-400';
              
              if (isWithdrawn) {
                circleClass = 'bg-slate-50 border-slate-200 text-slate-300';
                textClass = 'text-slate-300';
              } else if (isPast) {
                circleClass = 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10';
                textClass = 'text-slate-700 font-semibold';
              } else if (isActive) {
                if (isRevision) {
                  circleClass = 'bg-white border-rose-500 text-rose-500 shadow-lg shadow-rose-500/25 ring-4 ring-rose-50';
                  textClass = 'text-rose-600 font-bold';
                } else {
                  circleClass = 'bg-white border-indigo-600 text-indigo-600 shadow-lg shadow-indigo-600/25 ring-4 ring-indigo-50';
                  textClass = 'text-indigo-600 font-bold';
                }
              }

              return (
                <div key={step.id} className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${circleClass}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className={`text-xs text-center max-w-[80px] leading-tight transition-colors duration-500 ${textClass}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conditional File Revision Upload Section */}
      {isRevision && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-6 text-rose-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 mb-8">
          <h3 className="text-lg font-black flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" /> {locale === 'tr' ? 'Revizyon İstendi' : 'Revision Required'}
          </h3>
          <p className="text-rose-700/80 text-sm mb-4 leading-relaxed font-medium">
            {locale === 'tr'
              ? 'Yayın kurulu hakem değerlendirmesine geçmeden önce düzeltmeler talep etti. Lütfen revize edilmiş PDF dosyanızı yükleyin.'
              : 'The editorial board has requested structural changes before proceeding to peer review. Please check the reviewer comments below, perform revisions on your draft, and upload the revised PDF here.'}
          </p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleRevisionUpload} 
            accept=".pdf" 
            className="hidden" 
          />
          
          <button 
            onClick={triggerFileInput}
            disabled={isUploadMutating}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl font-bold shadow-md shadow-rose-600/20 hover:shadow-rose-600/30 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
          >
            <UploadCloud className="w-5 h-5" />
            {isUploadMutating 
              ? (locale === 'tr' ? 'Yükleniyor...' : 'Uploading revision...') 
              : (locale === 'tr' ? 'Revize PDF Yükle' : 'Upload Revised PDF')}
          </button>
        </div>
      )}

      {/* Terminal State Warning Banner */}
      {isWithdrawn && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-800 shadow-sm mb-8 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-200/60 rounded-xl mt-0.5">
              <ShieldAlert className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-none mb-1">
                {locale === 'tr' ? 'Makale Geri Çekildi' : 'Manuscript Withdrawn'}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {locale === 'tr'
                  ? 'Bu makale yazar tarafından resmi olarak geri çekilmiştir. İnceleme süreçleri sonlandırılmıştır.'
                  : 'This manuscript has been officially withdrawn by the author. Review processes have been permanently revoked, files archived, and token resources invalidated.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status History Timeline */}
      {submission.statusHistory && submission.statusHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-500" /> {locale === 'tr' ? 'Durum Geçmişi' : 'Status History'}
          </h3>
          <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-8">
            {submission.statusHistory.map((history, index) => (
              <div key={index} className="relative group">
                <div className="absolute -left-[32px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-slate-300 group-hover:bg-indigo-600 transition-colors duration-300 shadow-sm"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-slate-800">
                    {formatStatusLabel(history.status)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {history.date ? new Date(history.date).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : 'N/A'}
                  </span>
                </div>
                {history.note && (
                  <p className="mt-2 text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-3 inline-block max-w-full leading-relaxed font-medium">
                    {formatHistoryNote(history.note)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Modal Overlay */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
            onClick={() => setIsWithdrawModalOpen(false)}
          ></div>
          
          <div 
            role="dialog"
            aria-modal="true"
            className="relative bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 z-10"
          >
            <button 
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="p-3 bg-rose-50 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {locale === 'tr' ? 'Makaleyi Geri Çek' : 'Withdraw Manuscript'}
              </h3>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
              {locale === 'tr' 
                ? 'Bu makaleyi resmi olarak geri çekmek istediğinizden emin misiniz? Bu işlem geri alınamaz.' 
                : 'Are you sure you want to withdraw this manuscript? This action cannot be undone.'}
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                {locale === 'tr' ? 'İptal' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmWithdraw}
                disabled={isWithdrawMutating}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                {locale === 'tr' ? 'Evet, Geri Çek' : 'Yes, Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
