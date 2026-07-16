import { useEffect, useState } from 'react';
import { FileText, CreditCard } from 'lucide-react';

const dict = {
  EN: {
    title: "Distance Sales Agreement",
    subtitle: "Terms and conditions regarding manuscript processing fees (APCs), subscriptions, and printing services.",
    sections: [
      { title: "1. Parties and Scope", desc: "This agreement is executed between AcademiaNexus (the service provider) and the purchasing author or subscriber (the client) regarding APC payments and print subscriptions." },
      { title: "2. Payment and APC Policy", desc: "Article Processing Charges (APCs) are billed upon manuscript acceptance. Invoicing is processed electronically, and payments must be completed within 14 days of acceptance notification." },
      { title: "3. Refund Policy", desc: "Since editorial review, layout editing, and metadata registry (DOI registration) are digital services initiated instantly upon acceptance, APCs are non-refundable once the production cycle starts." },
      { title: "4. Printed Issue Subscriptions", desc: "Subscriptions for physical print issues are delivered quarterly. In case of damaged delivery, replacements will be shipped free of charge." }
    ]
  },
  TR: {
    title: "Mesafeli Satış Sözleşmesi",
    subtitle: "Makale işlem ücretleri (APC), dergi abonelikleri ve basılı yayın hizmetlerine ilişkin şartlar ve koşullar.",
    sections: [
      { title: "1. Taraflar ve Kapsam", desc: "Bu sözleşme, APC ödemeleri ve basılı abonelikler konusunda hizmet sağlayıcı AcademiaNexus ile satın alan yazar veya abone (Müşteri) arasında düzenlenmiştir." },
      { title: "2. Ödeme ve APC Politikası", desc: "Makale İşlem Ücretleri (APC), makalenin yayına kabul edilmesinin ardından fatura edilir. Faturalandırma elektronik olarak yapılır ve ödemeler kabul bildiriminden itibaren 14 gün içinde tamamlanmalıdır." },
      { title: "3. İade Politikası", desc: "Editoryal inceleme, mizanpaj ve üstveri tescili (DOI kaydı) gibi dijital hizmetlerin ifası kabulle birlikte anında başladığından, üretim döngüsü başladıktan sonra APC ücretleri iade edilmez." },
      { title: "4. Basılı Yayın Gönderimi", desc: "Fiziksel dergi sayıları için yapılan abonelik teslimatları üç ayda bir gerçekleştirilir. Hasarlı ulaşan basılı yayınlar ücretsiz olarak yeniden gönderilir." }
    ]
  }
};

export default function SalesAgreement() {
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
            <FileText className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Sales Contract</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-serif leading-tight">
            {t.title}
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
            {t.subtitle}
          </p>
        </div>

        {/* Contract Sections */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            {t.sections.map((section, idx) => (
              <div key={idx} className="space-y-2 border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
                <h3 className="font-bold text-slate-900 text-base font-serif flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  {section.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-normal">{section.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-extrabold font-serif">Billing Queries</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              For any questions regarding APC calculations, invoicing, corporate institutional discounts, or print subscription forms, contact support.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-slate-300 font-mono text-xs">
            billing@academianexus.org
          </div>
        </div>
      </div>
    </main>
  );
}
