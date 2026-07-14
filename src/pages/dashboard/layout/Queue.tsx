import { Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const productionQueue = [
  { id: 'JMS-2025-015', title: 'Historical Analysis of Trade Routes', status: 'IN_COPYEDITING', priority: 'High', date: 'Oct 20, 2025' },
  { id: 'JMS-2025-018', title: 'Economic Impact of Digital Currencies', status: 'IN_COPYEDITING', priority: 'Normal', date: 'Oct 22, 2025' },
];

export default function Queue() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Production Line</h2>
          <p className="text-slate-500">Manuscripts currently in typesetting and language editing.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-bold border-b border-slate-100">Manuscript ID</th>
              <th className="p-4 font-bold border-b border-slate-100">Title</th>
              <th className="p-4 font-bold border-b border-slate-100">Priority</th>
              <th className="p-4 font-bold border-b border-slate-100">Entered Prod.</th>
              <th className="p-4 font-bold border-b border-slate-100 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productionQueue.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">{item.id}</span>
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-800">{item.title}</p>
                </td>
                <td className="p-4">
                  {item.priority === 'High' ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded w-fit">
                      <AlertCircle className="w-3 h-3" /> Urgent
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">Normal</span>
                  )}
                </td>
                <td className="p-4 text-sm text-slate-500 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" /> {item.date}
                </td>
                <td className="p-4 text-right">
                  <Link to="/dashboard/layout/proofs" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-all shadow-md">
                    Process <ArrowRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
