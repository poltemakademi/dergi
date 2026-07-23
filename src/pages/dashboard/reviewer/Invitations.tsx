import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, XCircle, FileText, Calendar, AlertTriangle, ArrowRight, ChevronDown, ChevronUp, Sparkles, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useApiMutation } from '../../../hooks/useApiMutation';
import { CardSkeleton } from '../../../components/skeletons/CardSkeleton';
import { toast } from 'sonner';
import { parseTitle } from '../../../utils/parseTitle';

interface Invitation {
  id: string;
  title: string;
  abstract: string;
  invitedAt: string;
  deadline: string;
}

export default function Invitations() {
  const { locale } = useLocaleStore();

  const { data: invitationsData, isLoading } = useApiQuery<Invitation[]>({
    url: '/api/reviewer/invitations'
  });

  const { mutate: respondMutation, isLoading: isResponding } = useApiMutation<any, void>('/api/reviewer/invitations/respond', {
    method: 'POST',
    showSuccessToast: false,
    showErrorToast: false
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    invitation: Invitation | null;
    accept: boolean;
  }>({
    isOpen: false,
    invitation: null,
    accept: true
  });

  const invitations = useMemo(() => {
    const list = Array.isArray(invitationsData) 
      ? invitationsData 
      : Array.isArray((invitationsData as any)?.data) 
        ? (invitationsData as any).data 
        : [];
    return list.filter((inv: Invitation) => !hiddenIds.includes(inv.id));
  }, [invitationsData, hiddenIds]);

  const promptResponse = (invitation: Invitation, accept: boolean) => {
    setConfirmModal({
      isOpen: true,
      invitation,
      accept
    });
  };

  const executeConfirm = () => {
    if (confirmModal.invitation) {
      handleResponse(confirmModal.invitation, confirmModal.accept);
    }
    setConfirmModal({ isOpen: false, invitation: null, accept: true });
  };

  const handleResponse = async (invitation: Invitation, accept: boolean) => {
    // Hide immediately for instant UI feedback
    setHiddenIds(prev => [...prev, invitation.id]);

    if (accept) {
      try {
        const existing = JSON.parse(localStorage.getItem('accepted_reviews') || '[]');
        const newItem = {
          id: invitation.id,
          title: invitation.title,
          deadline: invitation.deadline,
          status: locale === 'tr' ? 'Değerlendirme Bekliyor' : 'Pending Evaluation'
        };
        if (!existing.some((x: any) => x.id === invitation.id)) {
          localStorage.setItem('accepted_reviews', JSON.stringify([newItem, ...existing]));
        }
      } catch {
        // Ignore storage errors
      }
    }

    // Notify DashboardLayout to update sidebar badge immediately
    window.dispatchEvent(new Event('invitations-updated'));

    toast.success(
      accept 
        ? (locale === 'tr' ? 'Davet kabul edildi! Değerlendirme listenize eklendi.' : 'Invitation accepted! Added to your Review Queue.')
        : (locale === 'tr' ? 'Davet reddedildi.' : 'Invitation declined.')
    );

    // Fire API in background (non-blocking)
    try {
      await respondMutation({ invitationId: invitation.id, accept });
    } catch {
      // UI already updated, ignore API errors silently
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Mail className="w-6 h-6 text-indigo-600" />
              {locale === 'tr' ? 'Değerlendirme Davetleri' : 'Review Invitations'}
            </h2>
            {invitations.length > 0 && (
              <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black rounded-full shadow-sm">
                {invitations.length} {locale === 'tr' ? 'Bekleyen Davet' : 'Pending'}
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-1">
            {locale === 'tr' 
              ? 'Size gönderilen makale değerlendirme davetlerini inceleyin ve yanıtlayın.' 
              : 'Review and respond to peer-review invitations sent to you.'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <CardSkeleton count={2} />
      ) : invitations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm flex flex-col items-center">
          <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            {locale === 'tr' ? 'Yeni Davet Yok' : 'No Pending Invitations'}
          </h3>
          <p className="text-slate-500 mb-6 max-w-md text-sm">
            {locale === 'tr' ? 'Şu anda bekleyen bir davetiniz bulunmuyor.' : 'You have no pending review invitations at the moment.'}
          </p>
          <Link 
            to="/dashboard/reviewer/assigned"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-xl text-sm transition-all border border-indigo-100 shadow-sm group cursor-pointer"
          >
            <span>{locale === 'tr' ? 'Değerlendirme Listesine Git' : 'Go to Review Queue'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {invitations.map((invitation) => {
            const isExpanded = expandedId === invitation.id;
            const isLongAbstract = invitation.abstract && invitation.abstract.length > 180;
            const displayedAbstract = isExpanded || !isLongAbstract 
              ? invitation.abstract 
              : `${invitation.abstract.slice(0, 180)}...`;

            return (
              <motion.div 
                key={invitation.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-slate-300 relative group"
              >
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg inline-block shadow-2xs">
                        {invitation.id}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 leading-snug mb-4">
                    {parseTitle(invitation.title).title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mb-5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{locale === 'tr' ? 'Davet Tarihi:' : 'Invited:'} <strong className="text-slate-700">{formatDate(invitation.invitedAt)}</strong></span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />
                    <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>{locale === 'tr' ? 'Son Yanıt Tarihi:' : 'Respond By:'} <strong className="text-amber-800">{formatDate(invitation.deadline)}</strong></span>
                    </div>
                  </div>

                  <div className="mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-500" /> Abstract
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal">
                      {displayedAbstract}
                    </p>
                    {isLongAbstract && (
                      <button 
                        type="button"
                        onClick={() => setExpandedId(prev => prev === invitation.id ? null : invitation.id)}
                        className="text-indigo-600 hover:text-indigo-700 text-xs font-bold mt-3 inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>
                          {isExpanded 
                            ? (locale === 'tr' ? 'Daha az göster' : 'Show less') 
                            : (locale === 'tr' ? 'Devamını oku' : 'Read full abstract')}
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => promptResponse(invitation, true)}
                      disabled={isResponding}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {locale === 'tr' ? 'Daveti Kabul Et' : 'Accept Invitation'}
                    </button>
                    <button 
                      onClick={() => promptResponse(invitation, false)}
                      disabled={isResponding}
                      className="sm:w-auto px-6 py-3 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 disabled:opacity-50 text-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      <XCircle className="w-4 h-4 text-rose-500" />
                      {locale === 'tr' ? 'Reddet' : 'Decline'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && confirmModal.invitation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  confirmModal.accept ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {confirmModal.accept ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {confirmModal.accept 
                      ? (locale === 'tr' ? 'Daveti Kabul Et?' : 'Accept Peer Review Invitation?') 
                      : (locale === 'tr' ? 'Daveti Reddet?' : 'Decline Review Invitation?')}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 font-mono">
                    {confirmModal.invitation.id}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {confirmModal.accept 
                  ? (locale === 'tr' 
                      ? 'Bu makalenin değerlendirme davetini kabul etmek istediğinize emin misiniz? Makale Değerlendirme Listenize eklenecektir.' 
                      : 'Are you sure you want to accept this review invitation? The manuscript will be added to your Review Queue.')
                  : (locale === 'tr' 
                      ? 'Bu değerlendirme davetini reddetmek istediğinize emin misiniz? Editör bilgilendirilecektir.' 
                      : 'Are you sure you want to decline this invitation? The editor will be notified.')}
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModal({ isOpen: false, invitation: null, accept: true })}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                >
                  {locale === 'tr' ? 'Vazgeç' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={executeConfirm}
                  className={`px-5 py-2.5 text-white rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer ${
                    confirmModal.accept 
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' 
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  }`}
                >
                  {confirmModal.accept 
                    ? (locale === 'tr' ? 'Evet, Kabul Et' : 'Yes, Accept') 
                    : (locale === 'tr' ? 'Evet, Reddet' : 'Yes, Decline')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
