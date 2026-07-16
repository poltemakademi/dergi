import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ShieldCheck, Users } from 'lucide-react';

interface CMSPageProps {
  type: 'policies' | 'board';
}

export default function CMSPage({ type }: CMSPageProps) {
  const navigate = useNavigate();

  const content = {
    policies: {
      title: "Ethical Guidelines & Policies",
      icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
      body: `
        <h3>1. Double-Blind Peer Review Policy</h3>
        <p>This journal employs a strict double-blind peer review process. Both the reviewer and author identities are concealed from the reviewers, and vice versa, throughout the review process. To facilitate this, authors must ensure that their manuscripts are prepared in a way that does not give away their identity.</p>
        
        <h3>2. Open Access Policy</h3>
        <p>This journal provides immediate open access to its content on the principle that making research freely available to the public supports a greater global exchange of knowledge.</p>
        
        <h3>3. Plagiarism Policy</h3>
        <p>All submitted manuscripts are checked for plagiarism using industry-standard software (e.g., Turnitin). Manuscripts with a similarity index above 15% will be rejected immediately without entering the review process.</p>
      `
    },
    board: {
      title: "Editorial Board",
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      body: `
        <div class="space-y-6">
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Editor-in-Chief</h4>
            <h3 class="text-lg font-bold text-slate-900">Doç. Dr. Hüsamettin KARATAŞ</h3>
            <p class="text-sm text-slate-500">Department of Computer Engineering, Ankara University, Turkey</p>
          </div>
          
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Co-Editor</h4>
            <h3 class="text-lg font-bold text-slate-900">Dr. Zaidan Arif AL-ZEBARI</h3>
            <p class="text-sm text-slate-500">Faculty of Science, University of Duhok, Iraq</p>
          </div>

          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Editorial Advisory Board</h4>
            <ul class="list-disc pl-5 text-sm text-slate-700 space-y-2 mt-2">
              <li>Prof. Dr. Jane Doe, MIT, USA</li>
              <li>Prof. Dr. John Smith, Oxford University, UK</li>
              <li>Assoc. Prof. Ayşe Yılmaz, METU, Turkey</li>
            </ul>
          </div>
        </div>
      `
    }
  };

  const pageData = content[type];

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
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
              {pageData.icon || <BookOpen className="w-8 h-8 text-indigo-600" />}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {pageData.title}
              </h1>
            </div>
          </div>

          {/* CMS Content rendered via dangerouslySetInnerHTML for rich text simulation */}
          <div 
            className="prose prose-slate prose-indigo max-w-none 
              prose-headings:font-bold prose-headings:tracking-tight 
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
              prose-li:text-slate-600"
            dangerouslySetInnerHTML={{ __html: pageData.body }} 
          />
          
        </div>
      </div>
    </div>
  );
}
