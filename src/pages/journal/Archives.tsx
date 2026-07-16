import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowLeft, Archive, Book } from 'lucide-react';

export default function Archives() {
  const navigate = useNavigate();
  const [expandedYear, setExpandedYear] = useState<number | null>(2025);

  const archivesData = [
    {
      year: 2025,
      volumes: [
        { volume: 5, issue: 2, date: "December 2025", articles: 12 },
        { volume: 5, issue: 1, date: "June 2025", articles: 15 },
      ]
    },
    {
      year: 2024,
      volumes: [
        { volume: 4, issue: 2, date: "December 2024", articles: 10 },
        { volume: 4, issue: 1, date: "June 2024", articles: 14 },
      ]
    },
    {
      year: 2023,
      volumes: [
        { volume: 3, issue: 2, date: "December 2023", articles: 11 },
        { volume: 3, issue: 1, date: "June 2023", articles: 13 },
      ]
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
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Archive className="w-6 h-6 text-indigo-600" />
              Issue Archives
            </h2>
          </div>

          <div className="space-y-4">
            {archivesData.map((archive) => (
              <div key={archive.year} className="border border-slate-200/80 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedYear(expandedYear === archive.year ? null : archive.year)}
                  className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span className="text-lg font-bold text-slate-800">{archive.year}</span>
                  {expandedYear === archive.year ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedYear === archive.year && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white"
                    >
                      <div className="p-5 space-y-3">
                        {archive.volumes.map((vol, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                            onClick={() => navigate(`../current`)} // In a real app this would go to a specific issue view
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                <Book className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-800">
                                  Volume {vol.volume}, Issue {vol.issue}
                                </h4>
                                <p className="text-xs text-slate-500">{vol.date}</p>
                              </div>
                            </div>
                            <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                              {vol.articles} Articles
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
