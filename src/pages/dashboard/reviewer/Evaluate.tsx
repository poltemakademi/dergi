import { useState, useEffect } from 'react';
import { Shield, Send, AlertTriangle } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useApiMutation } from '../../../hooks/useApiMutation';
import { applyBlindingFilter } from '../../../utils/blindingFilter';
import type { DeepOmitBlinded } from '../../../utils/blindingFilter';
import { toast } from 'sonner';
import { apiClient } from '../../../services/api/client';

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
  };
  notesForAuthor: string;
  confidentialNotes: string;
  recommendation: string;
}

export default function Evaluate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Form State
  const [scores, setScores] = useState({ originality: 0, rigor: 0 });
  const [notesForAuthor, setNotesForAuthor] = useState('');
  const [confidentialNotes, setConfidentialNotes] = useState('');
  const [recommendation, setRecommendation] = useState('');

  // PDF Viewer State
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState<boolean>(true);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // 1. Fetch Article Metadata
  const { isLoading: isArticleLoading, error: articleError } = useApiQuery<
    Article,
    DeepOmitBlinded<Article>
  >({
    url: `/api/reviewer/article/${id}`,
    transform: applyBlindingFilter,
    enabled: !!id,
  });

  // 2. Fetch PDF Blob Stream
  useEffect(() => {
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
  }, [id]);

  // 3. Save Draft Mutation
  const { mutate: saveDraftMutate, isLoading: isSavingDraft } = useApiMutation<
    EvaluationPayload,
    void
  >(`/api/reviewer/evaluate/${id}/draft`, {
    method: 'PUT',
    showSuccessToast: 'Draft saved',
    showErrorToast: true,
  });

  // 4. Submit Review Mutation
  const { mutate: submitReviewMutate, isLoading: isSubmitting } = useApiMutation<
    EvaluationPayload,
    void
  >(`/api/reviewer/evaluate/${id}`, {
    method: 'POST',
    showSuccessToast: 'Review submitted',
    showErrorToast: false,
    onSuccess: () => {
      navigate('/dashboard/reviewer/assigned');
    },
    onError: (err: { response?: { data?: { message?: string } }; message: string }) => {
      const message = err?.response?.data?.message || err?.message || 'An unexpected error occurred';
      toast.error(`Submission failed: ${message}`);
    },
  });

  const handleSaveDraft = async () => {
    try {
      await saveDraftMutate({
        scores,
        notesForAuthor,
        confidentialNotes,
        recommendation,
      });
    } catch {
      // Handled by mutation hook's showErrorToast
    }
  };

  const handleSubmit = async () => {
    if (scores.originality === 0 || scores.rigor === 0 || !recommendation) {
      toast.error('Please complete all scores and recommendation');
      return;
    }

    try {
      await submitReviewMutate({
        scores,
        notesForAuthor,
        confidentialNotes,
        recommendation,
      });
    } catch {
      // Handled by mutation hook's onError handler
    }
  };

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
    <div className="flex flex-col lg:flex-row gap-6 h-full max-h-[85vh]">
      {/* Left: Secure PDF Viewer Panel */}
      <div className="flex-1 bg-slate-200 rounded-2xl shadow-inner border border-slate-300 overflow-hidden flex flex-col relative min-h-[400px] lg:min-h-0">
        <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 z-10 shadow-lg">
          <Shield className="w-4 h-4" /> Double-Blind Shield Active
        </div>

        {pdfLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-800 text-slate-400 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
            <p className="text-sm">Loading secure PDF stream...</p>
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
          <h2 className="text-lg font-black text-slate-800">Reviewer Evaluation Form</h2>
          <p className="text-xs text-slate-500 mt-1">Please provide constructive feedback.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">1. Originality & Significance</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setScores({ ...scores, originality: score })}
                  className={`w-10 h-10 rounded-full border hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold transition-colors ${
                    scores.originality === score
                      ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600 hover:text-white'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">2. Methodology Rigor</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setScores({ ...scores, rigor: score })}
                  className={`w-10 h-10 rounded-full border hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold transition-colors ${
                    scores.rigor === score
                      ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600 hover:text-white'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Notes for Author (Visible to Author)</h3>
            <textarea
              rows={5}
              value={notesForAuthor}
              onChange={(e) => setNotesForAuthor(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors text-sm resize-none"
              placeholder="Provide structural requirements, methodology critiques..."
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Confidential Comments for Editor</h3>
            <textarea
              rows={3}
              value={confidentialNotes}
              onChange={(e) => setConfidentialNotes(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors text-sm resize-none"
              placeholder="These notes are hidden from the author."
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Final Recommendation</h3>
            <select
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500 text-sm"
            >
              <option value="">Select recommendation...</option>
              <option value="accept">Accept Submission</option>
              <option value="revision">Revision Required</option>
              <option value="reject">Reject</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft || isSubmitting}
            className="px-6 py-3 border border-slate-200 font-bold text-slate-600 rounded-xl hover:bg-slate-100 transition-colors flex-1 text-center disabled:opacity-50"
          >
            {isSavingDraft ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isSavingDraft}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex-1 flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
