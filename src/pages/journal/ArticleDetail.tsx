import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, FileText, User, Share2, Quote, CheckCircle2 } from 'lucide-react';

export default function ArticleDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data for the article based on ID
  const article = {
    id: id,
    titleEn: "The Impact of Artificial Intelligence on Academic Publishing",
    titleTr: "Yapay Zekanın Akademik Yayıncılık Üzerindeki Etkisi",
    authors: [
      { name: "Doç. Dr. Hüsamettin KARATAŞ", affiliation: "Ankara University, Turkey", orcid: "0000-0002-1234-5678" },
      { name: "Dr. Zaidan Arif AL-ZEBARI", affiliation: "University of Duhok, Iraq", orcid: "0000-0003-8765-4321" }
    ],
    doi: `10.2667/ijar.2026.${id || '1042'}`,
    published: "July 15, 2026",
    issue: "Vol. 5 No. 1 (2026)",
    pages: "10-25",
    abstractEn: "This paper explores the various ways Artificial Intelligence (AI) is automating peer review, manuscript formatting, and plagiarism detection. By analyzing over 500 recent implementations across major publishers, we identify key benefits in processing speed while raising concerns regarding algorithmic bias and the loss of human editorial nuance.",
    abstractTr: "Bu makale, Yapay Zekanın (YZ) hakem değerlendirmesi, makale biçimlendirmesi ve intihal tespitini nasıl otomatikleştirdiğini incelemektedir. Büyük yayıncılardaki 500'den fazla yeni uygulamayı analiz ederek, işlem hızındaki temel faydaları belirlerken algoritmik önyargı ve insani editoryal nüans kaybı ile ilgili endişeleri de dile getiriyoruz.",
    keywordsEn: ["Artificial Intelligence", "Peer Review", "Academic Publishing", "Algorithmic Bias"],
    keywordsTr: ["Yapay Zeka", "Hakem Değerlendirmesi", "Akademik Yayıncılık", "Algoritmik Önyargı"]
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 font-sans text-slate-800 pb-20 pt-12 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="mb-2">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-white hover:bg-indigo-50/20 border border-slate-200/80 hover:border-indigo-200/60 rounded-xl shadow-sm hover:shadow transition-all duration-300 group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-8">
            {/* Header info */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 rounded-lg">
                  Research Article
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Published: {article.published}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                {article.titleEn}
              </h1>
              <h2 className="text-xl md:text-2xl font-bold text-slate-500 leading-tight">
                {article.titleTr}
              </h2>

              <div className="flex flex-col gap-3 pt-2">
                {article.authors.map((author, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{author.name}</div>
                      <div className="text-xs text-slate-500">{author.affiliation}</div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> ORCID: {author.orcid}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* English Abstract & Keywords */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">
                Abstract
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                {article.abstractEn}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {article.keywordsEn.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Turkish Abstract & Keywords */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">
                Özet
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                {article.abstractTr}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {article.keywordsTr.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Sidebar Info & Actions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Download Action */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-lg space-y-6">
            <h3 className="font-bold text-lg">Access Article</h3>
            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-indigo-700 font-extrabold text-sm rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 transition-all cursor-pointer">
              <Download className="w-5 h-5" />
              Download Full PDF
            </button>
            <div className="text-xs text-indigo-200 text-center flex items-center justify-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Size: 1.2 MB
            </div>
          </div>

          {/* Metrics & Meta */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Article Metrics</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">DOI</span>
                <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">
                  {article.doi}
                </a>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">Issue</span>
                <span className="text-slate-800 font-bold">{article.issue}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">Pages</span>
                <span className="text-slate-800 font-bold">{article.pages}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">Downloads</span>
                <span className="text-slate-800 font-bold flex items-center gap-1"><Download className="w-3 h-3 text-slate-400"/> 342</span>
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Tools</h3>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-lg">
                <Quote className="w-4 h-4" /> Cite This Article
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-lg">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
