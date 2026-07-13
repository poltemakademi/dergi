import { useState, useEffect } from 'react';
import { Fingerprint } from 'lucide-react';

const dict = {
  EN: {
    footer: { platform: "Platform", sys: "System Features", int: "Integrations", early: "Early Access", res: "Resources", apply: "Author Applications", docs: "Technical Docs", api: "API Reference", rights: "All rights reserved.", terms: "Terms of Service", privacy: "Privacy Policy", cookies: "Cookie Settings", desc: "The next-generation infrastructure for academic publishing. Streamlining peer review, indexing, and dissemination globally." }
  },
  TR: {
    footer: { platform: "Platform", sys: "Sistem Özellikleri", int: "Entegrasyonlar", early: "Erken Erişim", res: "Kaynaklar", apply: "Yazar Başvuruları", docs: "Teknik Dokümanlar", api: "API Referansı", rights: "Tüm hakları saklıdır.", terms: "Hizmet Şartları", privacy: "Gizlilik Politikası", cookies: "Çerez Ayarları", desc: "Akademik yayıncılık için yeni nesil altyapı. Hakem değerlendirmesi, indeksleme ve yayımı küresel olarak kolaylaştırıyor." }
  }
};

export default function Footer() {
  const [lang, setLangState] = useState<'EN' | 'TR'>(
    () => (localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR'
  );

  const t = dict[lang];

  useEffect(() => {
    const handleLangChange = () => {
      setLangState((localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR');
    };
    window.addEventListener('lang-change', handleLangChange);
    return () => window.removeEventListener('lang-change', handleLangChange);
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 px-6 relative z-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Section */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-[3px] items-center">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
                <div className="w-1.5 h-4 bg-sky-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.4)]" />
                <div className="w-1.5 h-5 bg-indigo-400 rounded-full" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Academia<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400 animate-gradient-x bg-[length:200%_auto]">Nexus</span>
              </span>
            </div>
            <p className="text-slate-400 text-base leading-relaxed font-medium max-w-sm">
              {t.footer.desc}
            </p>
            
            <div className="flex gap-4 mt-8">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="md:col-span-7 grid grid-cols-2 gap-12 sm:gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="text-slate-50 font-bold tracking-wider text-sm uppercase mb-2">{t.footer.platform}</h4>
              <a href="#sistem-ozellikleri" className="text-slate-400 hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1.5 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-500 transition-all duration-300"></span> {t.footer.sys}
              </a>
              <a href="#entegrasyonlar" className="text-slate-400 hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1.5 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-500 transition-all duration-300"></span> {t.footer.int}
              </a>
              <a href="#early-access" className="text-slate-400 hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1.5 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-500 transition-all duration-300"></span> {t.footer.early}
              </a>
            </div>
            
            <div className="flex flex-col gap-4">
              <h4 className="text-slate-50 font-bold tracking-wider text-sm uppercase mb-2">{t.footer.res}</h4>
              <a href="#basvurular" className="text-slate-400 hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1.5 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-500 transition-all duration-300"></span> {t.footer.apply}
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1.5 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-500 transition-all duration-300"></span> {t.footer.docs}
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1.5 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-500 transition-all duration-300"></span> {t.footer.api}
              </a>
            </div>
          </div>

        </div>
        
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-slate-600" />
            &copy; 2026 AcademiaNexus. {t.footer.rights}
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">{t.footer.terms}</a>
            <a href="#" className="hover:text-slate-300 transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-slate-300 transition-colors">{t.footer.cookies}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
