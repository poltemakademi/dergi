import { useState } from 'react';
import { Mail, CheckCircle, XCircle, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useApiMutation } from '../../../hooks/useApiMutation';
import { CardSkeleton } from '../../../components/skeletons/CardSkeleton';
import { toast } from 'sonner';

interface Invitation {
  id: string;
  title: string;
  abstract: string;
  invitedAt: string;
  deadline: string;
}

export default function Invitations() {
  const { locale } = useLocaleStore();

  const { data: invitationsData, isLoading, refetch } = useApiQuery<Invitation[]>({
    url: '/api/reviewer/invitations'
  });

  const { mutate: respondMutation, isLoading: isResponding } = useApiMutation<any, void>('/api/reviewer/invitations/respond', {
    method: 'POST',
    showSuccessToast: true,
    showErrorToast: true,
    onSuccess: () => refetch()
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const invitations = Array.isArray(invitationsData) 
    ? invitationsData 
    : Array.isArray((invitationsData as any)?.data) 
      ? (invitationsData as any).data 
      : [];

  const handleResponse = async (id: string, accept: boolean) => {
    try {
      await respondMutation({ invitationId: id, accept });
      if (!invitationsData) {
        toast.success(accept ? 'Invitation accepted' : 'Invitation declined');
      }
    } catch {
      // Handled by hook
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <Mail className="w-6 h-6 text-indigo-600" />
          {locale === 'tr' ? 'Değerlendirme Davetleri' : 'Review Invitations'}
        </h2>
        <p className="text-slate-500">
          {locale === 'tr' 
            ? 'Size gönderilen makale değerlendirme davetlerini inceleyin ve yanıtlayın.' 
            : 'Review and respond to peer-review invitations sent to you.'}
        </p>
      </div>

      {isLoading ? (
        <CardSkeleton count={2} />
      ) : invitations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
          <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            {locale === 'tr' ? 'Yeni Davet Yok' : 'No Pending Invitations'}
          </h3>
          <p className="text-slate-500">
            {locale === 'tr' ? 'Şu anda bekleyen bir davetiniz bulunmuyor.' : 'You have no pending review invitations at the moment.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="p-6">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-3 inline-block">
                      {invitation.id}
                    </span>
                    <h3 className="text-lg font-black text-slate-800 leading-snug">
                      {invitation.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{locale === 'tr' ? 'Davet Tarihi:' : 'Invited:'} {formatDate(invitation.invitedAt)}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />
                  <div className="flex items-center gap-1.5 text-amber-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">{locale === 'tr' ? 'Yanıt için Son Tarih:' : 'Respond By:'} {formatDate(invitation.deadline)}</span>
                  </div>
                </div>

                <div className="mb-6 relative">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Abstract
                  </h4>
                  <div className={`text-slate-600 text-sm leading-relaxed ${expandedId !== invitation.id ? 'line-clamp-3' : ''}`}>
                    {invitation.abstract}
                  </div>
                  {invitation.abstract.length > 200 && (
                    <button 
                      onClick={() => setExpandedId(expandedId === invitation.id ? null : invitation.id)}
                      className="text-indigo-600 text-xs font-bold mt-2 hover:underline focus:outline-none"
                    >
                      {expandedId === invitation.id 
                        ? (locale === 'tr' ? 'Daha az göster' : 'Show less') 
                        : (locale === 'tr' ? 'Devamını oku' : 'Read full abstract')}
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => handleResponse(invitation.id, true)}
                    disabled={isResponding}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-bold transition-colors shadow-sm shadow-emerald-600/20"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {locale === 'tr' ? 'Daveti Kabul Et' : 'Accept Invitation'}
                  </button>
                  <button 
                    onClick={() => handleResponse(invitation.id, false)}
                    disabled={isResponding}
                    className="sm:w-auto px-6 py-3 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 disabled:opacity-50 text-slate-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    {locale === 'tr' ? 'Reddet' : 'Decline'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
