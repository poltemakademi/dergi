import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Download, User, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

export default function CurrentIssue() {
  const navigate = useNavigate();
  const [expandedAbstract, setExpandedAbstract] = useState<number | null>(null);

  // Mock Data
  const issueDate = "June/July 2026";
  const articles = [
    {
      id: 1,
      title: "The Impact of Artificial Intelligence on Academic Publishing",
      author: "Doç. Dr. Hüsamettin KARATAŞ",
      doi: "10.2667/ijar.2026.1042",
      abstract: "This paper explores the various ways AI is automating peer review and manuscript formatting...",
      pages: "10-25"
    },
    {
      id: 2,
      title: "A Comprehensive Study on Double-Blind Peer Review Effectiveness",
      author: "Dr. Zaidan Arif AL-ZEBARI",
      doi: "10.2667/ijar.2026.1043",
      abstract: "In this study, we analyze over 1,000 journals to determine the true anonymity of double-blind reviews...",
      pages: "26-45"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 font-sans text-slate-800 pb-20 pt-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-white hover:bg-indigo-50/20 border border-slate-200/80 hover:border-indigo-200/60 rounded-xl shadow-sm hover:shadow transition-all duration-300 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Current Issue
            </h2>
            <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 rounded-lg">
              {issueDate}
            </span>
          </div>

          <div className="space-y-6 divide-y divide-slate-100">
            {articles.map((article, index) => (
              <div key={article.id} className={`pt-6 text-left space-y-4 ${index === 0 ? '!pt-0' : ''}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-black text-indigo-600 tracking-widest font-mono uppercase">
                    DOI: {article.doi}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Pages: {article.pages}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 
                    onClick={() => navigate(`../article/${article.id}`)}
                    className="text-lg font-bold text-slate-900 leading-snug hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{article.author}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setExpandedAbstract(expandedAbstract === article.id ? null : article.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <span>Abstract</span>
                    {expandedAbstract === article.id ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedAbstract === article.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed font-normal"
                      >
                        {article.abstract}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer">
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
