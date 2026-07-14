import { useState, useEffect } from 'react';
import { 
  Globe, Check, ChevronDown, CheckCircle2,
  Fingerprint, Network, Database, Shield, Activity, RefreshCw, Send,
  Cpu, FileCode, CheckSquare, Mail, Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

const dict = {
  EN: {
    nav: { journals: "Journals Directory", sys: "System Features", early: "Early Access", pricing: "Pricing", login: "Log In", apply: "Submit Manuscript" },
    hero: { badge: "Core Ecosystem", title: "Technical Integrations", desc: "Discover how novaijournal seamlessly connects with global academic standards, data gateways, and verification hubs." },
    crossref: { 
      title: "Crossref DOI Automation", 
      desc: "Instant minting pipeline. A valid DOI metadata token is generated seamlessly the moment a manuscript transitions to accepted status.",
      step1: "Accepted", step2: "Metadata Hashed", step3: "DOI Minted", step4: "Live Index"
    },
    ithenticate: {
      title: "iThenticate Plagiarism Scan",
      desc: "Native pristine evaluation UI demonstrating exact similarity percentage gauges and dynamic citation exclusion filters.",
      simTitle: "Similarity Index", filters: "Active Filters", excludeQuotes: "Exclude Quotes", excludeBib: "Exclude Bibliography"
    },
    sobiad: {
      title: "Sobiad Citation Indexing",
      desc: "Premium data widget tracking real-time impact factors and verifying metadata push status logs.",
      impact: "Impact Factor Tracker", pushLog: "Metadata Push Logs", success: "Sync Successful", pending: "Sync Pending"
    },
    mailer: {
      title: "100K Academic Mass Mailer",
      desc: "Encrypted delivery hub simulating high-volume deliverability queues and reviewer invitation dispatches.",
      queue: "Dispatch Queue", status: "Status", rate: "Deliverability Rate", enc: "TLS 1.3 Encrypted"
    },
    footer: { platform: "Platform", sys: "System Features", int: "Integrations", early: "Early Access", res: "Resources", apply: "Author Applications", docs: "Technical Docs", api: "API Reference", rights: "All rights reserved.", terms: "Terms of Service", privacy: "Privacy Policy", cookies: "Cookie Settings", desc: "The next-generation infrastructure for academic publishing. Streamlining peer review, indexing, and dissemination globally." }
  },
  TR: {
    nav: { journals: "Dergiler Dizini", sys: "Sistem Özellikleri", early: "Erken Erişim", pricing: "Fiyatlandırma", login: "Giriş Yap", apply: "Yazar Başvurusu" },
    hero: { badge: "Temel Ekosistem", title: "Teknik Entegrasyonlar", desc: "novaijournal'un küresel akademik standartlar, veri ağ geçitleri ve doğrulama merkezleriyle nasıl sorunsuz bağlantı kurduğunu keşfedin." },
    crossref: { 
      title: "Crossref DOI Otomasyonu", 
      desc: "Anında oluşturma boru hattı. Bir makale kabul durumuna geçtiği an sorunsuz bir şekilde geçerli bir DOI meta veri belirteci oluşturulur.",
      step1: "Kabul Edildi", step2: "Meta Veri Şifrelendi", step3: "DOI Oluşturuldu", step4: "Canlı İndeks"
    },
    ithenticate: {
      title: "iThenticate İntihal Taraması",
      desc: "Kesin benzerlik yüzdesi göstergelerini ve dinamik alıntı hariç tutma filtrelerini gösteren yerel temiz değerlendirme arayüzü.",
      simTitle: "Benzerlik Endeksi", filters: "Aktif Filtreler", excludeQuotes: "Alıntıları Hariç Tut", excludeBib: "Kaynakçayı Hariç Tut"
    },
    sobiad: {
      title: "Sobiad Atıf İndeksleme",
      desc: "Gerçek zamanlı etki faktörlerini izleyen ve meta veri aktarım durumu günlüklerini doğrulayan premium veri bileşeni.",
      impact: "Etki Faktörü Takibi", pushLog: "Meta Veri Aktarım Günlükleri", success: "Eşitleme Başarılı", pending: "Eşitleme Bekleniyor"
    },
    mailer: {
      title: "100B Akademik Toplu Posta",
      desc: "Yüksek hacimli teslimat kuyruklarını ve hakem daveti gönderimlerini simüle eden şifreli teslimat merkezi.",
      queue: "Gönderim Kuyruğu", status: "Durum", rate: "Teslimat Oranı", enc: "TLS 1.3 Şifreli"
    },
    footer: { platform: "Platform", sys: "Sistem Özellikleri", int: "Entegrasyonlar", early: "Erken Erişim", res: "Kaynaklar", apply: "Yazar Başvuruları", docs: "Teknik Dokümanlar", api: "API Referansı", rights: "Tüm hakları saklıdır.", terms: "Hizmet Şartları", privacy: "Gizlilik Politikası", cookies: "Çerez Ayarları", desc: "Akademik yayıncılık için yeni nesil altyapı. Hakem değerlendirmesi, indeksleme ve yayımı küresel olarak kolaylaştırıyor." }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Integrations() {
  const [lang, setLangState] = useState<'EN' | 'TR'>(
    () => (localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR'
  );
  const setLang = (l: 'EN' | 'TR') => {
    localStorage.setItem('app_lang', l);
    setLangState(l);
    window.dispatchEvent(new Event('lang-change'));
  };

  useEffect(() => {
    const handleLangChange = () => {
      setLangState((localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR');
    };
    window.addEventListener('lang-change', handleLangChange);
    return () => window.removeEventListener('lang-change', handleLangChange);
  }, []);
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const t = dict[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    window.scrollTo(0, 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 relative overflow-hidden flex flex-col">
      {/* Ambient Noise & Gradients */}
      <div className="fixed inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] -z-20 opacity-40 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-sky-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Navbar Reused */}
      

      {/* Main Presentation Showroom */}
      <main className="flex-1 pt-40 pb-24 px-6 flex flex-col items-center max-w-[1300px] mx-auto w-full z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-600 text-sm font-bold mb-6 shadow-sm">
            <Network className="w-4 h-4" />
            <span>{t.hero.badge}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">{t.hero.title}</h1>
          <p className="text-lg md:text-xl font-medium text-slate-500">{t.hero.desc}</p>
        </motion.div>

        {/* Bento Grid layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8" onMouseMove={handleMouseMove}>
          
          {/* 1. Crossref DOI Automation */}
          <motion.div 
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
            className="group relative bg-white border border-slate-200/80 rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] hover:border-indigo-200 transition-all duration-500 overflow-hidden flex flex-col"
          >
            <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none" style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99,102,241,0.06), transparent 40%)` }} />
            
            <div className="relative z-10 mb-10">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                <Network className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">{t.crossref.title}</h3>
              <p className="text-base font-medium text-slate-500 leading-relaxed">{t.crossref.desc}</p>
            </div>

            {/* Visual Pipeline Mockup */}
            <div className="relative z-10 mt-auto bg-slate-50 rounded-2xl border border-slate-100 p-6">
              <div className="flex justify-between items-center relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0 overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-1/2 h-full bg-indigo-500/50 blur-sm"
                  />
                </div>
                {/* Pipeline Steps */}
                {[
                  { icon: FileCode, label: t.crossref.step1, active: true },
                  { icon: Shield, label: t.crossref.step2, active: true },
                  { icon: Cpu, label: t.crossref.step3, active: true },
                  { icon: Globe, label: t.crossref.step4, active: true }
                ].map((step, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-slate-50 shadow-sm ${step.active ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 max-w-[60px] text-center leading-tight">{step.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm group/doi cursor-pointer hover:border-indigo-300 transition-colors">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Generated Token</span>
                  <span className="font-mono text-sm font-semibold text-slate-700">10.1038/s41586-026-0000-1</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. iThenticate Plagiarism Scan */}
          <motion.div 
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
            className="group relative bg-white border border-slate-200/80 rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] hover:border-indigo-200 transition-all duration-500 overflow-hidden flex flex-col"
          >
            <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none" style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99,102,241,0.06), transparent 40%)` }} />
            
            <div className="relative z-10 mb-10">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm">
                <Eye className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">{t.ithenticate.title}</h3>
              <p className="text-base font-medium text-slate-500 leading-relaxed">{t.ithenticate.desc}</p>
            </div>

            {/* Pristine UI Card Mockup */}
            <div className="relative z-10 mt-auto bg-slate-900 rounded-2xl p-8 text-white shadow-xl overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{t.ithenticate.simTitle}</h4>
                  <div className="text-4xl font-black text-white flex items-baseline gap-1">
                    4<span className="text-2xl text-slate-400">%</span>
                  </div>
                </div>
                
                {/* Circular Gauge */}
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#334155" strokeWidth="8" />
                    <motion.circle 
                      cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="8" 
                      strokeDasharray="251.2" strokeDashoffset="241"
                      className="drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-800">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{t.ithenticate.filters}</div>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <CheckSquare className="w-3.5 h-3.5" /> {t.ithenticate.excludeQuotes}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <CheckSquare className="w-3.5 h-3.5" /> {t.ithenticate.excludeBib}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. Sobiad Citation Indexing */}
          <motion.div 
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
            className="group relative bg-white border border-slate-200/80 rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] hover:border-indigo-200 transition-all duration-500 overflow-hidden flex flex-col"
          >
            <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none" style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99,102,241,0.06), transparent 40%)` }} />
            
            <div className="relative z-10 mb-10">
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center border border-sky-100 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm">
                <Database className="w-8 h-8 text-sky-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">{t.sobiad.title}</h3>
              <p className="text-base font-medium text-slate-500 leading-relaxed">{t.sobiad.desc}</p>
            </div>

            {/* Premium Data Widget */}
            <div className="relative z-10 mt-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t.sobiad.impact}</h4>
                  <div className="text-3xl font-black text-slate-900 flex items-center gap-2">
                    1.485 <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">+0.12</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Activity className="w-5 h-5 text-indigo-500" />
                </div>
              </div>
              
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                  {t.sobiad.pushLog}
                  <RefreshCw className="w-3 h-3 cursor-pointer hover:text-indigo-500 transition-colors" />
                </h4>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between bg-white px-3 py-2.5 rounded-xl border border-slate-100 shadow-sm text-xs font-medium">
                    <span className="font-mono text-slate-600">ID: SO-9912A</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded"><CheckCircle2 className="w-3 h-3" /> {t.sobiad.success}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white px-3 py-2.5 rounded-xl border border-slate-100 shadow-sm text-xs font-medium opacity-60">
                    <span className="font-mono text-slate-600">ID: SO-9912B</span>
                    <span className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded"><RefreshCw className="w-3 h-3 animate-spin" /> {t.sobiad.pending}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4. 100K Academic Mass Mailer */}
          <motion.div 
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
            className="group relative bg-white border border-slate-200/80 rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] hover:border-indigo-200 transition-all duration-500 overflow-hidden flex flex-col"
          >
            <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none" style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99,102,241,0.06), transparent 40%)` }} />
            
            <div className="relative z-10 mb-10">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">{t.mailer.title}</h3>
              <p className="text-base font-medium text-slate-500 leading-relaxed">{t.mailer.desc}</p>
            </div>

            {/* Clean Console Layout */}
            <div className="relative z-10 mt-auto bg-slate-900 p-6 rounded-2xl shadow-xl overflow-hidden">
               <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                 <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                   <span className="text-xs font-bold text-white uppercase tracking-wider">{t.mailer.queue}</span>
                 </div>
                 <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                   <Shield className="w-3 h-3 text-emerald-400" /> {t.mailer.enc}
                 </div>
               </div>

               <div className="font-mono text-xs flex flex-col gap-2">
                 <div className="flex items-center justify-between p-2 hover:bg-slate-800/50 rounded-lg transition-colors group/row">
                   <div className="flex items-center gap-2">
                     <Send className="w-3.5 h-3.5 text-indigo-400" />
                     <span className="text-slate-300">REQ_9941_INVITE</span>
                   </div>
                   <span className="text-emerald-400 font-bold tracking-wider">SENT</span>
                 </div>
                 <div className="flex items-center justify-between p-2 hover:bg-slate-800/50 rounded-lg transition-colors group/row">
                   <div className="flex items-center gap-2">
                     <Send className="w-3.5 h-3.5 text-indigo-400" />
                     <span className="text-slate-300">REQ_9942_UPDATE</span>
                   </div>
                   <span className="text-emerald-400 font-bold tracking-wider">SENT</span>
                 </div>
                 <div className="flex items-center justify-between p-2 hover:bg-slate-800/50 rounded-lg transition-colors group/row">
                   <div className="flex items-center gap-2">
                     <Send className="w-3.5 h-3.5 text-slate-600" />
                     <span className="text-slate-500">REQ_9943_BATCH</span>
                   </div>
                   <span className="text-amber-400 font-bold tracking-wider animate-pulse">Q'ED</span>
                 </div>
               </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer Reused */}
      
    </div>
  );
}
