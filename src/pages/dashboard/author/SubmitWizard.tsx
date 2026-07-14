import { useSubmissionStore } from '../../../store/useSubmissionStore';
import { Check, ChevronRight, Upload, Users, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubmitWizard() {
  const { currentStep, nextStep, prevStep, metadata, updateMetadata, fileUploaded, setFileUploaded, reset } = useSubmissionStore();
  const navigate = useNavigate();

  const handleComplete = () => {
    reset();
    navigate('/dashboard/yazar/submissions');
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-2 ${
                      isPast ? 'bg-slate-900 border-slate-900 text-white' : 
                      isActive ? 'bg-white border-slate-900 text-slate-900' : 
                      'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : step.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isActive ? 'text-slate-900' : isPast ? 'text-slate-600' : 'text-slate-400'
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">English Metadata</h3>
                    <div className="space-y-4">
                      <input type="text" placeholder="Title (English)" value={metadata.titleEn} onChange={(e) => updateMetadata({titleEn: e.target.value})} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm" />
                      <textarea rows={5} placeholder="Abstract (English)" value={metadata.abstractEn} onChange={(e) => updateMetadata({abstractEn: e.target.value})} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm resize-none" />
                      <input type="text" placeholder="Keywords (English)" value={metadata.keywordsEn} onChange={(e) => updateMetadata({keywordsEn: e.target.value})} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm" />
                    </div>
                  </div>
                  <div className="space-y-5">
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">Turkish Metadata</h3>
                    <div className="space-y-4">
                      <input type="text" placeholder="Title (Turkish)" value={metadata.titleTr} onChange={(e) => updateMetadata({titleTr: e.target.value})} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm" />
                      <textarea rows={5} placeholder="Abstract (Turkish)" value={metadata.abstractTr} onChange={(e) => updateMetadata({abstractTr: e.target.value})} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm resize-none" />
                      <input type="text" placeholder="Keywords (Turkish)" value={metadata.keywordsTr} onChange={(e) => updateMetadata({keywordsTr: e.target.value})} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-sm" />
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
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-200">
                  <Users className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-2">Co-Authors</h3>
                <p className="text-slate-500 text-sm mb-8 text-center max-w-md">Add any contributing researchers to ensure they receive proper attribution and ORCID credit.</p>
                <button className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-md font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all inline-flex items-center gap-2 text-sm shadow-sm">
                  <Users className="w-4 h-4" /> Add Contributing Author
                </button>
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
                
                <button 
                  onClick={() => setFileUploaded(true)} 
                  className={`w-full max-w-2xl mx-auto h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${fileUploaded ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-500 cursor-pointer'}`}
                >
                  {fileUploaded ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 text-white shadow-sm">
                        <Check className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-base text-slate-900">Manuscript_Anonymous.pdf</span>
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
            disabled={currentStep === 1}
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
              disabled={!fileUploaded}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-semibold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" /> Submit Manuscript
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
