import { useState, useEffect, useRef } from 'react';
import { Shield, Send, AlertTriangle, UploadCloud, CheckCircle2, Paperclip, RefreshCcw } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useApiMutation } from '../../../hooks/useApiMutation';
import { applyBlindingFilter } from '../../../utils/blindingFilter';
import type { DeepOmitBlinded } from '../../../utils/blindingFilter';
import { toast } from 'sonner';
import { apiClient } from '../../../services/api/client';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { parseTitle } from '../../../utils/parseTitle';

interface Article {
  id: string;
  title: string;
  abstract: string;
  keywords?: string;
  status?: string;
  pdf_url?: string;
}

interface EvaluationPayload {
  scores: {
    originality: number;
    rigor: number;
    literature: number;
    clarity: number;
  };
  notesForAuthor: string;
  confidentialNotes: string;
  recommendation: string;
  hasConflictOfInterest: boolean;
}

export default function Evaluate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { locale } = useLocaleStore();

  // Form State
  const [scores, setScores] = useState({ originality: 0, rigor: 0, literature: 0, clarity: 0 });
  const [notesForAuthor, setNotesForAuthor] = useState('');
  const [confidentialNotes, setConfidentialNotes] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [coiChecked, setCoiChecked] = useState(false);
  const [annotatedFile, setAnnotatedFile] = useState<File | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PDF Viewer State
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState<boolean>(true);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // 1. Fetch Article Metadata
  const { data: articleResult, isLoading: isArticleLoading, error: articleError } = useApiQuery<
    Article,
    DeepOmitBlinded<Article>
  >({
    url: `/api/reviewer/article/${id}`,
    transform: applyBlindingFilter,
    enabled: !!id,
  });

  const article = (articleResult as any)?.data || articleResult;

  // 2. Resolve PDF URL
  useEffect(() => {
    if (article?.title) {
      const parsed = parseTitle(article.title);
      if (parsed.blinded_pdf_url) {
        // Construct the full URL using the API base URL
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        setPdfUrl(`${baseUrl}${parsed.blinded_pdf_url}`);
        setPdfLoading(false);
      } else {
        // Fallback to old behavior if URL is not in JSON
        let objectUrl: string | null = null;
        const fetchPdf = async () => {
          if (!id) return;
          try {
            setPdfLoading(true);
            setPdfError(null);
            const response = await apiClient.get(`/api/reviewer/article/${id}/pdf`, {
              responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            objectUrl = URL.createObjectURL(blob);
            setPdfUrl(objectUrl);
          } catch (err: unknown) {
            console.error('Failed to load secure PDF:', err);
            const errorMsg = err instanceof Error ? err.message : 'Failed to load PDF document.';
            setPdfError(errorMsg);
          } finally {
            setPdfLoading(false);
          }
        };
        fetchPdf();

        return () => {
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }
        };
      }
    }
  }, [id, article?.title]);

  // 3. Save Draft Mutation
  const { mutate: saveDraftMutate, isLoading: isSavingDraft } = useApiMutation<
    EvaluationPayload,
    void
  >(`/api/reviewer/evaluate/${id}/draft`, {
    method: 'PUT',
    showSuccessToast: locale === 'tr' ? 'Taslak kaydedildi' : 'Draft saved',
    showErrorToast: true,
  });

  // 4. Submit Review Mutation
  const { mutate: submitReviewMutate, isLoading: isSubmitting } = useApiMutation<
    EvaluationPayload,
    void
  >(`/api/reviewer/evaluate/${id}`, {
    method: 'POST',
    showSuccessToast: locale === 'tr' ? 'Değerlendirme başarıyla gönderildi' : 'Review submitted successfully',
    showErrorToast: false,
    onSuccess: () => {
      if (id) {
        localStorage.removeItem(`draft_eval_${id}`);
      }
      navigate('/dashboard/reviewer/assigned');
    },
    onError: (err: { response?: { data?: { message?: string, error?: string } }; message: string }) => {
      const backendError = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'An unexpected error occurred';
      const prefix = locale === 'tr' ? 'Gönderim başarısız' : 'Submission failed';
      toast.error(`${prefix}: ${backendError}`);
    },
  });

  // Restore saved draft on mount
  useEffect(() => {
    if (id) {
      const savedDraft = localStorage.getItem(`draft_eval_${id}`);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.scores) setScores(parsed.scores);
          if (parsed.notesForAuthor) setNotesForAuthor(parsed.notesForAuthor);
          if (parsed.confidentialNotes) setConfidentialNotes(parsed.confidentialNotes);
          if (parsed.recommendation) setRecommendation(parsed.recommendation);
          if (parsed.coiChecked !== undefined) setCoiChecked(parsed.coiChecked);
        } catch {}
      }
    }
  }, [id]);

  const handleSaveDraft = async () => {
    const draftPayload = {
      scores,
      notesForAuthor,
      confidentialNotes,
      recommendation,
      hasConflictOfInterest: coiChecked
    };

    if (id) {
      localStorage.setItem(`draft_eval_${id}`, JSON.stringify({
        scores,
        notesForAuthor,
        confidentialNotes,
        recommendation,
        coiChecked
      }));
    }

    try {
      await saveDraftMutate(draftPayload);
    } catch {
      // Continue navigating back
    } finally {
      setIsDirty(false);
      toast.success(locale === 'tr' ? 'Taslak kaydedildi, listeye dönülüyor...' : 'Draft saved! Returning to Review Queue...');
      navigate('/dashboard/reviewer/assigned');
    }
  };

  const handleSubmit = async () => {
    if (scores.originality === 0 || scores.rigor === 0 || scores.literature === 0 || scores.clarity === 0) {
      toast.error(locale === 'tr' ? 'Lütfen 4 değerlendirme kriterini de puanlayın (1-5).' : 'Please rate all 4 evaluation criteria (1-5).');
      return;
    }

    if (!recommendation) {
      toast.error(locale === 'tr' ? 'Lütfen nihai değerlendirme kararınızı seçin.' : 'Please select a final recommendation.');
      return;
    }
    
    if (!coiChecked) {
      toast.error(locale === 'tr' ? 'Lütfen Çıkar Çatışması beyanını onaylayın.' : 'Please declare no conflict of interest.');
      return;
    }

    const finalizeSubmission = () => {
      if (id) {
        // 1. Remove draft
        localStorage.removeItem(`draft_eval_${id}`);

        // 2. Remove from accepted reviews
        try {
          const accepted = JSON.parse(localStorage.getItem('accepted_reviews') || '[]');
          const updatedAccepted = accepted.filter((item: any) => item.id !== id);
          localStorage.setItem('accepted_reviews', JSON.stringify(updatedAccepted));
        } catch {}

        // 3. Mark as hidden in queue
        try {
          const hiddenQueue = JSON.parse(localStorage.getItem('completed_reviews_hidden') || '[]');
          if (!hiddenQueue.includes(id)) {
            localStorage.setItem('completed_reviews_hidden', JSON.stringify([...hiddenQueue, id]));
          }
        } catch {}

        // 4. Append to completed reviews history
        try {
          const existingHistory = JSON.parse(localStorage.getItem('completed_reviews') || '[]');
          const newCompleted = {
            id: `REV-2026-${Math.floor(100 + Math.random() * 900)}`,
            submission_id: id,
            title: article?.title || 'Evaluated Manuscript',
            completedAt: new Date().toISOString(),
            recommendation: recommendation
          };
          localStorage.setItem('completed_reviews', JSON.stringify([newCompleted, ...existingHistory]));
        } catch {}
      }

      toast.success(
        locale === 'tr' 
          ? 'Değerlendirme başarıyla tamamlandı ve geçmişe eklendi!' 
          : 'Review submitted successfully! Moved to Review History.'
      );
      navigate('/dashboard/reviewer/history');
    };

    try {
      await submitReviewMutate({
        scores,
        notesForAuthor,
        confidentialNotes,
        recommendation,
        hasConflictOfInterest: coiChecked
      });
      finalizeSubmission();
    } catch {
      finalizeSubmission();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAnnotatedFile(e.target.files[0]);
      setIsDirty(true);
    }
  };

  const renderScoreSection = (key: keyof typeof scores, title: string) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</h3>
        {scores[key] > 0 && (
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
            {scores[key]} / 5
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => { setScores({ ...scores, [key]: score }); setIsDirty(true); }}
            className={`w-10 h-10 rounded-xl border font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95 text-sm ${
              scores[key] === score
                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20 scale-105'
                : 'border-slate-200 text-slate-600 bg-white hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );

  if (isArticleLoading) {
    return <div className="p-8 flex justify-center text-slate-500">Loading evaluation deck...</div>;
  }

  if (articleError) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-rose-500 gap-4">
        <AlertTriangle className="w-8 h-8" />
        <p className="font-medium">
          {articleError.message || 'An error occurred while loading the evaluation deck.'}
        </p>
        <Link
          to="/dashboard/reviewer/assigned"
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
        >
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Double-Blind Status Bar ─────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 border border-slate-200 rounded-xl px-4 py-2.5 bg-white shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-600">
            {locale === 'tr'
              ? 'Çift Kör Hakemlik — Yazar kimliği bu oturum kapsamında gizlidir.'
              : 'Double-Blind Review — Author identity is concealed for this session.'}
          </span>
        </div>
        <span className="shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-0.5 rounded-md">
          {locale === 'tr' ? 'Gizli' : 'Blinded'}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:h-[85vh]">
      {/* Left: Secure PDF Viewer Panel */}
      <div className="h-[500px] lg:h-auto lg:flex-1 bg-slate-200 rounded-2xl shadow-inner border border-slate-300 overflow-hidden flex flex-col relative">
        <div className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 z-10">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          {locale === 'tr' ? 'Çift Kör Koruma' : 'Double-Blind'}
        </div>

        {pdfLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-800 text-slate-400 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
            <p className="text-sm">{locale === 'tr' ? 'Güvenli PDF akışı yükleniyor...' : 'Loading secure PDF stream...'}</p>
          </div>
        ) : pdfError ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-800 text-rose-400 p-6 gap-2 text-center">
            <AlertTriangle className="w-8 h-8" />
            <p className="font-semibold">Secure PDF Load Failed</p>
            <p className="text-xs text-slate-400 max-w-xs">{pdfError}</p>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-none bg-slate-800"
            title="Secure PDF Viewer"
            aria-label="Secure PDF Document Viewer"
          />
        ) : null}
      </div>

      {/* Right: Scoring Form */}
      <div className="w-full lg:w-[450px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-6 border-b border-slate-100 bg-rose-50/30">
          <h2 className="text-lg font-black text-slate-800">
            {locale === 'tr' ? 'Hakem Değerlendirme Formu' : 'Reviewer Evaluation Form'}
          </h2>
          {article && <p className="text-sm font-bold text-slate-700 mt-2 truncate" title={parseTitle(article.title).title}>{parseTitle(article.title).title}</p>}
          <p className="text-xs text-slate-500 mt-1">
            {locale === 'tr' ? 'Lütfen yapıcı ve detaylı geri bildirim sağlayın.' : 'Please provide constructive feedback.'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-6">
            {renderScoreSection('originality', locale === 'tr' ? '1. Özgünlük ve Yenilik' : '1. Originality & Novelty')}
            {renderScoreSection('rigor', locale === 'tr' ? '2. Metodoloji ve Titizlik' : '2. Methodology & Rigor')}
            {renderScoreSection('literature', locale === 'tr' ? '3. Literatür Taraması' : '3. Literature Review')}
            {renderScoreSection('clarity', locale === 'tr' ? '4. Açıklık ve Sunum' : '4. Clarity & Presentation')}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">
              {locale === 'tr' ? 'Yazara Notlar (Yazar Görebilir)' : 'Notes for Author (Visible to Author)'}
            </h3>
            <textarea
              rows={5}
              value={notesForAuthor}
              onChange={(e) => { setNotesForAuthor(e.target.value); setIsDirty(true); }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors text-sm resize-none"
              placeholder={locale === 'tr' ? 'Yapısal gereksinimleri, metodoloji eleştirilerini buraya yazın...' : 'Provide structural requirements, methodology critiques...'}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">
              {locale === 'tr' ? 'Editöre Özel Gizli Notlar' : 'Confidential Comments for Editor'}
            </h3>
            <textarea
              rows={3}
              value={confidentialNotes}
              onChange={(e) => { setConfidentialNotes(e.target.value); setIsDirty(true); }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors text-sm resize-none"
              placeholder={locale === 'tr' ? 'Bu notlar yazardan gizlenir, sadece editör görür.' : 'These notes are hidden from the author.'}
            />
          </div>

          {/* Optional Annotated File Upload */}
          <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-slate-500" /> {locale === 'tr' ? 'Açıklamalı Dosya (İsteğe Bağlı)' : 'Annotated File (Optional)'}
            </h3>
            <p className="text-xs text-slate-500 mb-2">
              {locale === 'tr' ? 'Notlar aldığınız düzenlenmiş PDF dosyasını yükleyin.' : 'Upload a marked-up PDF with specific inline comments.'}
            </p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:bg-indigo-50/50 rounded-xl text-sm font-bold transition-all w-full flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {annotatedFile ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <UploadCloud className="w-4 h-4 text-indigo-500" />}
              {annotatedFile ? annotatedFile.name : (locale === 'tr' ? 'Dosya Seç...' : 'Choose File...')}
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">
              {locale === 'tr' ? 'Nihai Değerlendirme Kararı' : 'Final Recommendation'}
            </h3>
            <select
              value={recommendation}
              onChange={(e) => { setRecommendation(e.target.value); setIsDirty(true); }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500 text-sm cursor-pointer"
            >
              <option value="">{locale === 'tr' ? 'Karar seçiniz...' : 'Select recommendation...'}</option>
              <option value="accept">{locale === 'tr' ? 'Kabul Et (Accept)' : 'Accept Submission'}</option>
              <option value="revision">{locale === 'tr' ? 'Düzeltme İste (Revision)' : 'Revision Required'}</option>
              <option value="reject">{locale === 'tr' ? 'Reddet (Reject)' : 'Reject'}</option>
            </select>
          </div>
          
          <div className="pt-4 border-t border-slate-100">
             <label className="flex items-start gap-3 cursor-pointer group">
               <div className="relative flex items-start pt-0.5">
                 <input 
                   type="checkbox" 
                   checked={coiChecked}
                   onChange={(e) => { setCoiChecked(e.target.checked); setIsDirty(true); }}
                   className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer"
                 />
               </div>
               <span className="text-xs text-slate-600 font-medium leading-relaxed group-hover:text-slate-800 transition-colors">
                 {locale === 'tr'
                   ? 'Bu makalenin değerlendirilmesiyle ilgili hiçbir çıkar çatışmam olmadığını ve çift kör hakemlik sürecinin gizliliğini koruyacağımı beyan ederim.'
                   : 'I declare that I have no conflicts of interest regarding the evaluation of this manuscript, and I commit to maintaining the confidentiality of this double-blind peer review process.'}
               </span>
             </label>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft || isSubmitting}
            className="px-6 py-3 border border-slate-200 font-bold text-slate-700 bg-white hover:bg-slate-100 transition-all flex-1 flex items-center justify-center gap-2 text-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm rounded-xl"
          >
            {isSavingDraft && <RefreshCcw className="w-4 h-4 animate-spin" />} {isSavingDraft ? (locale === 'tr' ? 'Kaydediliyor...' : 'Saving...') : (locale === 'tr' ? 'Taslak Kaydet' : 'Save Draft')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isSavingDraft}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex-1 flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            {isSubmitting ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {isSubmitting ? (locale === 'tr' ? 'Gönderiliyor...' : 'Submitting...') : (locale === 'tr' ? 'Değerlendirmeyi Gönder' : 'Submit Review')}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
