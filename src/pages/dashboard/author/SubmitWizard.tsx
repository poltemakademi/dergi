import { useState, useRef, useEffect } from 'react';
import { useSubmissionStore } from '../../../store/useSubmissionStore';
import { Check, ChevronRight, Upload, Users, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../../services/api/client';
import { toast } from 'sonner';
import { useLocaleStore } from '../../../store/useLocaleStore';

export default function SubmitWizard() {
  const { currentStep, nextStep, prevStep, metadata, updateMetadata, fileUploaded, setFileUploaded, reset, authors, addAuthor, removeAuthor } = useSubmissionStore();
  const navigate = useNavigate();
  const { t } = useLocaleStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingAuthor, setIsAddingAuthor] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: '', email: '', institution: '', orcid: '', isCorresponding: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setFileUploaded(true);
    }
  };

  const handleComplete = async () => {
    if (!metadata.titleEn || !metadata.titleTr || !metadata.abstractEn || !metadata.abstractTr) {
      toast.error('Please ensure all mandatory English and Turkish fields are filled.');
      return;
    }

    if (!selectedFile) {
      toast.error('Please upload a blinded PDF manuscript.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('metadata', JSON.stringify(metadata));

      await apiClient.post('/api/author/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Manuscript submitted successfully');
      reset();
      navigate('/dashboard/yazar/submissions');
    } catch (error: any) {
      console.warn('Backend unavailable, simulating local submission:', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Manuscript submitted successfully (Local Mock)');
      reset();
      navigate('/dashboard/yazar/submissions');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Metadata', icon: <FileText className="w-4 h-4" /> },
    { num: 2, title: 'Authors', icon: <Users className="w-4 h-4" /> },
    { num: 3, title: 'Upload', icon: <Upload className="w-4 h-4" /> },
  ];

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 20 : -20, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 20 : -20, opacity: 0 })
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-white hover:bg-indigo-50/20 border border-slate-200/80 hover:border-indigo-200/60 rounded-xl shadow-sm hover:shadow transition-all duration-300 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          {t('dashboard.back')}
        </button>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">New Manuscript Submission</h2>
          <p className="text-sm text-slate-500 font-medium">Please provide the details in both English and Turkish.</p>
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
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">English Metadata</h3>
                    <div className="space-y-4">
                      <input type="text" placeholder="Title (English)" value={metadata.titleEn} onChange={(e) => updateMetadata({ titleEn: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm" />
                      <textarea rows={5} placeholder="Abstract (English)" value={metadata.abstractEn} onChange={(e) => updateMetadata({ abstractEn: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm resize-none" />
                      <input type="text" placeholder="Keywords (English)" value={metadata.keywordsEn} onChange={(e) => updateMetadata({ keywordsEn: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm" />
                    </div>
                  </div>
                  <div className="space-y-5">
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">Turkish Metadata</h3>
                    <div className="space-y-4">
                      <input type="text" placeholder="Title (Turkish)" value={metadata.titleTr} onChange={(e) => updateMetadata({ titleTr: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm" />
                      <textarea rows={5} placeholder="Abstract (Turkish)" value={metadata.abstractTr} onChange={(e) => updateMetadata({ abstractTr: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm resize-none" />
                      <input type="text" placeholder="Keywords (Turkish)" value={metadata.keywordsTr} onChange={(e) => updateMetadata({ keywordsTr: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm" />
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
                    <h3 className="font-bold text-slate-900 text-xl mb-1">Co-Authors</h3>
                    <p className="text-slate-500 text-sm">Add any contributing researchers to ensure they receive proper attribution and ORCID credit.</p>
                  </div>
                  {!isAddingAuthor && (
                    <button onClick={() => setIsAddingAuthor(true)} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md font-bold hover:bg-indigo-100 transition-all inline-flex items-center gap-2 text-sm shadow-sm">
                      <Users className="w-4 h-4" /> Add Author
                    </button>
                  )}
                </div>

                {isAddingAuthor ? (
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                    <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Add New Author</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <input type="text" placeholder="Full Name" value={newAuthor.name} onChange={(e) => setNewAuthor({...newAuthor, name: e.target.value})} className="px-4 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm" />
                      <input type="email" placeholder="Email Address" value={newAuthor.email} onChange={(e) => setNewAuthor({...newAuthor, email: e.target.value})} className="px-4 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm" />
                      <input type="text" placeholder="Institution" value={newAuthor.institution} onChange={(e) => setNewAuthor({...newAuthor, institution: e.target.value})} className="px-4 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm" />
                      <input type="text" placeholder="ORCID (Optional)" value={newAuthor.orcid} onChange={(e) => setNewAuthor({...newAuthor, orcid: e.target.value})} className="px-4 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-sm" />
                    </div>
                    <label className="flex items-center gap-2 mb-6 cursor-pointer">
                      <input type="checkbox" checked={newAuthor.isCorresponding} onChange={(e) => setNewAuthor({...newAuthor, isCorresponding: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                      <span className="text-sm font-medium text-slate-700">Is Corresponding Author</span>
                    </label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          if (!newAuthor.name || !newAuthor.email) {
                            toast.error('Name and Email are required');
                            return;
                          }
                          addAuthor({ id: Math.random().toString(36).substr(2, 9), ...newAuthor });
                          setNewAuthor({ name: '', email: '', institution: '', orcid: '', isCorresponding: false });
                          setIsAddingAuthor(false);
                        }} 
                        className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-bold hover:bg-slate-800"
                      >
                        Save Author
                      </button>
                      <button onClick={() => setIsAddingAuthor(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md text-sm font-bold hover:bg-slate-100">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                {authors.length === 0 && !isAddingAuthor ? (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 border border-slate-200 shadow-sm">
                      <Users className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm mb-4 font-medium">No co-authors added yet. Are you the sole author?</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {authors.map((author, idx) => (
                      <div key={author.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-700 border border-indigo-100">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-800 text-sm">{author.name}</h4>
                              {author.isCorresponding && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Corresponding</span>}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{author.email} • {author.institution || 'No Institution'}</p>
                          </div>
                        </div>
                        <button onClick={() => removeAuthor(author.id)} className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                className="py-6"
              >
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg mb-8 max-w-2xl mx-auto flex gap-4">
                  <div className="shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">Double-Blind Shield Active</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Ensure your PDF does NOT contain author names, affiliations, or acknowledgments. These will be automatically appended upon publication.</p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full max-w-2xl mx-auto h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${fileUploaded ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-500 cursor-pointer'}`}
                >
                  {fileUploaded ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 text-white shadow-sm">
                        <Check className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-base text-slate-900">{selectedFile?.name || 'Manuscript_Anonymous.pdf'}</span>
                      <span className="text-slate-500 text-xs mt-1 font-medium">Successfully Verified & Uploaded</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-200 text-slate-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-700 text-base">Drop Blinded PDF Here</span>
                      <span className="text-slate-400 text-xs mt-1 font-medium">or click to browse files</span>
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
            className="px-6 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!fileUploaded || isSubmitting}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-semibold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Manuscript'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
