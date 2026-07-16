import { useEffect, useState } from 'react';
import { Fingerprint, CheckCircle2 } from 'lucide-react';

const dict = {
  EN: {
    title: "Cookie Settings",
    subtitle: "Manage your cookie preferences and learn how we use them.",
    sections: [
      { title: "1. Essential Cookies", desc: "These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas." },
      { title: "2. Performance and Functionality Cookies", desc: "These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable." },
      { title: "3. Analytics and Customization Cookies", desc: "These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you." },
      { title: "4. Managing Cookies", desc: "You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager." }
    ]
  },
  TR: {
    title: "Çerez Ayarları",
    subtitle: "Çerez tercihlerinizi yönetin ve onları nasıl kullandığımızı öğrenin.",
    sections: [
      { title: "1. Temel Çerezler", desc: "Bu çerezler, web sitemiz aracılığıyla size sunulan hizmetleri sağlamak ve güvenli alanlara erişim gibi bazı özelliklerini kullanmak için kesinlikle gereklidir." },
      { title: "2. Performans ve İşlevsellik Çerezleri", desc: "Bu çerezler, web sitemizin performansını ve işlevselliğini artırmak için kullanılır ancak kullanımları için zorunlu değildir. Ancak bu çerezler olmadan bazı işlevler kullanılamayabilir." },
      { title: "3. Analitik ve Özelleştirme Çerezleri", desc: "Bu çerezler, web sitemizin nasıl kullanıldığını veya pazarlama kampanyalarımızın ne kadar etkili olduğunu anlamamıza yardımcı olmak için toplu biçimde kullanılan veya web sitemizi sizin için özelleştirmemize yardımcı olan bilgileri toplar." },
      { title: "4. Çerezleri Yönetme", desc: "Çerezleri kabul edip etmemeye karar verme hakkına sahipsiniz. Çerez tercihlerinizi Çerez İzni Yöneticisi'nde ayarlayarak çerez haklarınızı kullanabilirsiniz." }
    ]
  }
};

export default function CookieSettings() {
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
            <Fingerprint className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Preferences</span>
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
            <Fingerprint className="w-48 h-48" />
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
