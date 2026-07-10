import { useState, useEffect } from 'react';
import { Search, ChevronDown, CheckCircle2, Link2, Shield, Database, Mail, ArrowRight, Sparkles, TrendingUp, BarChart3, Globe, BookOpen, Fingerprint, Zap } from 'lucide-react';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // Removed scrollRef

  // Handle scroll for navbar glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse for dynamic radial gradients on Bento cards
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Removed scroll function

  const journals = [
    { id: 'JS', name: 'Journal of Space Exploration', tr: 'Uzay Keşifleri Dergisi', issn: '2845-901X', index: 'Scopus Indexed', indexColor: 'text-emerald-700 bg-emerald-50 border-emerald-200', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop' },
    { id: 'AM', name: 'Annals of Modern Medicine', tr: 'Modern Tıp Yıllıkları', issn: '1992-0453', index: 'Web of Science', indexColor: 'text-blue-700 bg-blue-50 border-blue-200', cover: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop' },
    { id: 'ET', name: 'Engineering & Tech Review', tr: 'Mühendislik ve Teknoloji İncelemeleri', issn: '3012-7822', index: 'Crossref Pending', indexColor: 'text-amber-700 bg-amber-50 border-amber-200', cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop' },
    { id: 'QC', name: 'Quantum Computing Letters', tr: 'Kuantum Hesaplama Mektupları', issn: '4451-229X', index: 'Scopus Indexed', indexColor: 'text-emerald-700 bg-emerald-50 border-emerald-200', cover: 'https://images.unsplash.com/photo-1614935151651-0bea6508ab6b?q=80&w=600&auto=format&fit=crop' },
    { id: 'ES', name: 'Earth & Environmental Science', tr: 'Dünya ve Çevre Bilimleri', issn: '5512-8812', index: 'Web of Science', indexColor: 'text-blue-700 bg-blue-50 border-blue-200', cover: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=600&auto=format&fit=crop' },
    { id: 'AI', name: 'Artificial Intelligence Horizon', tr: 'Yapay Zeka Ufku', issn: '9912-445X', index: 'Scopus Indexed', indexColor: 'text-emerald-700 bg-emerald-50 border-emerald-200', cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 relative overflow-hidden">

      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] -z-20" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-sky-400/15 blur-[120px] rounded-full -z-10 pointer-events-none animate-float" />
      <div className="absolute top-96 -right-64 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* --- Ultra Premium Floating Pill Navbar --- */}
      <nav className={`fixed z-50 transition-all duration-500 left-1/2 -translate-x-1/2 max-w-[1200px] w-[calc(100%-2rem)] flex items-center justify-between ${scrolled ? 'top-4 bg-white/90 backdrop-blur-2xl border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] py-3 px-4 rounded-[2.5rem]' : 'top-6 bg-white border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] py-3.5 px-5 rounded-[2.5rem]'}`}>

        <div className="flex items-center gap-3 cursor-pointer group pl-2">
          <div className="flex gap-[3px] items-center">
            <div className="w-1.5 h-7 bg-indigo-600 rounded-full group-hover:h-8 group-hover:bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
            <div className="w-1.5 h-5 bg-sky-400 rounded-full group-hover:h-7 group-hover:bg-sky-300 transition-all duration-300 delay-75 shadow-[0_0_10px_rgba(56,189,248,0.4)]" />
            <div className="w-1.5 h-6 bg-indigo-300 rounded-full group-hover:h-5 group-hover:bg-indigo-200 transition-all duration-300 delay-150" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-950 transition-colors">
            Academia<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500 animate-gradient-x bg-[length:200%_auto]">Nexus</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
          <a href="#" className="hover:text-indigo-600 transition-colors py-2">Journals Directory</a>
          <a href="#" className="hover:text-indigo-600 transition-colors py-2">Early Access</a>
          <a href="#" className="hover:text-indigo-600 transition-colors py-2">Pricing</a>
        </div>

        <div className="flex items-center gap-2.5 pr-1">
          <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-700 text-xs font-black tracking-widest uppercase rounded-full hover:bg-slate-100 transition-colors border border-slate-200/50 cursor-pointer shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            Log In
          </button>
          <button className="relative group overflow-hidden px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-full shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_-5px_rgba(79,70,229,0.4)] transition-all duration-300 cursor-pointer flex items-center gap-2">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">Apply Journal</span>
          </button>
        </div>
      </nav>

      <main className="pb-24 pt-24">
        {/* --- Hero Section --- */}
        <section className="pt-3 pb-16 px-4 text-center max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-600 text-sm font-bold mb-8 shadow-sm animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-indigo-600">Redefining Academic Publishing Infrastructure</span>
          </div>

          <h1 className="text-[3.5rem] md:text-[5.5rem] leading-[1.05] font-black tracking-tight text-slate-900 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            The New Standard in <br />
            <span className="relative">
              <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-indigo-500 to-sky-400 opacity-20"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-400 animate-gradient-x bg-[length:200%_auto]">Academic Publishing</span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 mb-8 max-w-3xl mx-auto leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            An enterprise-grade, multi-tenant journal management platform. Experience double-blind peer review, automated DOIs, and global indexing in one unified ecosystem.
          </p>

          {/* Social Proof / Avatars */}
          <div className="flex items-center justify-center gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <img key={i} className="w-10 h-10 rounded-full border-2 border-slate-50 ring-2 ring-white/50 shadow-sm" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-500 mt-0.5">Trusted by <span className="text-slate-800">10,000+</span> researchers</p>
            </div>
          </div>

          {/* Search Bar - Command Palette Style */}
          <div className="max-w-3xl mx-auto relative group animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-500 rounded-[1.75rem] blur-md opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white/90 backdrop-blur-2xl p-2.5 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 flex items-center transition-all focus-within:bg-white focus-within:shadow-[0_8px_40px_rgba(79,70,229,0.15)] focus-within:border-indigo-200">
              <button className="flex items-center gap-2 px-5 py-4 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-xl transition-colors shrink-0 cursor-pointer">
                Query by DOI <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />
              <div className="flex-1 flex items-center px-4 relative">
                <Search className="w-5 h-5 text-indigo-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search across 100+ indexed journals..."
                  className="w-full bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400 text-lg font-medium"
                />
              </div>
              <button className="px-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 shrink-0 cursor-pointer overflow-hidden group/btn ml-2">
                <span className="relative z-10 flex items-center gap-2">Search <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></span>
              </button>
            </div>
          </div>

          {/* Trending */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm mt-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-1.5 text-slate-400 font-bold mr-2 uppercase tracking-wider text-xs">
              <TrendingUp className="w-4 h-4" /> Trending
            </div>
            {['Machine Learning', '10.1016/j.cell', 'Neuroscience', 'Quantum Computing'].map(tag => (
              <span key={tag} className="px-5 py-2 bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-full hover:border-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 text-slate-600 font-bold transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5">
                {tag}
              </span>
            ))}
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
          </div>
        </section>

        {/* --- Bento Box Marketplace --- */}
        <section className="max-w-7xl mx-auto px-4 py-16 mb-20 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Integrated Academic Marketplace</h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Everything required to run a high-impact journal, seamlessly bundled into a single streamlined architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Massive Hero Card */}
            <div
              onMouseMove={handleMouseMove}
              className="md:col-span-2 md:row-span-2 bg-slate-950 p-10 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group cursor-pointer"
            >
              {/* Dynamic Mouse Gradient */}
              <div
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]"
                style={{
                  background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99,102,241,0.15), transparent 40%)`
                }}
              />
              {/* Decorative Mesh */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e511_1px,transparent_1px),linear-gradient(to_bottom,#4f46e511_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 group-hover:opacity-60 transition-opacity duration-700"></div>

              <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000">
                <Link2 className="w-80 h-80 text-indigo-400" />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-end">
                <div className="flex-1 flex items-start">
                  <div className="w-16 h-16 bg-indigo-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-indigo-400/30 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                    <Link2 className="w-8 h-8 text-indigo-300" />
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-4xl font-black text-white mb-5 leading-tight group-hover:text-indigo-300 transition-colors duration-500">Crossref DOI Automation</h3>
                  <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-md">
                    Auto-mint and register Digital Object Identifiers instantly upon publication approval. Completely native integration.
                  </p>
                </div>
              </div>
            </div>

            {/* Top Right Horizontal Card */}
            <div className="md:col-span-2 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-indigo-300/50 transition-all duration-300 group cursor-pointer flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[80px] rounded-full group-hover:bg-rose-500/10 transition-colors duration-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-8 relative z-10">
                <div className="w-20 h-20 bg-rose-50 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-rose-100 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <Shield className="w-10 h-10 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-rose-600 transition-colors">iThenticate Webhooks</h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-lg">
                    Automated plagiarism detection pipeline natively integrated into the pre-check flow.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Two Square Cards */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-indigo-300/50 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-sky-500/5 blur-[40px] rounded-full group-hover:bg-sky-500/20 transition-colors duration-500"></div>
              <div className="w-14 h-14 bg-sky-50 rounded-[1rem] flex items-center justify-center mb-8 border border-sky-100 shadow-sm group-hover:scale-110 group-hover:bg-sky-500 group-hover:border-sky-500 transition-all duration-500 relative z-10">
                <Database className="w-7 h-7 text-sky-500 group-hover:text-white transition-colors duration-500" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-sky-600 transition-colors">Sobiad Indexing</h3>
                <p className="text-base text-slate-500 font-medium leading-relaxed">Direct metadata push to citation indexing gateways.</p>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-indigo-300/50 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 blur-[40px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-500"></div>
              <div className="w-14 h-14 bg-purple-50 rounded-[1rem] flex items-center justify-center mb-8 border border-purple-100 shadow-sm group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-purple-500 group-hover:border-purple-500 transition-all duration-500 relative z-10">
                <Mail className="w-7 h-7 text-purple-500 group-hover:text-white transition-colors duration-500" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-purple-600 transition-colors">Mass Mailer Engine</h3>
                <p className="text-base text-slate-500 font-medium leading-relaxed">High-deliverability encrypted hub for reviewer invitations.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Ultra Premium Footer --- */}
      <footer className="relative bg-slate-950 pt-20 pb-10 border-t border-slate-800/50 overflow-hidden mt-20">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
            
            {/* Brand Section */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 cursor-pointer mb-6 group inline-flex">
                  <div className="flex gap-[3px] items-center">
                    <div className="w-1.5 h-7 bg-indigo-500 rounded-full group-hover:h-8 group-hover:bg-indigo-400 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.3)]" />
                    <div className="w-1.5 h-5 bg-sky-400 rounded-full group-hover:h-7 group-hover:bg-sky-300 transition-all duration-300 delay-75 shadow-[0_0_10px_rgba(56,189,248,0.3)]" />
                    <div className="w-1.5 h-6 bg-indigo-300 rounded-full group-hover:h-5 group-hover:bg-indigo-200 transition-all duration-300 delay-150" />
                  </div>
                  <span className="text-2xl font-black tracking-tight text-white group-hover:text-indigo-50 transition-colors">
                    Academia<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400 animate-gradient-x bg-[length:200%_auto]">Nexus</span>
                  </span>
                </div>
                <p className="text-slate-400 text-base leading-relaxed font-medium max-w-sm">
                  The next-generation infrastructure for academic publishing. Streamlining peer review, indexing, and dissemination globally.
                </p>
              </div>
              
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
                <h4 className="text-slate-50 font-bold tracking-wider text-sm uppercase mb-2">Platform</h4>
                <a href="/sistem-ozellikleri" className="text-slate-400 hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-500 transition-all duration-300"></span> System Features
                </a>
                <a href="/entegrasyonlar" className="text-slate-400 hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-500 transition-all duration-300"></span> Integrations
                </a>
                <a href="/early-access" className="text-slate-400 hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-500 transition-all duration-300"></span> Early Access
                </a>
              </div>
              
              <div className="flex flex-col gap-4">
                <h4 className="text-slate-50 font-bold tracking-wider text-sm uppercase mb-2">Resources</h4>
                <a href="/basvurular" className="text-slate-400 hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-500 transition-all duration-300"></span> Journal Applications
                </a>
                <a href="#" className="text-slate-400 hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-500 transition-all duration-300"></span> Technical Docs
                </a>
                <a href="#" className="text-slate-400 hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-500 transition-all duration-300"></span> API Reference
                </a>
              </div>
            </div>

          </div>
          
          <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-slate-600" />
              &copy; 2026 AcademiaNexus. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
}
