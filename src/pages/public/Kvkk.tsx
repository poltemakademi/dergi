import { useEffect, useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

const dict = {
  EN: {
    title: "GDPR / KVKK Clarification Text",
    subtitle: "How we process, store, and protect your personal and academic information on our multi-tenant publishing platform.",
    sections: [
      { title: "1. Data Controller", desc: "Your personal data is processed by AcademiaNexus as the data controller in compliance with the Personal Data Protection Law (KVKK No. 6698) and General Data Protection Regulation (GDPR)." },
      { title: "2. Purposes of Data Processing", desc: "We process names, academic email addresses, ORCID IDs, and institutions to manage review assignments, track manuscripts, mint DOIs, and ensure submission integrity." },
      { title: "3. Storage and Protection", desc: "Data is securely retained in encrypted databases. Document files are stripped of metadata to maintain double-blind evaluations." },
      { title: "4. Your Rights", desc: "You have the right to request access to, rectification of, or erasure of your personal data, or to restrict processing by contacting our privacy officer." }
    ]
  },
  TR: {
    title: "KVKK Aydınlatma Metni",
    subtitle: "Çok kiracılı yayıncılık platformumuzda kişisel ve akademik verilerinizi nasıl işlediğimiz, sakladığımız ve koruduğumuz hakkında bilgi.",
    sections: [
      { title: "1. Veri Sorumlusu", desc: "Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve GDPR kapsamında veri sorumlusu olarak AcademiaNexus tarafından işlenmektedir." },
      { title: "2. Veri İşleme Amaçları", desc: "Hakem atamalarını yönetmek, makaleleri takip etmek, DOI'leri kaydetmek ve gönderim güvenliğini doğrulamak amacıyla isimleri, akademik e-postaları, ORCID ID'lerini ve kurumları işliyoruz." },
      { title: "3. Veri Güvenliği ve Saklama", desc: "Verileriniz şifrelenmiş veritabanlarımızda güvenle saklanır. Çift-kör hakemlik sürecini korumak için taslak dosya üstverileri otomatik olarak temizlenir." },
      { title: "4. Haklarınız", desc: "Veri sahibi olarak, kişisel verilerinize erişme, düzeltilmesini veya silinmesini talep etme hakkına sahipsiniz. Başvurularınızı gizlilik yetkilimize iletebilirsiniz." }
    ]
  }
};

export default function Kvkk() {
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
            <span>Compliance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-serif leading-tight">
            {t.title}
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
            {t.subtitle}
          </p>
        </div>

        {/* Legal Sections */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            {t.sections.map((section, idx) => (
              <div key={idx} className="space-y-2 border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
                <h3 className="font-bold text-slate-900 text-base font-serif flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  {section.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-normal">{section.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contacts */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-extrabold font-serif">Privacy Officer</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              For any questions regarding personal data protection, cookie options, or KVKK/GDPR disclosures, email our legal team.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-slate-300 font-mono text-xs">
            privacy@academianexus.org
          </div>
        </div>
      </div>
    </main>
  );
}
