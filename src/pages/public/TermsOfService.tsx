import { useEffect, useState } from 'react';
import { Scale, CheckCircle2 } from 'lucide-react';

const dict = {
  EN: {
    title: "Terms of Service",
    subtitle: "Read the rules and conditions for using our platform.",
    sections: [
      { title: "1. Acceptance of Terms", desc: "By accessing and using novaijournal, you accept and agree to be bound by the terms and provision of this agreement." },
      { title: "2. User Conduct", desc: "You agree to use the service for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the platform." },
      { title: "3. Intellectual Property", desc: "All content included on the site, such as text, graphics, logos, images, is the property of novaijournal and protected by copyright laws." },
      { title: "4. Termination", desc: "We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms." }
    ]
  },
  TR: {
    title: "Hizmet Şartları",
    subtitle: "Platformumuzu kullanma kuralları ve koşullarını okuyun.",
    sections: [
      { title: "1. Şartların Kabulü", desc: "novaijournal'a erişerek ve kullanarak, bu sözleşmenin şart ve hükümlerine bağlı kalmayı kabul ve beyan edersiniz." },
      { title: "2. Kullanıcı Davranışı", desc: "Hizmeti yasal amaçlar için ve başkalarının platformu kullanımını veya haklarını ihlal etmeyecek şekilde kullanmayı kabul edersiniz." },
      { title: "3. Fikri Mülkiyet", desc: "Sitede yer alan metin, grafik, logo, resim gibi tüm içerikler novaijournal'ın mülkiyetindedir ve telif hakkı yasalarıyla korunmaktadır." },
      { title: "4. Fesih", desc: "Şartları ihlal etmeniz dahil olmak üzere herhangi bir nedenle önceden bildirimde bulunmaksızın veya sorumluluk kabul etmeksizin hizmetimize erişimi derhal sonlandırabilir veya askıya alabiliriz." }
    ]
  }
};

export default function TermsOfService() {
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
            <span>Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-serif leading-tight">
            {t.title}
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
            {t.subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Scale className="w-48 h-48" />
          </div>
          
          <div className="relative z-10 space-y-12">
            {t.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                  {section.title}
                </h3>
                <p className="text-slate-600 leading-relaxed pl-8">
                  {section.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
