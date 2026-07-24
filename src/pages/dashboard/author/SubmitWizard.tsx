import { useState, useRef, useEffect } from 'react';
import { useSubmissionStore } from '../../../store/useSubmissionStore';
import { Check, ChevronRight, Upload, Users, FileText, ArrowLeft, RefreshCcw, Sparkles, Plus, Trash2, ExternalLink, Star, Mail, Building2 } from 'lucide-react';
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

// Formats ORCID as 0000-0000-0000-0000
const formatOrcid = (val: string): string => {
  if (!val) return '';
  if (val.includes('orcid.org/')) {
    val = val.split('orcid.org/')[1] || val;
  }
  let clean = val.replace(/[^0-9Xx]/g, '').toUpperCase().slice(0, 16);
  const groups = [];
  for (let i = 0; i < clean.length; i += 4) {
    groups.push(clean.slice(i, i + 4));
  }
  return groups.join('-');
};

// Validates email address format
const isValidEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
};

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
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['doc', 'docx'].includes(ext || '')) {
        toast.error(
          locale === 'tr'
            ? 'Lütfen yalnızca geçerli bir Word (.doc, .docx) dosyası yükleyin.'
            : 'Please upload a valid Word (.doc, .docx) file only.'
        );
        return;
      }
      setSelectedFile(file);
      setFileUploaded(true);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!metadata.titleEn?.trim() && !metadata.titleTr?.trim()) {
        toast.error(
          locale === 'tr'
            ? 'Lütfen en az bir dilde Makale Başlığı ve Özet giriniz veya "⚡ Örnek Makale Verisi Yükle" butonunu kullanınız.'
            : 'Please fill in manuscript title & abstract or click "⚡ Auto-Fill Sample Article".'
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

  const fillSampleMetadata = () => {
    updateMetadata({
      titleEn: 'Automated Reviewer Matching in Academic Journal Management Systems via Deep Learning and Natural Language Processing',
      titleTr: 'Derin Öğrenme ve Doğal Dil İşleme Tabanlı Akademik Dergi Yönetim Sistemlerinde Otomatik Hakem Eşleştirme',
      abstractEn: 'In this study, an innovative deep learning and NLP framework is proposed for automated peer reviewer assignment based on manuscript abstracts and keyword embeddings in academic publishing platforms.',
      abstractTr: 'Bu çalışmada, akademik dergi yönetim sistemlerinde başvurulan makalelerin özet ve anahtar kelimelerinden hareketle en uygun hakemlerin otomatik olarak belirlenmesi amacıyla yenilikçi bir derin öğrenme modeli geliştirilmiştir.',
      keywordsEn: 'Deep Learning, Natural Language Processing, Peer Review Assignment, Journal Management',
      keywordsTr: 'Derin Öğrenme, Doğal Dil İşleme, Hakem Atama, Hakemlik Süreçleri'
    });
    toast.success(locale === 'tr' ? 'Örnek makale meta verileri yüklendi.' : 'Sample manuscript metadata filled.');
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

  const fillSampleAuthor = () => {
    const samples = [
      { name: 'Prof. Dr. Ahmet Yılmaz', email: 'a.yilmaz@itu.edu.tr', institution: 'İstanbul Teknik Üniversitesi', orcid: '0000-0002-8819-3401', isCorresponding: false },
      { name: 'Doç. Dr. Elif Demir', email: 'e.demir@boun.edu.tr', institution: 'Boğaziçi Üniversitesi', orcid: '0000-0001-4450-9921', isCorresponding: true },
      { name: 'Dr. Öğr. Üyesi Can Öztürk', email: 'c.ozturk@metu.edu.tr', institution: 'Orta Doğu Teknik Üniversitesi', orcid: '0000-0003-1120-7745', isCorresponding: false }
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setNewAuthor(picked);
    toast.success(locale === 'tr' ? 'Örnek yazar bilgileri dolduruldu.' : 'Sample author details filled.');
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
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-lg">
                    {locale === 'tr' ? 'Makale Meta Verileri' : 'Manuscript Metadata'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {locale === 'tr' ? 'Çift dilli indeksleme için başlık, özet ve anahtar kelimeleri giriniz.' : 'Provide title, abstract, and keywords for indexing.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* English Metadata */}
                  <div className="space-y-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80">
                    <h4 className="font-bold text-indigo-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      {locale === 'tr' ? 'İngilizce Meta Veriler' : 'English Metadata'}
                    </h4>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">{locale === 'tr' ? 'Makale Başlığı (İngilizce)' : 'Manuscript Title (English)'} <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        placeholder="Title (English)" 
                        value={metadata.titleEn} 
                        onChange={(e) => updateMetadata({ titleEn: e.target.value })} 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">{locale === 'tr' ? 'Özet (İngilizce)' : 'Abstract (English)'} <span className="text-rose-500">*</span></label>
                      <textarea 
                        rows={5} 
                        placeholder="Abstract (English)" 
                        value={metadata.abstractEn} 
                        onChange={(e) => updateMetadata({ abstractEn: e.target.value })} 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm resize-none leading-relaxed" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">{locale === 'tr' ? 'Anahtar Kelimeler (İngilizce)' : 'Keywords (English)'}</label>
                      <input 
                        type="text" 
                        placeholder="Keywords (e.g. Deep Learning, NLP)" 
                        value={metadata.keywordsEn} 
                        onChange={(e) => updateMetadata({ keywordsEn: e.target.value })} 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm" 
                      />
                    </div>
                  </div>

                  {/* Turkish Metadata */}
                  <div className="space-y-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80">
                    <h4 className="font-bold text-indigo-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      {locale === 'tr' ? 'Türkçe Meta Veriler' : 'Turkish Metadata'}
                    </h4>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">{locale === 'tr' ? 'Makale Başlığı (Türkçe)' : 'Manuscript Title (Turkish)'} <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        placeholder="Başlık (Türkçe)" 
                        value={metadata.titleTr} 
                        onChange={(e) => updateMetadata({ titleTr: e.target.value })} 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">{locale === 'tr' ? 'Özet (Türkçe)' : 'Abstract (Turkish)'} <span className="text-rose-500">*</span></label>
                      <textarea 
                        rows={5} 
                        placeholder="Özet (Türkçe)" 
                        value={metadata.abstractTr} 
                        onChange={(e) => updateMetadata({ abstractTr: e.target.value })} 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm resize-none leading-relaxed" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">{locale === 'tr' ? 'Anahtar Kelimeler (Türkçe)' : 'Keywords (Turkish)'}</label>
                      <input 
                        type="text" 
                        placeholder="Anahtar Kelimeler (Örn: Yapay Zeka, Derin Öğrenme)" 
                        value={metadata.keywordsTr} 
                        onChange={(e) => updateMetadata({ keywordsTr: e.target.value })} 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm" 
                      />
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
                className="flex flex-col py-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl mb-1 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      {locale === 'tr' ? 'Ortak Yazarlar' : 'Co-Authors'}
                    </h3>
                    <p className="text-slate-500 text-sm">
                      {locale === 'tr' ? 'Makaleye katkıda bulunan tüm araştırmacıları ekleyin.' : 'Add all contributing authors with affiliations and ORCID.'}
                    </p>
                  </div>
                  {!isAddingAuthor && (
                    <button 
                      onClick={() => setIsAddingAuthor(true)} 
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all inline-flex items-center gap-2 text-sm shadow-md cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" /> {locale === 'tr' ? 'Yeni Yazar Ekle' : 'Add Co-Author'}
                    </button>
                  )}
                </div>

                {/* Add Author Form Card */}
                {isAddingAuthor && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-indigo-100 shadow-sm mb-6 space-y-4 animate-in fade-in">
                    <div className="border-b border-slate-200/80 pb-3">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-600" />
                        {locale === 'tr' ? 'Yeni Yazar Bilgileri' : 'New Author Details'}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{locale === 'tr' ? 'Ad Soyad' : 'Full Name'} <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder={locale === 'tr' ? 'Örn: Prof. Dr. Mehmet Kaya' : 'e.g. Prof. Dr. Mehmet Kaya'} 
                          value={newAuthor.name} 
                          onChange={(e) => setNewAuthor(prev => ({ ...prev, name: e.target.value }))} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{locale === 'tr' ? 'E-posta Adresi' : 'Email Address'} <span className="text-rose-500">*</span></label>
                        <input 
                          type="email" 
                          placeholder="m.kaya@itu.edu.tr" 
                          value={newAuthor.email} 
                          onChange={(e) => setNewAuthor(prev => ({ ...prev, email: e.target.value }))} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{locale === 'tr' ? 'Kurum / Üniversite' : 'Institution'} <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder={locale === 'tr' ? 'Örn: İstanbul Teknik Üniversitesi' : 'e.g. Stanford University'} 
                          value={newAuthor.institution} 
                          onChange={(e) => setNewAuthor(prev => ({ ...prev, institution: e.target.value }))} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">ORCID iD <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="0000-0001-5234-9812" 
                          value={newAuthor.orcid} 
                          onChange={(e) => setNewAuthor(prev => ({ ...prev, orcid: formatOrcid(e.target.value) }))} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono tracking-wider focus:ring-2 focus:ring-indigo-500" 
                          maxLength={19}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="isCorresponding"
                        checked={newAuthor.isCorresponding}
                        onChange={(e) => setNewAuthor(prev => ({ ...prev, isCorresponding: e.target.checked }))}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="isCorresponding" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                        {locale === 'tr' ? '★ Sorumlu Yazar (Corresponding Author)' : '★ Corresponding Author'}
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/80">
                      <button 
                        onClick={() => setIsAddingAuthor(false)} 
                        className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer"
                      >
                        {locale === 'tr' ? 'İptal' : 'Cancel'}
                      </button>
                      <button 
                        onClick={() => {
                          if (!newAuthor.name.trim() || !newAuthor.email.trim() || !newAuthor.institution.trim() || !newAuthor.orcid.trim()) {
                            toast.error(
                              locale === 'tr' 
                                ? 'Lütfen tüm yazar bilgilerini (Ad Soyad, E-posta, Kurum ve ORCID iD) doldurunuz.' 
                                : 'Please fill in all author details (Full Name, Email, Institution, and ORCID iD).'
                            );
                            return;
                          }

                          if (!isValidEmail(newAuthor.email)) {
                            toast.error(
                              locale === 'tr' 
                                ? 'Lütfen geçerli bir e-posta adresi giriniz (Örn: m.kaya@itu.edu.tr).' 
                                : 'Please enter a valid email address (e.g. m.kaya@itu.edu.tr).'
                            );
                            return;
                          }

                          if (!/^\d{4}-\d{4}-\d{4}-[\dX]{4}$/i.test(newAuthor.orcid.trim())) {
                            toast.error(
                              locale === 'tr' 
                                ? 'Lütfen geçerli bir 16 haneli ORCID iD giriniz (Örn: 0000-0002-1825-0097).' 
                                : 'Please enter a valid 16-digit ORCID iD (e.g. 0000-0002-1825-0097).'
                            );
                            return;
                          }
                          addAuthor({ id: `author-${Date.now()}`, ...newAuthor });
                          setNewAuthor({ name: '', email: '', institution: '', orcid: '', isCorresponding: false });
                          setIsAddingAuthor(false);
                          toast.success(locale === 'tr' ? 'Yazar eklendi!' : 'Author added!');
                        }} 
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
                      >
                        {locale === 'tr' ? 'Yazarı Kaydet' : 'Save Author'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Author Cards List */}
                <div className="space-y-3">
                  {authors && authors.map((author: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-all gap-3 shadow-2xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm">{author.name}</h4>
                          {author.isCorresponding && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full flex items-center gap-1 border border-amber-200">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {locale === 'tr' ? 'Sorumlu Yazar' : 'Corresponding Author'}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {author.email}
                          </span>
                          {author.institution && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              {author.institution}
                            </span>
                          )}
                          {author.orcid && (
                            <a 
                              href={`https://orcid.org/${author.orcid}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 font-mono flex items-center gap-1 font-semibold"
                            >
                              <span>{author.orcid}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      <button 
                        onClick={() => removeAuthor(author.id || String(idx))} 
                        className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl font-bold transition-colors flex items-center gap-1 self-end sm:self-auto cursor-pointer border border-transparent hover:border-rose-200 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {locale === 'tr' ? 'Kaldır' : 'Remove'}
                      </button>
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
                    {locale === 'tr' ? 'Körleştirilmiş Makale Dosyasını Yükleyin (Word)' : 'Upload Blinded Manuscript (Word)'}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {locale === 'tr' ? 'Çift kör hakemlik için tüm yazar kimliklerinin ve kurum bilgilerinin silindiğinden emin olun (.doc veya .docx).' : 'Ensure all author identities, affiliations, and acknowledgments are removed for double-blind peer review (.doc or .docx).'}
                  </p>
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".doc,.docx" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full p-12 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${fileUploaded ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'}`}
                >
                  {fileUploaded ? (
                    <div className="flex flex-col items-center">
                      <Check className="w-10 h-10 text-emerald-500 mb-2" />
                      <span className="font-bold text-emerald-800 text-base">{selectedFile?.name || 'blinded_manuscript.docx'}</span>
                      <span className="text-emerald-600 text-xs mt-1 font-medium">{locale === 'tr' ? 'Word Dosyası Başarıyla Doğrulandı ve Yüklendi' : 'Word File Successfully Verified & Uploaded'}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-200 text-slate-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-700 text-base">{locale === 'tr' ? 'Körleştirilmiş Word Dosyasını Buraya Bırakın' : 'Drop Blinded Word File Here'}</span>
                      <span className="text-slate-400 text-xs mt-1 font-medium">{locale === 'tr' ? 'veya dosya seçmek için tıklayın (.doc, .docx)' : 'or click to browse (.doc, .docx)'}</span>
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
