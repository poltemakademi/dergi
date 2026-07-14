import { Shield, Send, Check } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

export default function Evaluate() {
  const { id } = useParams();

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full max-h-[85vh]">
      {/* Left: Document Preview (Simulated PDF) */}
      <div className="flex-1 bg-slate-200 rounded-2xl shadow-inner border border-slate-300 overflow-hidden flex flex-col relative">
        <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 z-10 shadow-lg">
          <Shield className="w-4 h-4" /> Double-Blind Shield Active
        </div>
        
        {/* Fake PDF Viewer */}
        <div className="bg-slate-800 h-12 flex items-center px-4 justify-between text-slate-300 text-sm flex-shrink-0">
          <span>{id}_Blinded.pdf</span>
          <div className="flex gap-4">
            <span>Page 1 of 15</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-300">
          <div className="w-full max-w-[21cm] min-h-[29.7cm] bg-white shadow-xl p-16 space-y-6">
            <div className="w-3/4 h-8 bg-slate-200 rounded"></div>
            <div className="w-1/2 h-4 bg-slate-100 rounded mb-12"></div>
            
            <div className="space-y-3">
              <div className="w-full h-3 bg-slate-100 rounded"></div>
              <div className="w-full h-3 bg-slate-100 rounded"></div>
              <div className="w-5/6 h-3 bg-slate-100 rounded"></div>
            </div>
            
            <div className="space-y-3 pt-6">
              <div className="w-full h-3 bg-slate-100 rounded"></div>
              <div className="w-full h-3 bg-slate-100 rounded"></div>
              <div className="w-full h-3 bg-slate-100 rounded"></div>
              <div className="w-4/6 h-3 bg-slate-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Scoring Form */}
      <div className="w-full lg:w-[450px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-6 border-b border-slate-100 bg-rose-50/30">
          <h2 className="text-lg font-black text-slate-800">Reviewer Evaluation Form</h2>
          <p className="text-xs text-slate-500 mt-1">Please provide constructive feedback.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">1. Originality & Significance</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button key={score} className="w-10 h-10 rounded-full border border-slate-200 hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold text-slate-600 transition-colors">
                  {score}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">2. Methodology Rigor</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button key={score} className="w-10 h-10 rounded-full border border-slate-200 hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold text-slate-600 transition-colors">
                  {score}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Notes for Author (Visible to Author)</h3>
            <textarea rows={5} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors text-sm" placeholder="Provide structural requirements, methodology critiques..." />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Confidential Comments for Editor</h3>
            <textarea rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors text-sm" placeholder="These notes are hidden from the author." />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Final Recommendation</h3>
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500">
              <option value="">Select recommendation...</option>
              <option value="accept">Accept Submission</option>
              <option value="revision">Revision Required</option>
              <option value="reject">Reject</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
          <Link to="/dashboard/reviewer/assigned" className="px-6 py-3 border border-slate-200 font-bold text-slate-600 rounded-xl hover:bg-slate-100 transition-colors flex-1 text-center">
            Save Draft
          </Link>
          <button className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex-1 flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all">
            <Send className="w-4 h-4" /> Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
