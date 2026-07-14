import { Upload, FileDown, CheckCircle, Eye } from 'lucide-react';

export default function Proofs() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800">Galley Proofs Manager</h2>
        <p className="text-slate-500">Upload and finalize formatted PDFs for publication.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100">
          <div>
            <span className="font-mono text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded mb-3 inline-block">JMS-2025-015</span>
            <h3 className="text-xl font-bold text-slate-800">Historical Analysis of Trade Routes</h3>
            <p className="text-sm text-slate-500 mt-1">Author: Dr. Emily Chen</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-bold text-sm transition-colors">
            <FileDown className="w-4 h-4" /> Download Raw Source Files
          </button>
        </div>

        <div className="mb-8">
          <h4 className="text-sm font-bold text-slate-800 mb-4">Upload Formatted Galley Proof (PDF)</h4>
          <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-indigo-50 transition-colors cursor-pointer group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-indigo-500" />
            </div>
            <h5 className="font-bold text-indigo-900 mb-1">Click or drag PDF here</h5>
            <p className="text-sm text-indigo-600/70">Ensure all author affiliations and styling adhere to the journal guidelines.</p>
          </div>
        </div>

        <div className="flex gap-4 border-t border-slate-100 pt-6">
          <button className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
            <Eye className="w-5 h-5" /> Preview Upload
          </button>
          <button className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-colors flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" /> Mark as READY_FOR_PRODUCTION
          </button>
        </div>
      </div>
    </div>
  );
}
