import { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const dict = {
  EN: {
    title: "Privacy Policy",
    subtitle: "How we collect, use, and protect your information.",
    sections: [
      { title: "1. Information We Collect", desc: "We collect information you provide directly to us, such as when you create an account, submit an article, or contact support." },
      { title: "2. Use of Information", desc: "We use the information we collect to provide, maintain, and improve our services, to process transactions, and to send you related information." },
      { title: "3. Sharing of Information", desc: "We do not share your personal information with third parties except as described in this privacy policy, such as with our trusted service providers." },
      { title: "4. Data Security", desc: "We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction." }
    ]
  },
  TR: {
    title: "Gizlilik Politikası",
    subtitle: "Bilgilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz hakkında bilgi.",
    sections: [
      { title: "1. Topladığımız Bilgiler", desc: "Hesap oluşturduğunuzda, makale gönderdiğinizde veya destek ile iletişime geçtiğinizde bize doğrudan sağladığınız bilgileri toplarız." },
      { title: "2. Bilgilerin Kullanımı", desc: "Topladığımız bilgileri hizmetlerimizi sağlamak, sürdürmek ve iyileştirmek, işlemleri yürütmek ve size ilgili bilgileri göndermek için kullanırız." },
      { title: "3. Bilgilerin Paylaşımı", desc: "Kişisel bilgilerinizi, bu gizlilik politikasında açıklandığı durumlar haricinde, örneğin güvenilir hizmet sağlayıcılarımızla paylaşmıyoruz." },
      { title: "4. Veri Güvenliği", desc: "Hakkınızdaki bilgileri kayıp, hırsızlık, kötüye kullanım ve yetkisiz erişim, ifşa, değiştirme ve imhadan korumaya yardımcı olmak için makul önlemler alıyoruz." }
    ]
  }
};

export default function PrivacyPolicy() {
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
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Privacy</span>
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
            <ShieldCheck className="w-48 h-48" />
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
