import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Globe, Zap, Sparkles, ChevronDown, Award, Users, BookOpen, Cpu, Activity } from 'lucide-react';

const dict = {
  EN: {
    badge: "AcademiaNexus Ecosystem Altyapısı",
    title: "Pioneering the Next Era of Academic Publishing",
    subtitle: "A secure, decentralized, and highly automated multi-tenant infrastructure designed for global scientific impact.",
    
    sectionMission: "Our Editorial Philosophy",
    missionText1: "At AcademiaNexus, we believe that scientific knowledge is a global public good. Our mission is to dismantle the barriers of traditional publishing by providing academic institutions, research hubs, and independent publishers with state-of-the-art multi-tenant software that streamlines the entire editorial lifecycle.",
    missionText2: "By automating metadata registry, double-blind peer review assignment, similarity index checks, and database indexing, we allow editorial boards to focus on what truly matters: selecting and nurturing high-impact scientific work.",
    
    pillarsTitle: "Core Operating Principles",
    pillars: [
      { title: "Academic Integrity First", desc: "Every manuscript goes through a strict automated pipeline involving iThenticate verification, reviewer blinding validation, and encrypted logs to prevent bias.", icon: Shield },
      { title: "Frictionless Open Access", desc: "We support the gold open access standard, offering immediate dissemination under Creative Commons licenses with direct indexing to global databases.", icon: Globe },
      { title: "Deep Automation Integration", desc: "No manual metadata forms. Our system automatically registers DOIs via Crossref API, formats XML JATS files, and pushes citation maps to indexing engines.", icon: Zap }
    ],

    playgroundTitle: "Interactive Role Simulator",
    playgroundSubtitle: "Select a platform role to visualize their automated workflow in real-time.",
    roles: {
      author: {
        title: "Author Workspace",
        steps: [
          { name: "Submission", desc: "Drag & drop manuscript; system automatically extracts title, abstract, and references using OCR." },
          { name: "Pre-check", desc: "Auto-blinding engine strips metadata; webhooks run similarity checks instantly." },
          { name: "Revision", desc: "Collaboratively upload new drafts responding to blinded reviewer comments directly in the portal." }
        ]
      },
      reviewer: {
        title: "Reviewer Portal",
        steps: [
          { name: "Secure Invite", desc: "Receive email token; preview blinded abstract before accepting the assignment." },
          { name: "Evaluation", desc: "Submit structured assessment and recommendations via encrypted secure forms." },
          { name: "Anonymity", desc: "Communicate with editors through masked cryptographic chat tunnels." }
        ]
      },
      editor: {
        title: "Editorial Desk",
        steps: [
          { name: "AI Suggestion", desc: "Editor views matching reviewers suggested by automated keyword extraction." },
          { name: "Peer Review Sync", desc: "Track reviewer progress, send automated reminders, and compile responses." },
          { name: "Publication & DOI", desc: "One-click approval mints DOI via Crossref, compiles XML JATS, and indexes the paper." }
        ]
      }
    },

    timelineTitle: "The Manuscript Journey",
    timelineSubtitle: "How AcademiaNexus orchestrates the lifecycle of scientific research from draft to global impact.",
    timeline: [
      { step: "01", title: "Submission & Pre-Check", desc: "The author submits their manuscript. The system automatically extracts metadata, validates files, runs plagiarism checks via webhooks, and blinds the document for peer review." },
      { step: "02", title: "Editorial Assessment & Assignment", desc: "The section editor reviews the initial validation and assigns matching peer reviewers using an AI-assisted suggestion engine based on academic interest tags." },
      { step: "03", title: "Double-Blind Evaluation", desc: "Reviewers assess the paper securely. All communication is routed through encrypted threads to protect reviewer and author identities, ensuring objective evaluation." },
      { step: "04", title: "Production & Global Indexing", desc: "Upon editorial approval, the paper enters layout editing. The system mints a live DOI from Crossref, compiles JATS XML, and pushes metadata to Sobiad, Scopus, and citation indexes." }
    ],

    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Detailed insights into our architecture, security, and integration capabilities.",
    faqs: [
      { q: "How does the multi-tenant system work?", a: "AcademiaNexus utilizes a multi-tenant PostgreSQL schema linked with Supabase. Each journal operates on its own secure subdomain or slug (e.g., /journal-of-tech), possessing independent editorial boards, reviewers, and theme customizers, while sharing a robust core API." },
      { q: "Is the peer review process truly anonymous?", a: "Yes. Our system strips all document metadata (author names, institutions, document properties) during the submission pre-check. Reviewers communicate via secure messaging threads where identities are cryptographically masked." },
      { q: "Can we integrate with custom indexing systems?", a: "Absolutely. Our platform is built with a webhook-driven architecture. Whenever a paper is marked as 'Published', XML metadata is automatically compiled and pushed to registries like Crossref, Sobiad, and customizable citation endpoints." },
      { q: "What format standards do you support for galleys?", a: "We support PDF, HTML, and JATS XML. The system contains an experimental parser that converts structured Word/Markdown documents into standard JATS XML to ensure long-term digital preservation." }
    ]
  },
  TR: {
    badge: "AcademiaNexus Altyapısı",
    title: "Akademik Yayımcılığın Geleceği",
    subtitle: "Modern küresel araştırmalar için güvenli, merkeziyetsiz ve yüksek düzeyde otomatikleştirilmiş yayın ekosistemlerine öncülük ediyoruz.",
    
    sectionMission: "Misyonumuz ve Vizyonumuz",
    missionText1: "AcademiaNexus olarak, bilimsel bilginin küresel bir kamu yararı olduğuna inanıyoruz. Misyonumuz, akademik kurumlara, araştırma merkezlerine ve bağımsız yayıncılara tüm editoryal yaşam döngüsünü kolaylaştıran modern ve çok kiracılı (multi-tenant) yazılımlar sunarak geleneksel yayıncılığın engellerini ortadan kaldırmaktır.",
    missionText2: "Üstveri kaydını, çift-kör hakem atamalarını, benzerlik endeksi kontrollerini ve veritabanı indekslemelerini otomatikleştirerek, editoryal kurulların yalnızca en önemli konuya odaklanmasını sağlıyoruz: yüksek etkili bilimsel çalışmaları seçmek ve geliştirmek.",
    
    pillarsTitle: "Temel Çalışma İlkelerimiz",
    pillars: [
      { title: "Öncelik Akademik Dürüstlük", desc: "Her taslak; iThenticate doğrulaması, hakem kimliği gizlilik kontrolleri ve yanlılığı önlemek için şifrelenmiş kayıtlar içeren sıkı bir otomatik süreçten geçer.", icon: Shield },
      { title: "Engelsiz Açık Erişim", desc: "Küresel bilgi erişilebilirliğini desteklemek amacıyla, Creative Commons lisansları altında anında yayım ve küresel veritabanlarına doğrudan indeksleme sunuyoruz.", icon: Globe },
      { title: "Derin Otomasyon Entegrasyonu", desc: "Manuel üstveri formlarına son. Sistemimiz, yayın onayının ardından Crossref API aracılığıyla DOI'leri anında kaydeder, XML JATS dosyalarını oluşturur ve atıf haritalarını indeksleme motorlarına iletir.", icon: Zap }
    ],

    playgroundTitle: "Etkileşimli Rol Simülatörü",
    playgroundSubtitle: "Platformdaki rollerin otomatik iş akışını gerçek zamanlı izlemek için bir rol seçin.",
    roles: {
      author: {
        title: "Yazar İş Akışı",
        steps: [
          { name: "Makale Gönderimi", desc: "Makaleyi sürükleyip bırakın; sistem OCR kullanarak başlık, özet ve referansları otomatik ayıklar." },
          { name: "Ön Kontrol", desc: "Kimlik arındırma motoru tüm üstverileri siler; webhook'lar benzerlik taramasını anında çalıştırır." },
          { name: "Revizyon Süreci", desc: "Kör hakem yorumlarına doğrudan portal üzerinden yanıt vererek yeni taslakları ortaklaşa yükleyin." }
        ]
      },
      reviewer: {
        title: "Hakem Portalı",
        steps: [
          { name: "Güvenli Davet", desc: "E-posta davetini alın; görevi kabul etmeden önce kimliksizleştirilmiş özeti önizleyin." },
          { name: "Değerlendirme", desc: "Şifreli güvenli formlar aracılığıyla yapılandırılmış değerlendirme ve önerilerinizi sunun." },
          { name: "Gizlilik Güvencesi", desc: "Editörlerle kimliklerin maskelendiği şifreli mesajlaşma kanalları üzerinden iletişim kurun." }
        ]
      },
      editor: {
        title: "Editör Masası",
        steps: [
          { name: "Yapay Zeka Önerisi", desc: "Editör, otomatik anahtar kelime çıkarımına dayalı olarak önerilen en uygun hakemleri görür." },
          { name: "Hakem Takibi", desc: "Hakem ilerlemesini izleyin, otomatik hatırlatıcılar gönderin ve yanıtları konsolide edin." },
          { name: "Yayın ve DOI", desc: "Tek tıkla onay, Crossref üzerinden DOI atar, JATS XML derler ve çalışmayı indeksler." }
        ]
      }
    },

    timelineTitle: "Makalenin Yaşam Döngüsü",
    timelineSubtitle: "AcademiaNexus'un bilimsel araştırmaları taslaktan küresel etkiye ulaştırırken izlediği aşamalar.",
    timeline: [
      { step: "01", title: "Gönderim ve Ön Değerlendirme", desc: "Yazar çalışmasını sisteme yükler. Sistem otomatik olarak üstverileri ayıklar, dosyaları doğrular, web hook'lar aracılığıyla intihal kontrolünü çalıştırır ve hakem değerlendirmesi için dosyayı kimlikten arındırır." },
      { step: "02", title: "Editoryal İnceleme ve Atama", desc: "Alan editörü ilk doğrulama raporunu inceler ve akademik ilgi alanlarına göre yapay zeka destekli öneri motorunu kullanarak makaleye en uygun hakemleri belirler." },
      { step: "03", title: "Çift-Kör Hakem Değerlendirmesi", desc: "Hakemler çalışmayı güvenli bir şekilde değerlendirir. Hakem ve yazar kimliklerini korumak için tüm iletişim şifreli mesajlaşma kanalları üzerinden yürütülür, tarafsızlık garanti edilir." },
      { step: "04", title: "Yayın ve Küresel İndeksleme", desc: "Editoryal onay alındıktan sonra çalışma mizanpaj aşamasına geçer. Sistem Crossref'ten canlı DOI oluşturur, JATS XML derlemesini yapar ve üstverileri Sobiad, Scopus ve atıf dizinlerine iletir." }
    ],

    faqTitle: "Sıkça Sorulan Sorular",
    faqSubtitle: "Mimarimiz, güvenliğimiz ve entegrasyon yeteneklerimiz hakkında detaylı bilgiler.",
    faqs: [
      { q: "Çok kiracılı (multi-tenant) sistem nasıl çalışır?", a: "AcademiaNexus, Supabase ile bağlantılı çok kiracılı bir PostgreSQL şeması kullanır. Her dergi kendi güvenli alt alan adında (örneğin /dergi-adi) çalışır; bağımsız editör kurullarına, hakemlere ve arayüz özelleştiricilerine sahiptir, ancak güçlü bir merkezi API altyapısını paylaşır." },
      { q: "Hakem değerlendirme süreci gerçekten anonim mi?", a: "Evet. Sistemimiz gönderim ön değerlendirmesinde dosyanın tüm üstverilerini (yazar adları, kurumlar, dosya özellikleri) temizler. Hakemler ve yazarlar, kimliklerin kriptografik olarak gizlendiği güvenli mesajlaşma kanalları üzerinden iletişim kurar." },
      { q: "Özel indeksleme sistemlerini entegre edebilir miyiz?", a: "Kesinlikle. Platformumuz webhook tabanlı bir mimariye sahiptir. Bir makale 'Yayınlandı' olarak işaretlendiğinde, XML üstverileri otomatik olarak derlenir ve Crossref, Sobiad ve özelleştirilmiş atıf uç noktalarına gönderilir." },
      { q: "Makale formatları için hangi standartları destekliyorsunuz?", a: "PDF, HTML ve JATS XML formatlarını destekliyoruz. Sistemimiz, uzun vadeli dijital koruma sağlamak amacıyla yapılandırılmış Word/Markdown belgelerini standart JATS XML formatına dönüştüren deneysel bir dönüştürücü içerir." }
    ]
  }
};

export default function About() {
  const [lang, setLang] = useState<'EN' | 'TR'>('TR');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeRole, setActiveRole] = useState<'author' | 'reviewer' | 'editor'>('author');

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
    <main className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden bg-slate-50">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 -z-20" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-indigo-500/5 blur-[140px] rounded-full -z-10" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-sky-500/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

      {/* Floating Decorative Shapes - Ensured BookOpen & Cpu are used inside motion elements */}
      <div className="absolute top-24 left-10 w-24 h-24 rounded-full bg-indigo-50 border border-indigo-100/50 hidden md:flex items-center justify-center shadow-sm -z-10 opacity-60">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <BookOpen className="w-8 h-8 text-indigo-400" />
        </motion.div>
      </div>

      <div className="absolute top-[500px] right-12 w-28 h-28 rounded-[2rem] bg-sky-50 border border-sky-100/50 hidden md:flex items-center justify-center shadow-sm -z-10 opacity-60">
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
        >
          <Cpu className="w-10 h-10 text-sky-400" />
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto space-y-28 relative z-10">
        
        {/* Header Block */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold tracking-wide shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>{t.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 font-serif leading-tight"
          >
            {t.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-500 leading-relaxed font-normal"
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Partners Marquee Logo loop */}
        <div className="w-full overflow-hidden py-4 border-y border-slate-200/60 relative">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10" />
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
            className="flex items-center gap-16 whitespace-nowrap w-[200%]"
          >
            {[
              "SCOPUS INDEXED", "WEB OF SCIENCE", "CROSSREF DOI", "SOBIAD INDEX", "PUBMED CENTRAL", "DOAJ COMPLIANT",
              "SCOPUS INDEXED", "WEB OF SCIENCE", "CROSSREF DOI", "SOBIAD INDEX", "PUBMED CENTRAL", "DOAJ COMPLIANT"
            ].map((partner, idx) => (
              <span key={idx} className="text-xs font-black tracking-[0.25em] text-slate-400/80 font-mono flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-indigo-500/50" /> {partner}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Mission Details (Rich Content Section) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">{t.sectionMission}</h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
              {t.missionText1}
            </p>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-normal">
              {t.missionText2}
            </p>
            
            <div className="flex items-center gap-8 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-indigo-600 font-bold">
                <Award className="w-5 h-5" />
                <span className="text-sm tracking-wide">ISO 27001 Secure</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <Users className="w-5 h-5" />
                <span className="text-sm tracking-wide">CC BY-NC Compatible</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-lg relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full pointer-events-none" />
            <div className="space-y-6 text-left relative z-10">
              <h3 className="font-extrabold text-slate-900 text-lg font-serif">Quick System Metrics</h3>
              <div className="space-y-4 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">UPTIME</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> 99.98%</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">AVG RESPONSE TIME</span>
                  <span className="text-slate-800">142ms</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">XML JATS EXPORT</span>
                  <span className="text-slate-800">NATIVE / JATS 1.3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DB SCHEMA TYPE</span>
                  <span className="text-slate-800">PostgreSQL (Supabase)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pillars Section */}
        <div className="space-y-12">
          <h2 className="text-3xl font-bold text-slate-900 font-serif text-center tracking-tight">{t.pillarsTitle}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200 text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                  <pillar.icon className="w-7 h-7 text-slate-700" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-base tracking-tight">{pillar.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-normal">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive Role Workflow Playground */}
        <div className="space-y-12 py-16 bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">{t.playgroundTitle}</h2>
            <p className="text-slate-500 text-sm leading-relaxed">{t.playgroundSubtitle}</p>
          </div>

          {/* Role selector tabs */}
          <div className="flex items-center justify-center gap-3 border-b border-slate-100 pb-6 max-w-md mx-auto">
            {['author', 'reviewer', 'editor'].map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role as any)}
                className={`px-5 py-2.5 rounded-full font-bold text-xs capitalize transition-all cursor-pointer ${activeRole === role ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Animated Workflow diagram grid */}
          <div className="relative pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
              >
                {t.roles[activeRole].steps.map((step, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 text-left space-y-4 flex flex-col justify-between hover:border-indigo-200 transition-colors group">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-slate-900 text-sm">{step.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="space-y-12 py-12 border-y border-slate-200/60 relative">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">{t.timelineTitle}</h2>
            <p className="text-slate-500 text-sm leading-relaxed">{t.timelineSubtitle}</p>
          </div>

          <div className="relative border-l border-slate-200 ml-4 md:ml-1/2 space-y-12 pt-8">
            {t.timeline.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`relative flex items-start ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Timeline node dot */}
                <div className="absolute left-0 top-1 -translate-x-1.5 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />

                <div className="pl-6 md:pl-0 md:px-8 w-full md:w-1/2 text-left">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow relative">
                    <span className="absolute -top-3 right-4 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-xs font-bold">
                      {item.step}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mb-2 font-serif">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Accordion FAQ Section */}
        <div className="space-y-12 max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">{t.faqTitle}</h2>
            <p className="text-slate-500 text-sm leading-relaxed">{t.faqSubtitle}</p>
          </div>

          <div className="space-y-4">
            {t.faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors"
                >
                  <span className="font-serif pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-left text-slate-500 text-xs sm:text-sm leading-relaxed font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
