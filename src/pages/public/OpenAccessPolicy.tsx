import { useEffect, useState } from 'react';
import { Globe, Shield, Heart } from 'lucide-react';

const dict = {
  EN: {
    title: "Open Access Policy",
    subtitle: "Supporting global scientific collaboration by providing immediate, unrestrictive access to peer-reviewed research.",
    policyTitle: "Key Policy Clauses",
    clauses: [
      { title: "Immediate Gold Open Access", desc: "All research papers published are made immediately and permanently accessible online without subscription barriers." },
      { title: "Creative Commons Licensing", desc: "Articles are distributed under the Creative Commons Attribution-NonCommercial (CC BY-NC 4.0) license, allowing sharing and adaptation with attribution." },
      { title: "Self-Archiving (Green OA)", desc: "Authors retain the copyright and are permitted to deposit pre-print and post-print versions of their papers in institutional archives." }
    ]
  },
  TR: {
    title: "Açık Erişim Politikası",
    subtitle: "Hakemli bilimsel araştırmalara anında ve kısıtlamasız erişim sağlayarak küresel bilimsel iş birliğini destekliyoruz.",
    policyTitle: "Temel Politika Maddeleri",
    clauses: [
      { title: "Anında Altın Açık Erişim", desc: "Yayınlanan tüm araştırma makaleleri, abonelik engeli olmaksızın çevrimiçi olarak anında ve kalıcı olarak ücretsiz erişime açılır." },
      { title: "Creative Commons Lisansı", desc: "Makaleler Creative Commons Atıf-GayriTicari (CC BY-NC 4.0) lisansı altında dağıtılır; atıfta bulunarak paylaşım ve uyarlamaya izin verilir." },
      { title: "Kendi Kendine Arşivleme", desc: "Yazarlar telif hakkını saklı tutar ve makalelerinin ön baskı (pre-print) ve yayın sonrası baskı (post-print) sürümlerini kurumsal arşivlerde saklayabilir." }
    ]
  }
};

export default function OpenAccessPolicy() {
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
            <Globe className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Open Science</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-serif leading-tight">
            {t.title}
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
            {t.subtitle}
          </p>
        </div>

        {/* Clauses */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            {t.policyTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.clauses.map((clause, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">{clause.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">{clause.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CC BY License Info Box */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-lg">
            <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Heart className="w-5 h-5 text-indigo-600" />
              Creative Commons Attribution 4.0
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              This license permits unrestricted use, distribution, and reproduction in any medium, provided the original work and source are properly cited and not used for commercial gains.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-slate-700 font-mono text-xs font-black">
            CC BY-NC 4.0
          </div>
        </div>
      </div>
    </main>
  );
}
