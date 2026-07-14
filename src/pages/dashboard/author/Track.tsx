import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const pipeline = [
  { id: 'PENDING_PRE_CHECK', label: 'Pre-Check', icon: <FileText className="w-5 h-5" /> },
  { id: 'IN_REVIEW', label: 'Peer Review', icon: <Clock className="w-5 h-5" /> },
  { id: 'REVISION_REQUIRED', label: 'Revision', icon: <AlertTriangle className="w-5 h-5" /> },
  { id: 'ACCEPTED', label: 'Accepted', icon: <CheckCircle2 className="w-5 h-5" /> },
];

export default function Track() {
  const { id } = useParams();
  
  // Mock data based on ID
  const isRevision = id === 'JMS-2025-022';
  const currentStep = isRevision ? 2 : 1; // 0-indexed

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/dashboard/yazar/submissions" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Submissions
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
        <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100">
          <div>
            <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded mb-3 inline-block">{id || 'JMS-2025-045'}</span>
            <h1 className="text-2xl font-black text-slate-800">Advancements in Quantum Computing Architecture</h1>
            <p className="text-slate-500 mt-2">Submitted on Oct 12, 2025</p>
          </div>
          
          <button className="px-4 py-2 border-2 border-rose-100 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors">
            Withdraw Manuscript
          </button>
        </div>

        {/* Pipeline Stepper */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
          
          {/* Active progress bar */}
          <div 
            className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ${isRevision ? 'bg-rose-500' : 'bg-indigo-500'}`} 
            style={{ width: `${(currentStep / (pipeline.length - 1)) * 100}%` }}
          ></div>

          <div className="relative z-10 flex justify-between">
            {pipeline.map((step, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;
              
              let bgColor = 'bg-white border-slate-200 text-slate-400';
              if (isPast) bgColor = 'bg-indigo-500 border-indigo-500 text-white';
              if (isActive && !isRevision) bgColor = 'bg-white border-indigo-500 text-indigo-500 shadow-lg shadow-indigo-500/20';
              if (isActive && isRevision) bgColor = 'bg-white border-rose-500 text-rose-500 shadow-lg shadow-rose-500/20';

              return (
                <div key={step.id} className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${bgColor}`}>
                    {step.icon}
                  </div>
                  <span className={`text-xs font-bold ${isActive ? (isRevision ? 'text-rose-600' : 'text-indigo-600') : isPast ? 'text-slate-800' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isRevision && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-black flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5" /> Revision Required
          </h3>
          <p className="text-rose-700/80 text-sm mb-4">The editorial board has requested structural changes before proceeding to peer review. Please check the notes from the reviewer.</p>
          <button className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md shadow-rose-600/20 transition-all">
            Upload Revised PDF
          </button>
        </div>
      )}
    </div>
  );
}
