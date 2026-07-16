import { useEffect, useState } from 'react';
import { Scale, ShieldCheck, Users, FileText } from 'lucide-react';

const dict = {
  EN: {
    title: "Ethical Guidelines",
    subtitle: "Code of conduct and ethical standards governing manuscript submission, peer review, and academic dissemination.",
    principlesTitle: "Core Ethical Principles",
    principles: [
      { title: "COPE Compliance", desc: "All journals registered under AcademiaNexus strictly adhere to the Committee on Publication Ethics (COPE) core practices and principles." },
      { title: "Conflict of Interest", desc: "Authors, reviewers, and editors must disclose any financial, professional, or personal affiliations that could influence the review pipeline." },
      { title: "Fair Play and Objectivity", desc: "Manuscripts are evaluated solely on their scientific merit, without bias regarding race, gender, institutional status, or nationality." }
    ]
  },
  TR: {
    title: "Etik İlkeler ve Kurallar",
    subtitle: "Makale gönderimi, hakem değerlendirmesi ve akademik yayımı düzenleyen etik kurallar ve standartlar.",
    principlesTitle: "Temel Etik İlkeler",
    principles: [
      { title: "COPE Uyumluluğu", desc: "AcademiaNexus sistemine kayıtlı tüm dergiler, Yayın Etiği Komitesi (COPE) tarafından belirlenen temel uygulama ve ilkeleri katı bir şekilde takip eder." },
      { title: "Çıkar Çatışması Bildirimi", desc: "Yazarlar, hakemler ve editörler; değerlendirme sürecini etkileyebilecek her türlü finansal, mesleki veya kişisel ilişkilerini beyan etmekle yükümlüdür." },
      { title: "Fırsat Eşitliği ve Nesnellik", desc: "Makaleler; yazarların ırkı, cinsiyeti, kurumsal statüsü veya uyruğuna bakılmaksızın yalnızca bilimsel değerlerine göre nesnel olarak değerlendirilir." }
    ]
  }
};

export default function EthicalGuidelines() {
  const [lang, setLang] = useState<'EN' | 'TR'>('TR');

  useEffect(() => {
    const currentLang = (localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR';
    setLang(currentLang);

    const handleLangChange = () => {
      setLang((localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR');
    };
    window.addEventListener('lang-change', handleLangChange);
    return () => window.removeEventListener('lang-change', handleLangChange);
  }, []);

  const t = dict[lang];

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 relative bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-500/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto space-y-16 relative z-10 text-left">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Ethics Charter</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-serif leading-tight">
            {t.title}
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
            {t.subtitle}
          </p>
        </div>

        {/* Ethical Principles Grid */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            {t.principlesTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.principles.map((pr, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">{pr.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">{pr.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Misconduct Section */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full pointer-events-none" />
          <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2 relative z-10">
            <Users className="w-5 h-5 text-indigo-600" />
            Reporting Misconduct
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-normal relative z-10">
            Anyone who identifies unethical behavior, research plagiarism, duplicate publication, or fabricated data in a manuscript under review or already published may report it directly to the editorial board.
          </p>
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-indigo-600 font-bold text-xs">
            <FileText className="w-4 h-4" />
            <span>ethics-complaints@academianexus.org</span>
          </div>
        </div>
      </div>
    </main>
  );
}
