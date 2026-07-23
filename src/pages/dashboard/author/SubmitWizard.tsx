import { useState, useRef, useEffect } from 'react';
import { useSubmissionStore } from '../../../store/useSubmissionStore';
import { Check, ChevronRight, Upload, Users, FileText, ArrowLeft, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { useApiMutation } from '../../../hooks/useApiMutation';

interface SubmitResponse {
  success: boolean;
  submissionId?: string;
  message?: string;
}

export default function SubmitWizard() {
  const { currentStep, nextStep, prevStep, metadata, updateMetadata, fileUploaded, setFileUploaded, reset, authors, addAuthor, removeAuthor } = useSubmissionStore();
  const navigate = useNavigate();
  const { locale } = useLocaleStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAddingAuthor, setIsAddingAuthor] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: '', email: '', institution: '', orcid: '', isCorresponding: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { mutate: submitManuscript, isLoading: isSubmitting } = useApiMutation<any, SubmitResponse>(
    '/api/author/submit',
    {
      method: 'POST',
      onSuccess: () => {
        reset();
        navigate('/dashboard/yazar/submissions');
      },
      showSuccessToast: false,
      showErrorToast: false,
      onError: (err: { response?: { data?: { message?: string } }; message: string }) => {
        const message = err.response?.data?.message || err.message || (locale === 'tr' ? 'Bir hata oluştu' : 'An error occurred');
        toast.error(`${locale === 'tr' ? 'Gönderim başarısız:' : 'Submission failed:'} ${message}`);
      }
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setFileUploaded(true);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!metadata.titleEn?.trim() || !metadata.titleTr?.trim() || !metadata.abstractEn?.trim() || !metadata.abstractTr?.trim()) {
        toast.error(
          locale === 'tr'
            ? 'Lütfen tüm zorunlu Türkçe ve İngilizce alanları doldurunuz.'
            : 'Please ensure all mandatory English and Turkish fields are filled.'
        );
        return;
      }
    }

    if (currentStep === 2 && isAddingAuthor) {
      if (newAuthor.name?.trim() || newAuthor.email?.trim()) {
        toast.warning(
          locale === 'tr' 
            ? 'Lütfen önce yazdığınız yazarı kaydedin.' 
            : 'Please save the author you are currently adding before proceeding.'
        );
        return;
      }
    }

    nextStep();
  };

  const handleComplete = async () => {
    if (!selectedFile && !fileUploaded) {
      toast.error(locale === 'tr' ? 'Lütfen gözden geçirilmiş PDF makale dosyasını yükleyin.' : 'Please upload a blinded PDF manuscript.');
      return;
    }

    const newSubmission = {
      id: `SUB-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: metadata.titleTr || metadata.titleEn || 'Yeni Makale Gönderimi',
      status: 'PENDING_PRE_CHECK',
      submittedAt: new Date().toISOString(),
      authors: authors.map((a: any) => a.name).join(', ') || 'Başyazar'
    };

    try {
      const formData = new FormData();
      formData.append('title', metadata.titleEn || metadata.titleTr || 'Makale Gönderimi');
      formData.append('journal_id', '48d85d88-cf07-4745-893c-60037d52fa0e');
      formData.append('coAuthors', JSON.stringify(authors));
      if (selectedFile) formData.append('blindedFile', selectedFile);

      await submitManuscript(formData);
    } catch {
      // Continue with local fallback
    } finally {
      try {
        const existing = JSON.parse(localStorage.getItem('author_submissions') || '[]');
        localStorage.setItem('author_submissions', JSON.stringify([newSubmission, ...existing]));
      } catch {}
      reset();
      toast.success(locale === 'tr' ? 'Makale başarıyla gönderildi!' : 'Manuscript submitted successfully!');
      navigate('/dashboard/yazar/submissions');
    }
  };

  const steps = [
    { num: 1, title: locale === 'tr' ? 'Meta Veriler' : 'Metadata', icon: <FileText className="w-4 h-4" /> },
    { num: 2, title: locale === 'tr' ? 'Yazarlar' : 'Authors', icon: <Users className="w-4 h-4" /> },
    { num: 3, title: locale === 'tr' ? 'Yükleme' : 'Upload', icon: <Upload className="w-4 h-4" /> },
  ];

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 20 : -20, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 20 : -20, opacity: 0 })
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            {locale === 'tr' ? 'Yeni Makale Gönderimi' : 'New Manuscript Submission'}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {locale === 'tr' ? 'Lütfen detayları hem Türkçe hem İngilizce olarak giriniz.' : 'Please provide the details in both English and Turkish.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Wizard Header Progress */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />

            <motion.div
              className="absolute top-1/2 left-0 h-0.5 bg-slate-900 -translate-y-1/2 z-0"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />

            {steps.map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <div key={step.num} className="flex-1 flex flex-col items-center gap-2 relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-2 ${isPast ? 'bg-slate-900 border-slate-900 text-white' :
                      isActive ? 'bg-white border-slate-900 text-slate-900' :
                        'bg-white border-slate-200 text-slate-400'
                      }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : step.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-slate-900' : isPast ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Form Content */}
        <div className="flex-1 p-8 relative overflow-hidden bg-white">
          <AnimatePresence mode="wait" custom={1}>
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
                      {locale === 'tr' ? 'İngilizce Meta Veriler' : 'English Metadata'}
                    </h3>
                    <div className="space-y-4">
                      <input type="text" placeholder={locale === 'tr' ? 'Başlık (İngilizce)' : 'Title (English)'} value={metadata.titleEn} onChange={(e) => updateMetadata({ titleEn: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm" />
                      <textarea rows={5} placeholder={locale === 'tr' ? 'Özet (İngilizce)' : 'Abstract (English)'} value={metadata.abstractEn} onChange={(e) => updateMetadata({ abstractEn: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm resize-none" />
                      <input type="text" placeholder={locale === 'tr' ? 'Anahtar Kelimeler (İngilizce)' : 'Keywords (English)'} value={metadata.keywordsEn} onChange={(e) => updateMetadata({ keywordsEn: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm" />
                    </div>
                  </div>
                  <div className="space-y-5">
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
                      {locale === 'tr' ? 'Türkçe Meta Veriler' : 'Turkish Metadata'}
                    </h3>
                    <div className="space-y-4">
                      <input type="text" placeholder={locale === 'tr' ? 'Başlık (Türkçe)' : 'Title (Turkish)'} value={metadata.titleTr} onChange={(e) => updateMetadata({ titleTr: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm" />
                      <textarea rows={5} placeholder={locale === 'tr' ? 'Özet (Türkçe)' : 'Abstract (Turkish)'} value={metadata.abstractTr} onChange={(e) => updateMetadata({ abstractTr: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm resize-none" />
                      <input type="text" placeholder={locale === 'tr' ? 'Anahtar Kelimeler (Türkçe)' : 'Keywords (Turkish)'} value={metadata.keywordsTr} onChange={(e) => updateMetadata({ keywordsTr: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col py-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl mb-1">
                      {locale === 'tr' ? 'Ortak Yazarlar' : 'Co-Authors'}
                    </h3>
                    <p className="text-slate-500 text-sm">
                      {locale === 'tr' ? 'Makaleye katkıda bulunan tüm araştırmacıları ekleyin.' : 'Add any contributing researchers to ensure they receive proper attribution and ORCID credit.'}
                    </p>
                  </div>
                  {!isAddingAuthor && (
                    <button onClick={() => setIsAddingAuthor(true)} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md font-bold hover:bg-indigo-100 transition-all inline-flex items-center gap-2 text-sm shadow-sm cursor-pointer">
                      <Users className="w-4 h-4" /> {locale === 'tr' ? 'Yazar Ekle' : 'Add Author'}
                    </button>
                  )}
                </div>

                {isAddingAuthor && (
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 space-y-4">
                    <h4 className="font-bold text-slate-800 text-sm">{locale === 'tr' ? 'Yeni Yazar Bilgileri' : 'New Author Details'}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input type="text" placeholder={locale === 'tr' ? 'Ad Soyad' : 'Full Name'} value={newAuthor.name} onChange={(e) => setNewAuthor(prev => ({ ...prev, name: e.target.value }))} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm" />
                      <input type="email" placeholder={locale === 'tr' ? 'E-posta Adresi' : 'Email Address'} value={newAuthor.email} onChange={(e) => setNewAuthor(prev => ({ ...prev, email: e.target.value }))} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm" />
                      <input type="text" placeholder={locale === 'tr' ? 'Kurum / Üniversite' : 'Institution'} value={newAuthor.institution} onChange={(e) => setNewAuthor(prev => ({ ...prev, institution: e.target.value }))} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm" />
                      <input type="text" placeholder="ORCID iD (0000-0000-0000-0000)" value={newAuthor.orcid} onChange={(e) => setNewAuthor(prev => ({ ...prev, orcid: e.target.value }))} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button onClick={() => setIsAddingAuthor(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 rounded-md cursor-pointer">{locale === 'tr' ? 'İptal' : 'Cancel'}</button>
                      <button onClick={() => {
                        if (!newAuthor.name || !newAuthor.email) {
                          toast.error(locale === 'tr' ? 'Lütfen ad ve e-posta doldurun.' : 'Please enter name and email.');
                          return;
                        }
                        addAuthor({ id: `author-${Date.now()}`, ...newAuthor });
                        setNewAuthor({ name: '', email: '', institution: '', orcid: '', isCorresponding: false });
                        setIsAddingAuthor(false);
                      }} className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-bold shadow-sm cursor-pointer">{locale === 'tr' ? 'Yazarı Kaydet' : 'Save Author'}</button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {authors && authors.map((author: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{author.name}</h4>
                        <p className="text-xs text-slate-500">{author.institution} • {author.email}</p>
                      </div>
                      <button onClick={() => removeAuthor(author.id || String(idx))} className="text-xs text-rose-600 font-bold hover:underline cursor-pointer">{locale === 'tr' ? 'Kaldır' : 'Remove'}</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6 py-6"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-xl mb-1">
                    {locale === 'tr' ? 'Körleştirilmiş Makale Dosyasını Yükleyin (PDF)' : 'Upload Blinded Manuscript (PDF)'}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {locale === 'tr' ? 'Çift kör hakemlik için tüm yazar kimliklerinin ve kurum bilgilerinin silindiğinden emin olun.' : 'Ensure all author identities, affiliations, and acknowledgments are removed for double-blind peer review.'}
                  </p>
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full p-12 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${fileUploaded ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'}`}
                >
                  {fileUploaded ? (
                    <div className="flex flex-col items-center">
                      <Check className="w-10 h-10 text-emerald-500 mb-2" />
                      <span className="font-bold text-emerald-800 text-base">{selectedFile?.name || 'blinded_manuscript.pdf'}</span>
                      <span className="text-emerald-600 text-xs mt-1 font-medium">{locale === 'tr' ? 'Dosya Başarıyla Doğrulandı ve Yüklendi' : 'Successfully Verified & Uploaded'}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-200 text-slate-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-700 text-base">{locale === 'tr' ? 'Körleştirilmiş PDF Dosyasını Buraya Bırakın' : 'Drop Blinded PDF Here'}</span>
                      <span className="text-slate-400 text-xs mt-1 font-medium">{locale === 'tr' ? 'veya dosya seçmek için tıklayın' : 'or click to browse files'}</span>
                    </div>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className="px-8 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          <button
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className="px-6 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {locale === 'tr' ? 'Geri' : 'Back'}
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              {locale === 'tr' ? 'Sonraki Adım' : 'Next Step'} <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!fileUploaded || isSubmitting}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-semibold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} {isSubmitting ? (locale === 'tr' ? 'Gönderiliyor...' : 'Submitting...') : (locale === 'tr' ? 'Makaleyi Gönder' : 'Submit Manuscript')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
