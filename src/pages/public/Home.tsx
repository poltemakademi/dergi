import { motion } from 'framer-motion';
import { Link2, Shield, Database, Mail, ArrowRight, Sparkles, BarChart3, Globe, BookOpen, Zap, CheckCircle2, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const dict = {
  EN: {
    hero: {
      tag: "Version 3.0 Platform Live",
      title1: "The New Standard in",
      title2: "Academic Publishing",
      desc: "An enterprise-grade, multi-tenant journal management platform. Experience double-blind peer review, automated DOIs, and global indexing in one unified ecosystem.",
      btn1: "Submit Manuscript",
      btn2: "Explore Journals",
      searchPlaceholder: "Search articles, authors, or DOI...",
      searchBtn: "Search",
    },
    stats: { j: "HOSTED JOURNALS", r: "VERIFIED REVIEWERS", a: "OPEN-ACCESS ARTICLES", d: "ACTIVE DOIS MINTED" },
    featured: { tag: "Top Tier Publications", title: "Featured Journals", desc: "Explore the highest-impact publications hosted on our multi-tenant infrastructure.", btn: "View Directory" },
    market: { tag: "Core Integrations", title: "Integrated Academic Marketplace", desc: "Everything required to run a high-impact journal, seamlessly bundled into a single streamlined architecture." },
    cards: {
      c1: "Crossref DOI Automation", d1: "Auto-mint and register Digital Object Identifiers instantly upon publication approval. Completely native integration.",
      c2: "Anti-Plagiarism", t2: "iThenticate Webhooks", d2: "Automated plagiarism detection pipeline natively integrated into the pre-check flow.",
      c3: "Indexing Gateways", t3: "Sobiad Indexing", d3: "Direct metadata push to citation indexing gateways.",
      c4: "Communication", t4: "Mass Mailer Engine", d4: "High-deliverability encrypted hub for reviewer invitations."
    }
  },
  TR: {
    hero: {
      tag: "Sürüm 3.0 Platformu Yayında",
      title1: "Akademik Yayıncılıkta",
      title2: "Yeni Standart",
      desc: "Kurumsal düzeyde, çok kiracılı dergi yönetim platformu. Çift kör hakem değerlendirmesi, otomatik DOI'ler ve küresel indekslemeyi tek bir birleşik ekosistemde deneyimleyin.",
      btn1: "Makale Gönder",
      btn2: "Dergileri Keşfet",
      searchPlaceholder: "Makale, yazar veya DOI arayın...",
      searchBtn: "Ara",
    },
    stats: { j: "BARINDIRILAN DERGİ", r: "ONAYLI HAKEM", a: "AÇIK ERİŞİMLİ MAKALE", d: "AKTİF DOI" },
    featured: { tag: "Üst Düzey Yayınlar", title: "Öne Çıkan Dergiler", desc: "Çok kiracılı altyapımızda barındırılan en yüksek etkili yayınları keşfedin.", btn: "Dizini Görüntüle" },
    market: { tag: "Temel Entegrasyonlar", title: "Entegre Akademik Pazar Yeri", desc: "Yüksek etkili bir dergi yönetmek için gereken her şey, sorunsuz bir şekilde tek bir aerodinamik mimaride toplandı." },
    cards: {
      c1: "Crossref DOI Otomasyonu", d1: "Yayın onayından hemen sonra Dijital Nesne Tanımlayıcıları otomatik oluşturun ve kaydedin. Tamamen yerel entegrasyon.",
      c2: "İntihal Karşıtı", t2: "iThenticate Webhook'ları", d2: "Ön kontrol akışına yerel olarak entegre edilmiş otomatik intihal tespiti hattı.",
      c3: "İndeksleme Ağ Geçitleri", t3: "Sobiad İndeksleme", d3: "Atıf indeksleme ağ geçitlerine doğrudan üst veri gönderimi.",
      c4: "İletişim", t4: "Toplu Posta Motoru", d4: "Hakem davetleri için yüksek teslim edilebilir şifreli merkez."
    }
  }
};

export default function Home() {
  const [lang, setLang] = useState<'EN' | 'TR'>(() => (localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR');
  useEffect(() => {
    const handleLang = () => setLang((localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR');
    window.addEventListener('lang-change', handleLang);
    return () => window.removeEventListener('lang-change', handleLang);
  }, []);
  const t = dict[lang];

  const journals = [
    { id: 'JS', name: 'Journal of Space Exploration', tr: 'Uzay Keşifleri Dergisi', issn: '2845-901X', index: 'Scopus Indexed', indexColor: 'text-emerald-700 bg-emerald-50 border-emerald-200', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop' },
    { id: 'AM', name: 'Annals of Modern Medicine', tr: 'Modern Tıp Yıllıkları', issn: '1992-0453', index: 'Web of Science', indexColor: 'text-blue-700 bg-blue-50 border-blue-200', cover: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop' },
    { id: 'ET', name: 'Engineering & Tech Review', tr: 'Mühendislik ve Teknoloji İncelemeleri', issn: '3012-7822', index: 'Crossref Pending', indexColor: 'text-amber-700 bg-amber-50 border-amber-200', cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop' },
    { id: 'QC', name: 'Quantum Computing Letters', tr: 'Kuantum Hesaplama Mektupları', issn: '4451-229X', index: 'Scopus Indexed', indexColor: 'text-emerald-700 bg-emerald-50 border-emerald-200', cover: 'https://images.unsplash.com/photo-1614935151651-0bea6508ab6b?q=80&w=600&auto=format&fit=crop' },
    { id: 'ES', name: 'Earth & Environmental Science', tr: 'Dünya ve Çevre Bilimleri', issn: '5512-8812', index: 'Web of Science', indexColor: 'text-blue-700 bg-blue-50 border-blue-200', cover: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=600&auto=format&fit=crop' },
    { id: 'AI', name: 'Artificial Intelligence Horizon', tr: 'Yapay Zeka Ufku', issn: '9912-445X', index: 'Scopus Indexed', indexColor: 'text-emerald-700 bg-emerald-50 border-emerald-200', cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop' },
  ];

  return (
    <main className="pb-24 pt-24">
      {/* --- Hero Section --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 min-h-[calc(100vh-192px)] flex items-center border-b border-slate-100">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center py-12">
          
          {/* Left Column: Copywriting & Actions */}
          <div className="lg:col-span-5 text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-semibold tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.hero.tag}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-serif leading-[1.15]"
            >
              {t.hero.title1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500">
                {t.hero.title2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-500 text-base md:text-lg leading-relaxed font-normal"
            >
              {t.hero.desc}
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer">
                {t.hero.btn1}
              </button>
              <button className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all shadow-sm cursor-pointer">
                {t.hero.btn2}
              </button>
            </motion.div>

            {/* Search Field */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 relative max-w-lg"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder={t.hero.searchPlaceholder}
                className="block w-full pl-11 pr-24 py-3.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <button className="px-4 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-sm">
                  {t.hero.searchBtn}
                </button>
              </div>
            </motion.div>

            {/* Micro stats under actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-6 border-t border-slate-100 flex items-center gap-6"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Indexing</span>
                <span className="text-sm font-bold text-slate-800">Scopus & WoS</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">DOI Registry</span>
                <span className="text-sm font-bold text-slate-800">Crossref Native</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: High-Fidelity Browser Window Mock */}
          <div className="lg:col-span-7 relative">
            {/* Soft decorative background glows */}
            <div className="absolute -top-12 -left-12 w-72 h-72 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 80 }}
              className="w-full bg-slate-900/5 p-2 rounded-[2rem] border border-slate-200 shadow-2xl relative z-10"
            >
              {/* macOS Window style wrapper */}
              <div className="bg-white rounded-[1.6rem] border border-slate-200/80 shadow-md overflow-hidden flex flex-col h-[400px] text-left">
                {/* Browser Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="bg-white border border-slate-200 text-slate-400 text-[10px] px-8 py-1 rounded-lg w-72 text-center truncate font-mono">
                    journal.academianexus.com/articles/10.2845
                  </div>
                  <div className="w-12" />
                </div>

                {/* Article interface mockup */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Article main content area */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 rounded">
                        Published Open-Access
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">DOI: 10.2845/qg.2026</span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 leading-snug font-serif">
                      A Neural Framework for Quantum Grid Computing Architecture
                    </h2>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">Sarah Jenkins, Michael Chen</span>
                      <span>•</span>
                      <span>Department of Systems Engineering</span>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Abstract</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        This paper presents a novel approach to grid computing using neural framework architectures. By mapping resource distribution nodes across simulated quantum states, we demonstrate a 42% decrease in synchronization latency...
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[9px] font-semibold text-slate-600 rounded">
                        Scopus Indexed
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[9px] font-semibold text-slate-600 rounded">
                        Crossref Registered
                      </span>
                    </div>
                  </div>

                  {/* Sidebar stats panel */}
                  <div className="w-48 border-l border-slate-100 bg-slate-50/50 p-5 flex flex-col justify-between shrink-0">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Downloads</span>
                        <div className="text-lg font-black text-slate-800">1,248</div>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Citations</span>
                        <div className="text-lg font-black text-slate-800">142</div>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Peer Review Status</span>
                        <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 rounded block text-center mt-1">
                          Double-Blind Pass
                        </span>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors text-center cursor-pointer">
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* --- Data Visualization Stats --- */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-12 md:p-16 relative overflow-hidden">
          {/* Inner background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-indigo-50/50 via-sky-50/50 to-indigo-50/50 opacity-50 pointer-events-none"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-slate-100 relative z-10">
            {[
              { value: '142', label: 'HOSTED JOURNALS', icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
              { value: '12.4k+', label: 'VERIFIED REVIEWERS', icon: Shield, color: 'from-emerald-400 to-teal-500' },
              { value: '84.2k', label: 'OPEN-ACCESS ARTICLES', icon: Globe, color: 'from-amber-400 to-orange-500' },
              { value: '2.1M', label: 'ACTIVE DOIS MINTED', icon: BarChart3, color: 'from-fuchsia-500 to-purple-600' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                  <stat.icon className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors duration-500" />
                </div>
                <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600 mb-3 tracking-tighter group-hover:scale-105 transition-transform duration-500">{stat.value}</span>
                <span className="text-xs font-black tracking-[0.2em] text-slate-400 group-hover:text-indigo-500 transition-colors duration-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Featured Journals Marquee (Infinite Loop) --- */}
      <section className="max-w-[1400px] mx-auto py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 px-8 md:px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm tracking-wider uppercase mb-3">
              <Zap className="w-4 h-4" /> Top Tier Publications
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Featured Journals</h2>
            <p className="text-xl text-slate-500 font-medium">Explore the highest-impact publications hosted on our multi-tenant infrastructure.</p>
          </div>
          <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm group">
            View Directory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="flex overflow-hidden group [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pt-4 pb-16">
          {/* First Marquee Group */}
          <div className="flex gap-8 pr-8 animate-marquee group-hover:[animation-play-state:paused] w-max">
            {journals.map((journal, i) => (
              <div
                key={`${journal.id}-${i}`}
                className="w-[340px] shrink-0 bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.2)] hover:border-indigo-300 transition-all duration-500 hover:-translate-y-3 cursor-pointer group/card relative flex flex-col overflow-hidden"
              >
                {/* Journal Cover Area */}
                <div className="h-48 relative overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900">
                    <img src={journal.cover} alt={journal.name} className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-700" />
                  </div>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white font-black text-xl rounded-[1rem] flex items-center justify-center border border-white/30 shadow-lg group-hover/card:bg-indigo-500 group-hover/card:border-indigo-400 group-hover/card:scale-110 transition-all duration-500">
                      {journal.id}
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${journal.indexColor} bg-white shadow-sm scale-90 origin-bottom-right group-hover/card:scale-100 transition-transform duration-500`}>
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px] font-bold tracking-wide uppercase">{journal.index}</span>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover/card:text-indigo-700 transition-colors line-clamp-2">{journal.name}</h3>
                  <p className="text-slate-500 font-medium mb-8 text-sm italic">{journal.tr}</p>

                  <div className="mt-auto pt-6 border-t border-slate-100/80 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-0.5">e-ISSN</span>
                      <span className="text-sm font-bold text-slate-700 font-mono">{journal.issn}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover/card:bg-indigo-50 group-hover/card:border-indigo-100 transition-colors">
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover/card:text-indigo-600 transition-colors group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Marquee Group (Duplicate for seamless loop) */}
          <div className="flex gap-8 pr-8 animate-marquee group-hover:[animation-play-state:paused] w-max" aria-hidden="true">
            {journals.map((journal, i) => (
              <div
                key={`${journal.id}-dup-${i}`}
                className="w-[340px] shrink-0 bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.2)] hover:border-indigo-300 transition-all duration-500 hover:-translate-y-3 cursor-pointer group/card relative flex flex-col overflow-hidden"
              >
                <div className="h-48 relative overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900">
                    <img src={journal.cover} alt={journal.name} className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-700" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white font-black text-xl rounded-[1rem] flex items-center justify-center border border-white/30 shadow-lg group-hover/card:bg-indigo-500 group-hover/card:border-indigo-400 group-hover/card:scale-110 transition-all duration-500">
                      {journal.id}
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${journal.indexColor} bg-white shadow-sm scale-90 origin-bottom-right group-hover/card:scale-100 transition-transform duration-500`}>
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px] font-bold tracking-wide uppercase">{journal.index}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover/card:text-indigo-700 transition-colors line-clamp-2">{journal.name}</h3>
                  <p className="text-slate-500 font-medium mb-8 text-sm italic">{journal.tr}</p>

                  <div className="mt-auto pt-6 border-t border-slate-100/80 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-0.5">e-ISSN</span>
                      <span className="text-sm font-bold text-slate-700 font-mono">{journal.issn}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover/card:bg-indigo-50 group-hover/card:border-indigo-100 transition-colors">
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover/card:text-indigo-600 transition-colors group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Bento Box Marketplace --- */}
      <section className="max-w-7xl mx-auto px-4 py-24 mb-20 relative z-10 border-t border-slate-100">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs mb-4 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> 
            Core Integrations
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight font-serif">
            Integrated Academic Marketplace
          </h2>
          <p className="text-lg text-slate-500 font-normal leading-relaxed max-w-2xl mx-auto">
            Everything required to run a high-impact journal, seamlessly bundled into a single streamlined architecture.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[620px]"
        >
          {/* DOI Card (Large 2x2 card) */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2 md:row-span-2 bg-slate-900 p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden group cursor-pointer border border-slate-800 flex flex-col justify-between"
          >
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            {/* Mock Academic DOI Panel */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 font-mono text-xs text-slate-400 space-y-4 shadow-2xl relative z-10 w-full">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-slate-500">SYSTEM // CROSSREF_API</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">LIVE CONNECTION</span>
              </div>
              <div className="space-y-2">
                <p className="text-indigo-400"><span className="text-slate-600">&gt;</span> POST /v1/doi/register</p>
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800/50 text-slate-300 space-y-1">
                  <p><span className="text-indigo-400">prefix:</span> "10.2845"</p>
                  <p><span className="text-indigo-400">suffix:</span> "dergip.2026.0412"</p>
                  <p><span className="text-indigo-400">status:</span> <span className="text-emerald-400">"SUCCESS"</span></p>
                  <p><span className="text-indigo-400">url:</span> "https://doi.org/10.2845/dergip..."</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1">
                <span>RESP_TIME: 142ms</span>
                <span>METADATA: VALIDATED</span>
              </div>
            </div>

            <div className="relative z-10 mt-8">
              <div className="inline-flex items-center gap-1.5 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-3">
                <Link2 className="w-3.5 h-3.5" />
                Crossref Automation
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">Crossref DOI Automation</h3>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base font-normal max-w-md">
                Auto-mint and register Digital Object Identifiers instantly upon publication approval. Completely native integration.
              </p>
            </div>
          </motion.div>

          {/* Plagiarism Card (Top Right 2x1 card) */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-slate-300 transition-all duration-300 group cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 text-rose-600 font-bold text-xs uppercase tracking-widest mb-3">
                  <Shield className="w-3.5 h-3.5" />
                  Anti-Plagiarism
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">iThenticate Webhooks</h3>
                <p className="text-slate-500 font-normal leading-relaxed text-sm">
                  Automated plagiarism detection pipeline natively integrated into the pre-check flow.
                </p>
              </div>
              
              {/* Plagiarism Mock UI */}
              <div className="shrink-0 bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full sm:w-48 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Similarity Score</span>
                  <span className="text-xs font-bold text-emerald-600 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100">Safe</span>
                </div>
                <div className="text-2xl font-black text-slate-900 mb-2">12.4%</div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12.4%' }} />
                </div>
                <div className="text-[9px] text-slate-400 mt-2 font-mono">iThenticate DB Verified</div>
              </div>
            </div>
          </motion.div>

          {/* Sobiad Card (Bottom Left 1x1 card) */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-slate-300 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="bg-sky-50/50 border border-sky-100/50 rounded-2xl p-4 mb-6 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-semibold">Sobiad Indexer</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Metadata Push</span>
                    <span className="text-slate-600 font-medium">Completed</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Citation Links</span>
                    <span className="text-slate-600 font-medium">Mapped</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1 text-sky-600 font-bold text-[10px] uppercase tracking-widest mb-2">
                <Database className="w-3 h-3" /> Indexing Gateways
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5 tracking-tight">Sobiad Indexing</h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">Direct metadata push to citation indexing gateways.</p>
            </div>
          </motion.div>

          {/* Mass Mailer Card (Bottom Right 1x1 card) */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-slate-300 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="bg-purple-50/50 border border-purple-100/50 rounded-2xl p-4 mb-6 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-purple-600" />
                  <span>Mailer Queue</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono space-y-1">
                  <div className="flex justify-between">
                    <span>INVITE_091</span>
                    <span className="text-emerald-600">DELIVERED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>REMINDER_02</span>
                    <span className="text-amber-600">PENDING</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1 text-purple-600 font-bold text-[10px] uppercase tracking-widest mb-2">
                <Mail className="w-3 h-3" /> Communication
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5 tracking-tight">Mass Mailer Engine</h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">High-deliverability encrypted hub for reviewer invitations.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}

