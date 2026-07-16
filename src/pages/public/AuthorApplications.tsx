import { useEffect, useState } from 'react';
import { FileEdit, ShieldAlert, Send, BookOpen } from 'lucide-react';

const dict = {
  EN: {
    title: "Author Applications & Submissions",
    subtitle: "Guidelines and requirements for submitting manuscripts to our registered academic journals.",
    sectionTitle: "Application Checklist",
    desc: "Before submitting, authors must ensure their manuscripts conform to the editorial and formatting standards outlined below. Submissions that do not comply may be returned immediately.",
    checklist: [
      { title: "Originality and Plagiarism", desc: "All submissions must be original work. We verify similarity index using iThenticate webhooks. Submissions exceeding 15% similarity are rejected." },
      { title: "Double-Blind Anonymity", desc: "Authors must remove all names, institutions, and identifying metadata from the manuscript file to preserve double-blind integrity." },
      { title: "Formatting & Style", desc: "Manuscripts should follow APA 7th edition or IEEE standards, utilizing standard letter size and double-spaced layout." }
    ],
    flowTitle: "The Submission Process",
    steps: [
      { step: "1", title: "Wizard Submission", desc: "Submit your abstract, keywords, and files through the author submit wizard." },
      { step: "2", title: "Pre-Check", desc: "Our editors perform similarity verification and verify blinding within 7 days." },
      { step: "3", title: "Peer Review", desc: "At least two independent reviewers evaluate your manuscript in a double-blind pipeline." }
    ]
  },
  TR: {
    title: "Yazar Başvuruları ve Gönderim",
    subtitle: "Kayıtlı akademik dergilerimize makale göndermek için kurallar ve gereksinimler.",
    sectionTitle: "Başvuru Kontrol Listesi",
    desc: "Gönderim yapmadan önce, yazarların çalışmalarının aşağıda belirtilen editoryal ve biçimlendirme standartlarına uygun olduğundan emin olmaları gerekir. Uymayan çalışmalar doğrudan iade edilebilir.",
    checklist: [
      { title: "Özgünlük ve İntihal", desc: "Tüm gönderiler özgün olmalıdır. Benzerlik oranını iThenticate web hook'ları ile doğruluyoruz. %15 benzerlik oranını aşan çalışmalar reddedilir." },
      { title: "Çift-Kör Hakemlik Gizliliği", desc: "Yazarlar, çift-kör hakemlik sürecini korumak için makale dosyasından tüm isim, kurum ve tanımlayıcı üstverileri temizlemelidir." },
      { title: "Biçimlendirme ve Stil", desc: "Makaleler APA 7. sürüm veya IEEE standartlarına uygun olarak, standart sayfa boyutunda ve çift satır aralıklı hazırlanmalıdır." }
    ],
    flowTitle: "Makale Gönderim Süreci",
    steps: [
      { step: "1", title: "Sihirbaz Gönderimi", desc: "Yazar gönderi sihirbazını kullanarak özet, anahtar kelimeler ve dosyaları yükler." },
      { step: "2", title: "Ön Kontrol", desc: "Editörlerimiz 7 gün içinde benzerlik kontrolü ve körleme incelemesi yapar." },
      { step: "3", title: "Hakem Değerlendirmesi", desc: "En az iki bağımsız hakem çalışmanızı çift-kör hakemlik sürecinde değerlendirir." }
    ]
  }
};

export default function AuthorApplications() {
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
            <FileEdit className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Guidelines</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-serif leading-tight">
            {t.title}
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
            {t.subtitle}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            {t.sectionTitle}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">{t.desc}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {t.checklist.map((item, idx) => (
              <div key={idx} className="space-y-2 border-l border-indigo-100 pl-4">
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            {t.flowTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.steps.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-black text-indigo-600/20 font-mono mb-2 block">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-md">
            <h3 className="text-2xl font-extrabold font-serif">Ready to submit?</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              Register or login to enter the manuscript submission system. Track your review cycle dynamically in real-time.
            </p>
          </div>
          <a
            href="/auth"
            className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-50 rounded-xl font-bold text-sm shadow-md transition-all duration-200 flex items-center gap-2 shrink-0"
          >
            <span>Proceed to Login</span>
            <Send className="w-4 h-4 text-indigo-600" />
          </a>
        </div>
      </div>
    </main>
  );
}
