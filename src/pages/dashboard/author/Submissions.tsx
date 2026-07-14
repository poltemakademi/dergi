import { FileText, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const mySubmissions = [
  { id: 'JMS-2025-045', title: 'Advancements in Quantum Computing Architecture', status: 'IN_REVIEW', date: 'Oct 12, 2025' },
  { id: 'JMS-2025-022', title: 'Structural Analysis of Nanotubes', status: 'REVISION_REQUIRED', date: 'Sep 28, 2025' },
];

export default function Submissions() {
  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'IN_REVIEW': 
        return { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: <Clock className="w-4 h-4" />, text: 'In Review (Peer Evaluation)' };
      case 'REVISION_REQUIRED': 
        return { color: 'text-rose-600 bg-rose-50 border-rose-200', icon: <AlertCircle className="w-4 h-4" />, text: 'Revision Required' };
      default: 
        return { color: 'text-slate-600 bg-slate-50 border-slate-200', icon: <FileText className="w-4 h-4" />, text: status };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800">My Submissions</h2>
          <p className="text-slate-500">Track the status of your active manuscripts.</p>
        </div>
        <Link to="/dashboard/yazar/submit-wizard" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all">
          New Submission
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mySubmissions.map(sub => {
          const status = getStatusInfo(sub.status);
          return (
            <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{sub.id}</span>
                <span className="text-xs text-slate-500 font-medium">{sub.date}</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex-1">{sub.title}</h3>
              
              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 text-sm font-bold ${status.color}`}>
                  {status.icon} {status.text}
                </div>
                
                <Link to={`/dashboard/yazar/track/${sub.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
