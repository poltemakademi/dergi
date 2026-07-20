import { useState, useRef } from 'react';
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
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useApiMutation } from '../../../hooks/useApiMutation';
import { CardSkeleton } from '../../../components/skeletons/CardSkeleton';
import { toast } from 'sonner';

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

const PIPELINE_STEPS = [
  { id: 'PENDING_PRE_CHECK', label: 'Pre-Check', icon: FileText },
  { id: 'UNDER_REVIEW', label: 'Peer Review', icon: Clock },
  { id: 'REVISION_REQUIRED', label: 'Revision', icon: AlertTriangle },
  { id: 'IN_COPYEDITING', label: 'Copyediting', icon: FileEdit },
  { id: 'READY_FOR_PRODUCTION', label: 'Production', icon: CheckCircle2 },
] as const;

export default function Track() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Dynamic status querying
  const { data: submission, isLoading, error, refetch } = useApiQuery<SubmissionResponse>({
    url: `/api/author/submissions/${id}`,
    enabled: !!id,
  });

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

  const formatStatusLabel = (status: string): string => {
    switch (status) {
      case 'PENDING_PRE_CHECK':
        return 'Pre-Check';
      case 'UNDER_REVIEW':
        return 'Under Review';
      case 'REVISION_REQUIRED':
        return 'Revision Required';
      case 'IN_COPYEDITING':
        return 'In Copyediting';
      case 'READY_FOR_PRODUCTION':
        return 'Ready for Production';
      case 'PUBLISHED':
        return 'Published';
      case 'WITHDRAWN':
        return 'Withdrawn';
      default:
        return status.replace(/_/g, ' ');
    }
  };

  const handleConfirmWithdraw = async () => {
    setIsWithdrawModalOpen(false);
    const toastId = toast.loading('Processing withdrawal…');
    try {
      await withdrawMutation();
      toast.dismiss(toastId);
      toast.success('Manuscript withdrawn');
      navigate('/dashboard/yazar/submissions');
    } catch (err: unknown) {
      toast.dismiss(toastId);
      toast.error('Withdrawal failed');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const toastId = toast.loading('Uploading revision...');
    try {
      await uploadRevisionMutation(formData);
      toast.dismiss(toastId);
      toast.success('Revision uploaded');
      await refetch();
    } catch (err: unknown) {
      toast.dismiss(toastId);
      toast.error('Upload failed');
    } finally {
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          to="/dashboard/yazar/submissions" 
          className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Submissions
        </Link>
        <CardSkeleton count={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          to="/dashboard/yazar/submissions" 
          className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Submissions
        </Link>
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-rose-900">Failed to load manuscript details</h3>
              <p className="text-rose-700/90 text-sm mt-1">{error.message || 'An unexpected error occurred while fetching the submission data.'}</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md shadow-rose-600/20 transition-all text-sm self-start md:self-auto"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-700">Manuscript not found</h2>
        <p className="text-slate-500 mt-2">The requested manuscript could not be found or you do not have permission to view it.</p>
        <Link 
          to="/dashboard/yazar/submissions" 
          className="inline-flex items-center mt-6 text-indigo-600 font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Submissions
        </Link>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex(submission.status);
  const totalSteps = PIPELINE_STEPS.length;
  const isWithdrawn = submission.status === 'WITHDRAWN';
  const isRevision = submission.status === 'REVISION_REQUIRED';

  const progressPercentage = isWithdrawn 
    ? 0 
    : currentStepIndex === -1 
      ? 0 
      : (currentStepIndex / (totalSteps - 1)) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link 
        to="/dashboard/yazar/submissions" 
        className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Submissions
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 pb-8 border-b border-slate-100">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2 inline-block">
              {submission.id}
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
              {submission.title}
            </h1>
            <p className="text-slate-500 text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Submitted on {submission.created_at ? new Date(submission.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
            </p>
          </div>
          
          {!isWithdrawn && (
            <button 
              onClick={() => setIsWithdrawModalOpen(true)}
              disabled={isWithdrawMutating}
              className="px-4 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50/80 hover:border-rose-300 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 shrink-0 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              Withdraw Manuscript
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
            {PIPELINE_STEPS.map((step, idx) => {
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
            <AlertTriangle className="w-5 h-5 text-rose-600" /> Revision Required
          </h3>
          <p className="text-rose-700/80 text-sm mb-4 leading-relaxed">
            The editorial board has requested structural changes before proceeding to peer review. Please check the reviewer comments below, perform revisions on your draft, and upload the revised PDF here.
          </p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf" 
            className="hidden" 
          />
          
          <button 
            onClick={triggerFileInput}
            disabled={isUploadMutating}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl font-bold shadow-md shadow-rose-600/20 hover:shadow-rose-600/30 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          >
            <UploadCloud className="w-5 h-5" />
            {isUploadMutating ? 'Uploading revision...' : 'Upload Revised PDF'}
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
              <h3 className="text-lg font-black text-slate-900 leading-none mb-1">Manuscript Withdrawn</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                This manuscript has been officially withdrawn by the author. Review processes have been permanently revoked, files archived, and token resources invalidated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status History Timeline */}
      {submission.statusHistory && submission.statusHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-500" /> Status History
          </h3>
          <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-8">
            {submission.statusHistory.map((history, index) => (
              <div key={index} className="relative group">
                {/* Indicator dot */}
                <div className="absolute -left-[32px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-slate-300 group-hover:bg-indigo-600 transition-colors duration-300 shadow-sm"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-slate-800">
                    {formatStatusLabel(history.status)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {history.date ? new Date(history.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : 'N/A'}
                  </span>
                </div>
                {history.note && (
                  <p className="mt-2 text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-3 inline-block max-w-full leading-relaxed">
                    {history.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Accessibility-Compliant Modal Overlay */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
            onClick={() => setIsWithdrawModalOpen(false)}
          ></div>
          
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 z-10"
          >
            <button 
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="p-3 bg-rose-50 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 id="modal-title" className="text-xl font-bold text-slate-955">
                Withdraw Manuscript
              </h3>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Are you absolutely sure you want to withdraw this manuscript? This action is permanent and cannot be undone.
              <br />
              <span className="block mt-4 p-3.5 bg-rose-50/60 border border-rose-100 rounded-xl text-rose-900 font-medium text-xs leading-relaxed">
                <strong>Warning:</strong> Reviewer evaluations will be permanently revoked, draft file streams archived, and this operational token rendered obsolete.
              </span>
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-xl font-bold transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-600/25 transition-all text-sm"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
