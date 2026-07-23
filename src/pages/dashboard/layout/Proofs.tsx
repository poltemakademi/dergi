import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Upload, FileDown, CheckCircle, Eye, Check, AlertCircle, AlertTriangle } from 'lucide-react';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useApiMutation } from '../../../hooks/useApiMutation';
import { toast } from 'sonner';
import { parseTitle } from '../../../utils/parseTitle';
import { useLocaleStore } from '../../../store/useLocaleStore';

interface ArticleMetadata {
  id: string;
  title: string;
  author: string;
}

interface MutationError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export default function Proofs() {
  const { locale } = useLocaleStore();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch article metadata
  const { data: article, isLoading: isArticleLoading, error: articleError, refetch } = useApiQuery<ArticleMetadata>({
    url: `/api/layout/article/${id}`,
    enabled: !!id,
  });

  // Mutation for uploading proof and marking as ready for production
  const { mutate: uploadProof, isLoading: isUploading } = useApiMutation<FormData, unknown>(
    '/api/layout/upload-proof',
    {
      method: 'POST',
      showSuccessToast: false,
      showErrorToast: false,
      onSuccess: () => {
        toast.success('Proof uploaded — article marked as READY_FOR_PRODUCTION');
        setSelectedFile(null);
        navigate('/dashboard/layout/queue');
      },
      onError: (err: MutationError) => {
        const message = err.response?.data?.message || err.message || 'Unknown error';
        toast.error(`Upload failed: ${message}`);
      }
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDownloadSource = () => {
    if (!id) return;
    const downloadUrl = `/api/layout/article/${id}/source`;
    window.open(downloadUrl, '_blank');
    toast.success('Download started');
  };

  const handlePreviewUpload = () => {
    if (!selectedFile) return;
    const fileUrl = URL.createObjectURL(selectedFile);
    const newWindow = window.open(fileUrl, '_blank');
    if (newWindow) {
      setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 100);
    } else {
      URL.revokeObjectURL(fileUrl);
      toast.error('Failed to open preview window. Please check your popup blocker.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF proof to upload.');
      return;
    }
    if (!id) {
      toast.error('No article ID specified.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('articleId', id);

    uploadProof(formData);
  };

  if (!id) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">No Manuscript Selected</h3>
          <p className="text-sm text-slate-500">
            Please choose a manuscript from the production line queue to manage galley proofs.
          </p>
        </div>
        <Link
          to="/dashboard/layout/queue"
          className="inline-flex w-full items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-all shadow-md"
        >
          Go to Production Queue
        </Link>
      </div>
    );
  }

  if (isArticleLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="space-y-2 mb-8">
          <div className="h-8 bg-slate-200 w-1/3 rounded"></div>
          <div className="h-4 bg-slate-200 w-1/2 rounded"></div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 gap-4">
            <div className="space-y-3 w-full md:w-2/3">
              <div className="h-6 bg-slate-200 w-1/4 rounded"></div>
              <div className="h-8 bg-slate-200 w-3/4 rounded"></div>
              <div className="h-4 bg-slate-200 w-1/2 rounded"></div>
            </div>
            <div className="h-10 bg-slate-200 w-full md:w-1/4 rounded"></div>
          </div>
          <div className="h-40 bg-slate-200 rounded-xl"></div>
          <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-6">
            <div className="h-12 bg-slate-200 flex-1 rounded-xl"></div>
            <div className="h-12 bg-slate-200 flex-1 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (articleError) {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">Error Loading Manuscript</h3>
          <p className="text-sm text-slate-500">
            {articleError.message || 'Failed to load manuscript details.'}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            to="/dashboard/layout/queue"
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-bold text-sm transition-colors"
          >
            Back to Queue
          </Link>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-all shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">
            {locale === 'tr' ? 'Makale Bulunamadı' : 'Manuscript Not Found'}
          </h3>
          <p className="text-sm text-slate-500">
            {locale === 'tr'
              ? 'İstenen makale bulunamadı veya yayına aktarıldı.'
              : 'The requested manuscript could not be found or has already been moved to production.'}
          </p>
        </div>
        <Link
          to="/dashboard/layout/queue"
          className="inline-flex w-full items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-all shadow-md"
        >
          {locale === 'tr' ? 'Kuyruğa Geri Dön' : 'Back to Queue'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800">Galley Proofs Manager</h2>
        <p className="text-slate-500">Upload and finalize formatted PDFs for publication.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="font-mono text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded mb-3 inline-block">
              {article.id}
            </span>
            <h3 className="text-xl font-bold text-slate-800">{parseTitle(article.title).title}</h3>
            <p className="text-sm text-slate-500 mt-1">Author: {article.author}</p>
          </div>
          <button
            onClick={handleDownloadSource}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-bold text-sm transition-colors w-full md:w-auto"
          >
            <FileDown className="w-4 h-4" /> Download Raw Source
          </button>
        </div>

        <div className="mb-8">
          <h4 className="text-sm font-bold text-slate-800 mb-4">Upload Formatted Galley Proof (PDF)</h4>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />

          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors ${
              selectedFile 
                ? 'border-indigo-400 bg-indigo-50/50' 
                : 'border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-300'
            }`}
          >
            {selectedFile ? (
              <>
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Check className="w-8 h-8 text-indigo-600" />
                </div>
                <h5 className="font-bold text-indigo-900 mb-1">{selectedFile.name}</h5>
                <p className="text-sm text-indigo-600/70">Ready to upload</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-indigo-500" />
                </div>
                <h5 className="font-bold text-indigo-900 mb-1">Click or drag PDF here</h5>
                <p className="text-sm text-indigo-600/70">Ensure all author affiliations and styling adhere to the journal guidelines.</p>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-6">
          <button 
            onClick={handlePreviewUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Eye className="w-5 h-5" /> Preview Upload
          </button>
          <button 
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" /> {isUploading ? 'Uploading...' : 'Mark as READY_FOR_PRODUCTION'}
          </button>
        </div>
      </div>
    </div>
  );
}
