import { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import { Plus, Book, FileText, CheckCircle, Upload, AlertTriangle, X, Sparkles, Image as ImageIcon, File, Layers } from 'lucide-react';
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
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const genericPdfInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const { mutate: publishIssue, isLoading: isPublishing } = useApiMutation('/api/editor/issues/create', {
    method: 'POST',
    showSuccessToast: locale === 'tr' ? 'Sayı başarıyla yayınlandı! 🎉' : 'Issue published successfully! 🎉',
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
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
    setIsDraggingOver(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
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
    
    const payload = {
      volume: volume.trim(),
      number: issueNumber.trim(),
      title: `Cilt ${volume.trim()}, Sayı ${issueNumber.trim()}`,
      article_ids: issueArticles.map(a => a.id)
    };

    publishIssue(payload);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[800px] p-2">
      {/* Left: Unassigned Accepted Articles */}
      <div className="w-full lg:w-[350px] xl:w-[400px] flex flex-col gap-6 h-[700px] lg:h-auto">
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
          <div className="relative z-10">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              {locale === 'tr' ? 'Bekleyen Makaleler' : 'Awaiting Articles'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">{locale === 'tr' ? 'Sayıya atanmayı bekliyor' : 'Waiting to be assigned'}</p>
          </div>
          <div className="relative z-10 flex flex-col items-end">
            <span className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md shadow-indigo-200">
              {availableArticles.length}
            </span>
          </div>
        </div>
        
        <div className="bg-slate-50/50 rounded-3xl p-5 flex-1 overflow-y-auto space-y-4 border border-slate-200/60 custom-scrollbar shadow-inner relative">
          <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-slate-50/80 to-transparent z-10 pointer-events-none" />
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-indigo-400 space-y-4">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <span className="text-sm font-medium animate-pulse">{t('dashboard.loading')}</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-rose-500 space-y-3 bg-rose-50/50 rounded-2xl p-6 border border-rose-100">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <p className="text-sm font-medium text-center">{error.message || 'Failed to fetch articles'}</p>
            </div>
          ) : availableArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 opacity-70">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200 border-dashed">
                <CheckCircle className="w-8 h-8 text-slate-300" />
              </div>
              <span className="text-sm font-medium">{locale === 'tr' ? 'Tüm makaleler atandı' : 'All articles assigned'}</span>
            </div>
          ) : (
            availableArticles.map((article: any) => (
              <div 
                key={article.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, article)}
                onDragEnd={handleDragEnd}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-grab hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 group active:cursor-grabbing relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 tracking-wider">
                    #{article.id.substring(0, 8)}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:scale-110 transition-all">
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-2 leading-relaxed group-hover:text-indigo-950 transition-colors line-clamp-2">
                  {parseTitle(article.title).title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <p className="text-xs font-medium text-slate-500">{article.category || (locale === 'tr' ? 'Araştırma Makalesi' : 'Research Article')}</p>
                </div>
              </div>
            ))
          )}
          <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-slate-50/80 to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      {/* Right: Issue Composer */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 lg:p-10 flex flex-col relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start justify-between border-b border-slate-100/80 pb-8 mb-8 gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl mb-4 text-indigo-600 shadow-sm border border-indigo-100/50">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent tracking-tight">
              {locale === 'tr' ? 'Sayı Stüdyosu' : 'Issue Studio'}
            </h2>
            <p className="text-slate-500 mt-2 text-sm max-w-md leading-relaxed">
              {locale === 'tr' ? 'Yeni sayınızı tasarlayın. Makaleleri sürükleyip bırakın, dosyaları yükleyin ve yayına hazırlayın.' : 'Design your new issue. Drag & drop articles, upload files, and prepare for publication.'}
            </p>
            
            {/* Dynamic Volume/Issue Number Inputs */}
            <div className="flex flex-wrap gap-5 mt-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {locale === 'tr' ? 'Cilt No.' : 'Volume'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder="1"
                  className="w-32 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {locale === 'tr' ? 'Sayı No.' : 'Issue No.'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={issueNumber}
                  onChange={(e) => setIssueNumber(e.target.value)}
                  placeholder="1"
                  className="w-32 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>
          
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="group w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span className="tracking-wide">
              {isPublishing ? t('dashboard.loading') : (locale === 'tr' ? 'Sayıyı Yayınla' : 'Publish Issue')}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 relative z-10">
          {/* Generic PDF Upload */}
          <div 
            onClick={() => genericPdfInputRef.current?.click()}
            className={`relative overflow-hidden rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer group ${
              genericPdf 
                ? 'bg-indigo-50/80 border-2 border-indigo-200' 
                : 'bg-slate-50/50 border-2 border-dashed border-slate-200 hover:bg-slate-50 hover:border-indigo-300'
            }`}
          >
            {genericPdf && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />}
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={genericPdfInputRef} 
              onChange={(e) => handleFileChange(e, setGenericPdf)} 
            />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
              genericPdf ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-indigo-500 shadow-sm group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-md'
            }`}>
              {genericPdf ? <File className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
            </div>
            <h4 className={`font-bold text-base mb-1 ${genericPdf ? 'text-indigo-900' : 'text-slate-700'}`}>
              {genericPdf ? genericPdf.name : (locale === 'tr' ? 'Jenerik Dosyası' : 'Generic File')}
            </h4>
            <p className={`text-xs font-medium ${genericPdf ? 'text-indigo-600/70' : 'text-slate-400'}`}>
              {genericPdf ? (locale === 'tr' ? 'Değiştirmek için tıklayın' : 'Click to change') : (locale === 'tr' ? 'Editör kurulu vb. (PDF)' : 'Editorial board etc. (PDF)')}
            </p>
          </div>
          
          {/* Cover Image Upload */}
          <div 
            onClick={() => coverImageInputRef.current?.click()}
            className={`relative overflow-hidden rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer group ${
              coverImage 
                ? 'bg-purple-50/80 border-2 border-purple-200' 
                : 'bg-slate-50/50 border-2 border-dashed border-slate-200 hover:bg-slate-50 hover:border-purple-300'
            }`}
          >
            {coverImage && <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />}
            <input 
              type="file" 
              accept=".jpg,.png" 
              className="hidden" 
              ref={coverImageInputRef} 
              onChange={(e) => handleFileChange(e, setCoverImage)} 
            />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
              coverImage ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-white text-purple-500 shadow-sm group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-md'
            }`}>
              {coverImage ? <ImageIcon className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
            </div>
            <h4 className={`font-bold text-base mb-1 ${coverImage ? 'text-purple-900' : 'text-slate-700'}`}>
              {coverImage ? coverImage.name : (locale === 'tr' ? 'Kapak Görseli' : 'Cover Image')}
            </h4>
            <p className={`text-xs font-medium ${coverImage ? 'text-purple-600/70' : 'text-slate-400'}`}>
              {coverImage ? (locale === 'tr' ? 'Değiştirmek için tıklayın' : 'Click to change') : (locale === 'tr' ? 'Yüksek çözünürlüklü JPG/PNG' : 'High-res JPG or PNG')}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col relative z-10">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Book className="w-4 h-4 text-indigo-500" />
              {locale === 'tr' ? 'İçindekiler' : 'Table of Contents'}
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
              {issueArticles.length} {locale === 'tr' ? 'Makale' : 'Articles'}
            </span>
          </div>
          
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-h-[160px] w-full transition-all duration-300 rounded-3xl overflow-hidden relative flex flex-col
              ${issueArticles.length > 0 
                ? 'bg-slate-50/50 border border-slate-200 p-2' 
                : isDraggingOver 
                  ? 'bg-indigo-50/50 border-2 border-dashed border-indigo-400 items-center justify-center scale-[1.02] p-6' 
                  : 'bg-slate-50/50 border-2 border-dashed border-slate-200 items-center justify-center hover:bg-slate-50 p-6'
              }`}
          >
            {issueArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center pointer-events-none opacity-80 text-center my-auto">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${isDraggingOver ? 'bg-indigo-100 text-indigo-600 scale-110 shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 shadow-sm'}`}>
                  <Plus className="w-6 h-6" />
                </div>
                <p className={`font-bold text-sm ${isDraggingOver ? 'text-indigo-600' : 'text-slate-600'}`}>
                  {locale === 'tr' ? 'Makaleleri buraya sürükleyin' : 'Drag articles here'}
                </p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium max-w-[200px]">
                  {locale === 'tr' ? 'Yayına hazırlamak için listeyi oluşturun' : 'Build the list to prepare for publishing'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 p-3 overflow-y-auto max-h-[400px] custom-scrollbar">
                {issueArticles.map((article, index) => (
                  <div 
                    key={article.id} 
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md hover:border-indigo-100 transition-all"
                  >
                    <div className="flex items-center gap-5 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 flex items-center justify-center text-sm font-black border border-indigo-100/50 shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm leading-snug truncate group-hover:text-indigo-600 transition-colors">
                          {parseTitle(article.title).title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                            #{article.id.substring(0, 8)}
                          </span>
                          <span className="text-xs font-medium text-slate-500 truncate">{article.author}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveArticle(article.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all shrink-0 ml-4 group-hover:opacity-100 md:opacity-0"
                      title={locale === 'tr' ? 'Kaldır' : 'Remove'}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

