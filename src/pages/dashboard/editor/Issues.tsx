import { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import { Plus, Book, FileText, CheckCircle, Upload, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useApiMutation } from '../../../hooks/useApiMutation';
import { parseTitle } from '../../../utils/parseTitle';

export default function Issues() {
  const { t, locale } = useLocaleStore();

  const { data: acceptedArticlesData, isLoading, error, refetch } = useApiQuery<any>({
    url: '/api/editor/articles',
    params: { status: 'ACCEPTED', not_in_issue: 'true' }
  });

  const rawArticles = acceptedArticlesData?.data || acceptedArticlesData || [];

  const [issueArticles, setIssueArticles] = useState<any[]>([]);
  const [genericPdf, setGenericPdf] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [volume, setVolume] = useState('');
  const [issueNumber, setIssueNumber] = useState('');

  const genericPdfInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const { mutate: publishIssue, isLoading: isPublishing } = useApiMutation('/api/editor/issues/create', {
    method: 'POST',
    showSuccessToast: locale === 'tr' ? 'Sayı başarıyla yayınlandı!' : 'Issue published successfully!',
    onSuccess: () => {
      setIssueArticles([]);
      setGenericPdf(null);
      setCoverImage(null);
      setVolume('');
      setIssueNumber('');
      refetch();
    }
  });

  // Calculate available articles (those not yet dragged into the issue)
  const availableArticles = rawArticles.filter(
    (article: any) => !issueArticles.find(ia => ia.id === article.id)
  );

  // Native HTML5 Drag and Drop Handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, article: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(article));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      try {
        const article = JSON.parse(data);
        if (!issueArticles.find(ia => ia.id === article.id)) {
          setIssueArticles(prev => [...prev, article]);
        }
      } catch (err) {
        console.error("Invalid drag data", err);
      }
    }
  };

  const handleRemoveArticle = (id: string) => {
    setIssueArticles(prev => prev.filter(article => article.id !== id));
  };

  const handlePublish = () => {
    if (issueArticles.length === 0) {
      toast.error(locale === 'tr' ? 'En az bir makale eklemelisiniz.' : 'You must add at least one article.');
      return;
    }
    if (!volume.trim() || !issueNumber.trim()) {
      toast.error(locale === 'tr' ? 'Cilt ve sayı numarası zorunludur.' : 'Volume and issue number are required.');
      return;
    }
    
    // Using FormData for multipart/form-data
    const formData = new FormData();
    issueArticles.forEach(a => formData.append('articles[]', a.id));
    if (genericPdf) formData.append('genericPdf', genericPdf);
    if (coverImage) formData.append('coverImage', coverImage);
    formData.append('volume', volume.trim());
    formData.append('issueNumber', issueNumber.trim());

    publishIssue(formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Left: Unassigned Accepted Articles */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 h-[600px] lg:h-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">{locale === 'tr' ? 'Kabul Edilenler (Sayı Bekleyen)' : 'Accepted (Awaiting Issue)'}</h3>
          <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">{availableArticles.length} {locale === 'tr' ? 'öğe' : 'items'}</span>
        </div>
        
        <div className="bg-slate-100 rounded-2xl p-4 flex-1 overflow-y-auto space-y-3 border border-slate-200 border-dashed custom-scrollbar">
          {isLoading ? (
            <div className="text-center text-slate-500 py-8">{t('dashboard.loading')}</div>
          ) : error ? (
            <div className="text-center text-rose-500 py-8 flex flex-col items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> {error.message || 'Failed to fetch articles'}
            </div>
          ) : availableArticles.length === 0 ? (
            <div className="text-center text-slate-500 py-8">{locale === 'tr' ? 'Bekleyen kabul edilmiş makale yok.' : 'No accepted articles waiting.'}</div>
          ) : (
            availableArticles.map((article: any) => (
              <div 
                key={article.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, article)}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-grab hover:shadow-md transition-all group active:cursor-grabbing"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{article.id}</span>
                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug">{parseTitle(article.title).title}</h4>
                <p className="text-xs text-slate-500">{article.category || (locale === 'tr' ? 'Araştırma Makalesi' : 'Research Article')}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: Issue Composer */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col">
        <div className="flex flex-col md:flex-row items-start justify-between border-b border-slate-100 pb-6 mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <Book className="w-7 h-7 text-indigo-500" />
              {locale === 'tr' ? 'Yeni Sayı Oluştur' : 'Create New Issue'}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">{locale === 'tr' ? 'Sonraki sayıyı oluşturmak için kabul edilen makaleleri buraya sürükleyip bırakın.' : 'Drag and drop accepted articles here to build the next issue.'}</p>
            {/* Dynamic Volume/Issue Number Inputs */}
            <div className="flex gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {locale === 'tr' ? 'Cilt No.' : 'Volume'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder={locale === 'tr' ? 'ör. 15' : 'e.g. 15'}
                  className="w-28 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {locale === 'tr' ? 'Sayı No.' : 'Issue No.'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={issueNumber}
                  onChange={(e) => setIssueNumber(e.target.value)}
                  placeholder={locale === 'tr' ? 'ör. 2' : 'e.g. 2'}
                  className="w-28 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full md:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" /> {isPublishing ? t('dashboard.loading') : (locale === 'tr' ? 'Sayıyı Yayınla' : 'Publish Issue')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Generic PDF Upload */}
          <div 
            onClick={() => genericPdfInputRef.current?.click()}
            className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer group"
          >
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={genericPdfInputRef} 
              onChange={(e) => handleFileChange(e, setGenericPdf)} 
            />
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5 text-indigo-500" />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">
              {genericPdf ? genericPdf.name : (locale === 'tr' ? 'Jenerik Yükle' : 'Upload Generic')}
            </h4>
            <p className="text-xs text-slate-500 mt-1">{locale === 'tr' ? 'Editör kurulu vb. içeren PDF dosyası.' : 'PDF file containing editorial board etc.'}</p>
          </div>
          
          {/* Cover Image Upload */}
          <div 
            onClick={() => coverImageInputRef.current?.click()}
            className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer group"
          >
            <input 
              type="file" 
              accept=".jpg,.png" 
              className="hidden" 
              ref={coverImageInputRef} 
              onChange={(e) => handleFileChange(e, setCoverImage)} 
            />
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5 text-indigo-500" />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">
              {coverImage ? coverImage.name : (locale === 'tr' ? 'Kapak Görseli Yükle' : 'Upload Cover Image')}
            </h4>
            <p className="text-xs text-slate-500 mt-1">{locale === 'tr' ? 'Yüksek çözünürlüklü JPG veya PNG' : 'High-res JPG or PNG'}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">{locale === 'tr' ? 'İçindekiler Tablosu' : 'Table of Contents'}</h3>
          
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex-1 min-h-[200px] border-2 border-dashed ${issueArticles.length > 0 ? 'border-indigo-200 bg-white p-4 space-y-3' : 'border-slate-200 bg-slate-50 flex items-center justify-center flex-col text-slate-400'} rounded-xl`}
          >
            {issueArticles.length === 0 ? (
              <>
                <Plus className="w-8 h-8 mb-2 opacity-50" />
                <p className="font-medium text-sm">{locale === 'tr' ? 'Makaleleri bu sayıya eklemek için buraya sürükleyin' : 'Drag articles here to add them to this issue'}</p>
              </>
            ) : (
              issueArticles.map((article, index) => (
                <div key={article.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{parseTitle(article.title).title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{article.id}</span>
                        <span className="text-xs text-slate-500">{article.author}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveArticle(article.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
