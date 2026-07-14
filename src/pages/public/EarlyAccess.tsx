import { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Copy, 
  Calendar, 
  ArrowRight,
  Filter,
  Check,
  ArrowUpRight
} from 'lucide-react';

const dict = {
  EN: {
    nav: { journals: "Journals Directory", sys: "System Features", early: "Early Access", pricing: "Pricing", login: "Log In", apply: "Submit Manuscript" },
    hero: { badge: "Ahead of Print", title: "Early Access", subtitle: "Articles", desc: "Peer-reviewed and DOI-minted manuscripts available ahead of their final issue compilation. The vanguard of global academic research." },
    filters: { subject: "Subject Area", subjects: ['Computer Science', 'Medicine', 'Engineering', 'Physics'], openAccess: "Open Access", sort: "Sort", sortActive: "Latest Minted", sortOptions: ['Latest Minted', 'Most Viewed', 'Highest Impact'] },
    articles: { access: "Open Access", proof: "Galley Proof" },
    cta: { title: "Submit your manuscript.", desc: "Join the vanguard. Experience a frictionless, double-blind peer review process powered by our global multi-tenant infrastructure.", btn: "Start Submission" },
    footer: { platform: "Platform", sys: "System Features", int: "Integrations", early: "Early Access", res: "Resources", apply: "Author Applications", docs: "Technical Docs", api: "API Reference", rights: "All rights reserved.", terms: "Terms of Service", privacy: "Privacy Policy", cookies: "Cookie Settings", desc: "The next-generation infrastructure for academic publishing. Streamlining peer review, indexing, and dissemination globally." }
  },
  TR: {
    nav: { journals: "Dergiler Dizini", sys: "Sistem Özellikleri", early: "Erken Erişim", pricing: "Fiyatlandırma", login: "Giriş Yap", apply: "Yazar Başvurusu" },
    hero: { badge: "Baskıdan Önce", title: "Erken Erişim", subtitle: "Makaleleri", desc: "Nihai sayı derlemesinden önce erişilebilen hakemli ve DOI atanmış makaleler. Küresel akademik araştırmaların öncüsü." },
    filters: { subject: "Konu Alanı", subjects: ['Bilgisayar Bilimi', 'Tıp', 'Mühendislik', 'Fizik'], openAccess: "Açık Erişim", sort: "Sırala", sortActive: "En Son Eklenen", sortOptions: ['En Son Eklenen', 'En Çok Görüntülenen', 'En Yüksek Etki'] },
    articles: { access: "Açık Erişim", proof: "Galley Provası" },
    cta: { title: "Makalenizi gönderin.", desc: "Öncülere katılın. Küresel altyapımızla desteklenen, sorunsuz, çift-kör hakem değerlendirme sürecini deneyimleyin.", btn: "Gönderimi Başlat" },
    footer: { platform: "Platform", sys: "Sistem Özellikleri", int: "Entegrasyonlar", early: "Erken Erişim", res: "Kaynaklar", apply: "Yazar Başvuruları", docs: "Teknik Dokümanlar", api: "API Referansı", rights: "Tüm hakları saklıdır.", terms: "Hizmet Şartları", privacy: "Gizlilik Politikası", cookies: "Çerez Ayarları", desc: "Akademik yayıncılık için yeni nesil altyapı. Hakem değerlendirmesi, indeksleme ve yayımı küresel olarak kolaylaştırıyor." }
  }
};

const ARTICLES = [
  {
    id: '1',
    doi: '10.1016/j.jci.2026.04.012',
    titleEn: 'Evaluating the Long-Term Efficacy of mRNA Vaccines in Immunocompromised Cohorts',
    titleTr: 'Bağışıklık Sistemi Baskılanmış Kohortlarda mRNA Aşılarının Uzun Vadeli Etkinliğinin Değerlendirilmesi',
    authors: 'M. Yılmaz • A. Demir • E. Kaya',
    journal: 'Journal of Clinical Immunology',
    mintedDate: 'Oct 12, 2026',
    isOpenAccess: true,
  },
  {
    id: '2',
    doi: '10.1016/j.msea.2026.09.045',
    titleEn: 'Microstructural Evolution and Mechanical Properties of Additively Manufactured Titanium Alloys',
    titleTr: 'Katmanlı Üretilmiş Titanyum Alaşımlarının Mikroyapısal Gelişimi ve Mekanik Özellikleri',
    authors: 'C. Özdemir • J. Smith • H. Tanaka',
    journal: 'Materials Science and Engineering: A',
    mintedDate: 'Oct 10, 2026',
    isOpenAccess: true,
  },
  {
    id: '3',
    doi: '10.1109/TNNLS.2026.314159',
    titleEn: 'A Novel Attention Mechanism for Efficient Natural Language Processing on Edge Devices',
    titleTr: 'Uç Cihazlarda Verimli Doğal Dil İşleme için Yeni Bir Dikkat Mekanizması',
    authors: 'S. Arslan • L. Chen',
    journal: 'IEEE Transactions on Neural Networks',
    mintedDate: 'Oct 08, 2026',
    isOpenAccess: false,
  },
  {
    id: '4',
    doi: '10.1016/j.ecolind.2026.11.088',
    titleEn: 'Assessing the Impact of Urban Heat Islands on Local Biodiversity in Mediterranean Climates',
    titleTr: 'Akdeniz İklimlerinde Kentsel Isı Adalarının Yerel Biyoçeşitlilik Üzerindeki Etkisinin Değerlendirilmesi',
    authors: 'F. Çelik • A. Rossi • K. Müller',
    journal: 'Ecological Indicators',
    mintedDate: 'Oct 05, 2026',
    isOpenAccess: true,
  }
];

export default function EarlyAccess() {
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [lang, setLangState] = useState<'EN' | 'TR'>(
    () => (localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR'
  );

  useEffect(() => {
    const handleLangChange = () => {
      setLangState((localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR');
    };
    window.addEventListener('lang-change', handleLangChange);
    return () => window.removeEventListener('lang-change', handleLangChange);
  }, []);

  const t = dict[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden flex flex-col">
      {/* --- Ultra Minimal Ambient Noise --- */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay pointer-events-none" />

      {/* --- Ultra Premium Floating Pill Navbar --- */}
      

      <main className="flex-1 pt-40 pb-24 px-4 relative z-10">
        <div className="max-w-[1000px] mx-auto">
          
          {/* 1. HERO SECTION (Editorial Vibe) */}
          <header className="mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-4 flex gap-2">
              {t.hero.title} <span className="text-slate-400">{t.hero.subtitle}</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
              {t.hero.desc}
            </p>
          </header>

          {/* 2. INVISIBLE FILTER ROW (Sleek Data-Table Style) */}
          <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between py-4 mb-4 border-b border-slate-200 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            
            {/* Left Side: Inline Filters */}
            <div className="flex flex-wrap items-center gap-6 w-full sm:w-auto">
              {/* Subject Area Dropdown */}
              <div className="relative group/dropdown">
                <button className="flex items-center gap-2 text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-all cursor-pointer group">
                  <Filter className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  {t.filters.subject}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                {/* Sleek Dropdown Panel */}
                <div className="absolute top-full left-0 mt-3 w-56 bg-white border border-slate-100 rounded-xl shadow-[0_12px_24px_-4px_rgba(0,0,0,0.05)] opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 z-20 translate-y-2 group-hover/dropdown:translate-y-0">
                  <div className="p-1.5">
                    {t.filters.subjects.map((subject) => (
                      <button key={subject} className="w-full text-left px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all cursor-pointer flex items-center justify-between">
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-px h-4 bg-slate-200 hidden sm:block" />

              {/* Minimal Open Access Toggle */}
              <button 
                onClick={() => setOpenAccessOnly(!openAccessOnly)}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className={`relative w-8 h-4 rounded-full transition-colors duration-300 ease-in-out ${openAccessOnly ? 'bg-slate-900' : 'bg-slate-200'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${openAccessOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className={`text-[13px] font-semibold transition-colors duration-300 ${openAccessOnly ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
                  {t.filters.openAccess}
                </span>
              </button>
            </div>

            {/* Right Side: Sorting */}
            <div className="w-full sm:w-auto flex items-center gap-3 mt-4 sm:mt-0">
              <span className="text-[12px] font-medium text-slate-400 uppercase tracking-widest">{t.filters.sort}</span>
              <div className="relative group/sort">
                <button className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-800 hover:text-slate-900 transition-colors cursor-pointer group">
                  {t.filters.sortActive}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </button>
                 <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-slate-100 rounded-xl shadow-[0_12px_24px_-4px_rgba(0,0,0,0.05)] opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all duration-200 z-20 translate-y-2 group-hover/sort:translate-y-0">
                  <div className="p-1.5">
                    {t.filters.sortOptions.map((sortOption) => (
                      <button key={sortOption} className="w-full text-left px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all cursor-pointer">
                        {sortOption}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. LIST VIEW (Hyper-Professional Sleek Rows) */}
          <div className="flex flex-col animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {ARTICLES.map((article) => (
              <div 
                key={article.id}
                className="group relative border-b border-slate-200/70 py-8 flex flex-col lg:flex-row lg:items-start justify-between gap-6 hover:bg-slate-50/50 transition-colors duration-300 -mx-4 px-4 sm:mx-0 sm:px-2 rounded-xl"
              >
                
                {/* Main Content Area */}
                <div className="flex-1 min-w-0 pr-0 lg:pr-8">
                  
                  {/* Super Clean Meta Row */}
                  <div className="flex flex-wrap items-center gap-3 mb-3 text-[12px] font-medium text-slate-500 uppercase tracking-wide">
                    <span className="text-indigo-600 font-semibold">{article.journal}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.mintedDate}
                    </span>
                    {article.isOpenAccess && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> {t.articles.access}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Sleek Typography for Titles */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-slate-900 leading-snug tracking-tight mb-1.5 group-hover:text-indigo-600 transition-colors duration-200">
                      {lang === 'EN' ? article.titleEn : article.titleTr}
                    </h3>
                    <h4 className="text-[14px] text-slate-500 leading-relaxed">
                      {lang === 'EN' ? article.titleTr : article.titleEn}
                    </h4>
                  </div>

                  {/* Authors */}
                  <div className="text-[14px] text-slate-600">
                    {article.authors}
                  </div>
                </div>

                {/* Right Side Actions / DOI */}
                <div className="shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 pt-4 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                  {/* Minimal DOI string */}
                  <div className="flex items-center gap-2 group/doi cursor-pointer">
                    <span className="font-mono text-[11px] text-slate-400 group-hover/doi:text-slate-900 transition-colors">
                      {article.doi}
                    </span>
                    <Copy className="w-3 h-3 text-slate-300 group-hover/doi:text-slate-900 transition-colors" />
                  </div>

                  {/* Ghost Button for View */}
                  <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-all duration-200">
                    {t.articles.proof}
                    <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 4. CALL TO ACTION CONTAINER (Ultimate Minimalist Aesthetic) */}
          <div className="mt-16 relative rounded-2xl p-8 md:p-12 border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-900 rounded-l-2xl" />
            
            <div className="max-w-xl">
              <h3 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">
                {t.cta.title}
              </h3>
              <p className="text-slate-500 text-[15px] leading-relaxed">
                {t.cta.desc}
              </p>
            </div>
            <button className="shrink-0 px-6 py-3 bg-slate-900 text-white text-[14px] font-semibold rounded-xl hover:bg-slate-800 transition-colors duration-200 flex items-center gap-2 cursor-pointer">
              {t.cta.btn}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>

      {/* --- Ultra Premium Footer --- */}
      
    </div>
  );
}
