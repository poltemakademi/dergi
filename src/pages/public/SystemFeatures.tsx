import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  KanbanSquare, Settings, Activity, MessageSquare, Layers,
  Plus, MoreHorizontal, FileText, UploadCloud, Users,
  Search, Paperclip, Send, AlertCircle, Calendar, BarChart3, TrendingUp,
  Bell, ChevronRight, Sparkles, Lock
} from 'lucide-react';

const dict = {
  EN: {
    nav: { journals: "Journals Directory", sys: "System Features", early: "Early Access", pricing: "Pricing", login: "Log In", apply: "Submit Manuscript" },
    page: { title: "Interactive Feature Showroom", desc: "Explore the robust multi-tenant capabilities powering our enterprise workspace." },
    tabs: {
      settings: { title: "Premium Journal Settings", sub: "Configuration Dashboard" },
      kanban: { title: "Workflow & Task Kanban", sub: "Editorial Board" },
      analytics: { title: "Modern Editorial Analytics", sub: "Data & Metrics" },
      messenger: { title: "Secure Academic Messenger", sub: "Encrypted Threads" },
      compiler: { title: "Issue Compiler Studio", sub: "Publication Assembly" },
      author: { title: "Author Submission Portal", sub: "Author Workspace" },
      reviewer: { title: "Reviewer Evaluation Desk", sub: "Reviewer Workspace" }
    },
    header: {
      search: "Search everything...",
      roles: {
        editor: { name: "Editor in Chief", title: "Admin", avatar: "E+C" },
        author: { name: "Dr. Jane Doe", title: "Corresponding Author", avatar: "J+D" },
        reviewer: { name: "Reviewer (Anonymized)", title: "Double-Blind Peer", avatar: "R" }
      }
    },
    settings: {
      saved: "Changes saved automatically",
      saveBtn: "Save Configurations",
      savedBtn: "Saved",
      title: "Journal Master Configuration",
      nativeName: "Journal Native Name (Ana Dilde Dergi Adı)",
      englishTitle: "English Title",
      issn: "E-ISSN / ISSN",
      country: "Publishing Country",
      cover: "Cover Image Asset",
      coverDrop: "Drop 800x1200px PNG/JPG",
      logo: "Journal Logo Asset",
      logoDrop: "Drop 512x512px Transparent PNG",
      targetText: "Journal of Clinical Research and Medicine"
    },
    kanban: {
      backlog: "Backlog",
      inProgress: "In Progress",
      completed: "Completed",
      drop: "Drop here",
      task1: { tag1: "Review", tag2: "High", title: "Review of Principles Charter", today: "2" },
      task2: { tag1: "Approval", title: "Batch 3 Approval", today: "Today" },
    },
    analytics: {
      totalUsers: "Total Active Users",
      totalUsersSub: "Registered Authors & Reviewers",
      active: "Active",
      velocities: "Submission Velocities",
      velocitiesUnit: "ms/mo",
      spikes: "PDF Download Spikes",
      spikesUnit: "total"
    },
    messenger: {
      thread: "Secure Thread",
      editor: "Editor (ID: 48A)",
      reviewer: "Reviewer (Anonymized)",
      msg1: "Please clarify the methodology section regarding the sample selection process.",
      msg2: "The selection process is detailed in Appendix B. However, I can augment the main text if required for clarity.",
      subject: "Subject: ",
      targetSubject: "Blinded Review Inquiry",
      placeholder: "Type your secure message..."
    },
    compiler: {
      title: "New Issue Setup",
      sub: "Volume Configuration",
      volIss: "Volume & Issue",
      execEditor: "Executive Editor",
      jenerik: "Jenerik File Asset",
      upload: "Upload PDF",
      compile: "Compile Issue",
      toc: "Table of Contents List",
      add: "Add Manuscript",
      pp: "pp."
    },
    author: {
      mySubs: "My Submissions",
      newSub: "Submit New Manuscript",
      status: "Under Review",
      title1: "Impact of AI on Healthcare",
      date1: "Submitted: 2 days ago",
      status2: "Revision Requested",
      title2: "A Novel Approach to Neural Networks",
      date2: "Submitted: 1 month ago"
    },
    reviewer: {
      evalDesk: "Evaluation Desk",
      manuscript: "Manuscript PDF",
      score: "Scoring Rubric",
      q1: "Originality of Research",
      q2: "Methodology Soundness",
      submitRev: "Submit Evaluation"
    },
    footer: { platform: "Platform", sys: "System Features", int: "Integrations", early: "Early Access", res: "Resources", apply: "Author Applications", docs: "Technical Docs", api: "API Reference", rights: "All rights reserved.", terms: "Terms of Service", privacy: "Privacy Policy", cookies: "Cookie Settings", desc: "The next-generation infrastructure for academic publishing. Streamlining peer review, indexing, and dissemination globally." }
  },
  TR: {
    nav: { journals: "Dergiler Dizini", sys: "Sistem Özellikleri", early: "Erken Erişim", pricing: "Fiyatlandırma", login: "Giriş Yap", apply: "Yazar Başvurusu" },
    page: { title: "İnteraktif Özellik Vitrini", desc: "Kurumsal çalışma alanımızı güçlendiren çok kiracılı yetenekleri keşfedin." },
    tabs: {
      settings: { title: "Premium Dergi Ayarları", sub: "Konfigürasyon" },
      kanban: { title: "İş Akışı ve Görev Kanbanı", sub: "Yayın Kurulu" },
      analytics: { title: "Modern Editoryal Analitik", sub: "Veri/Metrik" },
      messenger: { title: "Güvenli Akademik Mesajlaşma", sub: "Şifreli İletişim" },
      compiler: { title: "Sayı Derleyici Stüdyosu", sub: "Yayın Montajı" },
      author: { title: "Yazar Gönderim Portalı", sub: "Yazar Çalışma Alanı" },
      reviewer: { title: "Hakem Değerlendirme Masası", sub: "Hakem Çalışma Alanı" }
    },
    header: {
      search: "Hızlı ara...",
      roles: {
        editor: { name: "Baş Editör", title: "Yönetici", avatar: "E+C" },
        author: { name: "Dr. Ayşe Yılmaz", title: "Sorumlu Yazar", avatar: "A+Y" },
        reviewer: { name: "Hakem (Anonimleştirilmiş)", title: "Kör Hakem", avatar: "H" }
      }
    },
    settings: {
      saved: "Değişiklikler otomatik kaydedildi",
      saveBtn: "Ayarları Kaydet",
      savedBtn: "Kaydedildi",
      title: "Dergi Ana Konfigürasyonu",
      nativeName: "Ana Dilde Dergi Adı",
      englishTitle: "İngilizce Başlık",
      issn: "E-ISSN / ISSN",
      country: "Yayıncı Ülke",
      cover: "Kapak Görseli",
      coverDrop: "800x1200px PNG/JPG Sürükleyin",
      logo: "Dergi Logosu",
      logoDrop: "512x512px Şeffaf PNG Sürükleyin",
      targetText: "Klinik Araştırmalar ve Tıp Dergisi"
    },
    kanban: {
      backlog: "Bekleyenler",
      inProgress: "Devam Edenler",
      completed: "Tamamlananlar",
      drop: "Buraya bırakın",
      task1: { tag1: "İnceleme", tag2: "Yüksek", title: "İlkeler Şartı İncelemesi", today: "2" },
      task2: { tag1: "Onay", title: "3. Parti Onayı", today: "Bugün" },
    },
    analytics: {
      totalUsers: "Toplam Aktif Kullanıcı",
      totalUsersSub: "Kayıtlı Yazar ve Hakemler",
      active: "Aktif",
      velocities: "Gönderim Hızları",
      velocitiesUnit: "ms/ay",
      spikes: "PDF İndirme Artışları",
      spikesUnit: "toplam"
    },
    messenger: {
      thread: "Güvenli İş Parçacığı",
      editor: "Editör (ID: 48A)",
      reviewer: "Hakem (Anonimleştirilmiş)",
      msg1: "Lütfen örneklem seçimi süreciyle ilgili metodoloji bölümünü açıklayın.",
      msg2: "Seçim süreci Ek B'de ayrıntılı olarak açıklanmıştır. Ancak, netlik için gerekirse ana metni zenginleştirebilirim.",
      subject: "Konu: ",
      targetSubject: "Kör Hakemlik Sorgusu",
      placeholder: "Güvenli mesajınızı yazın..."
    },
    compiler: {
      title: "Yeni Sayı Kurulumu",
      sub: "Cilt Konfigürasyonu",
      volIss: "Cilt & Sayı",
      execEditor: "Sorumlu Editör",
      jenerik: "Jenerik Dosyası",
      upload: "PDF Yükle",
      compile: "Sayıyı Derle",
      toc: "İçindekiler Listesi",
      add: "Makale Ekle",
      pp: "ss."
    },
    author: {
      mySubs: "Gönderilerim",
      newSub: "Yeni Makale Gönder",
      status: "İncelemede",
      title1: "Yapay Zekanın Sağlığa Etkisi",
      date1: "Gönderim: 2 gün önce",
      status2: "Revizyon İstendi",
      title2: "Yapay Sinir Ağlarına Yeni Bir Yaklaşım",
      date2: "Gönderim: 1 ay önce"
    },
    reviewer: {
      evalDesk: "Değerlendirme Masası",
      manuscript: "Makale PDF'i",
      score: "Değerlendirme Kriterleri",
      q1: "Araştırmanın Özgünlüğü",
      q2: "Metodolojinin Sağlamlığı",
      submitRev: "Değerlendirmeyi Gönder"
    },
    footer: { platform: "Platform", sys: "Sistem Özellikleri", int: "Entegrasyonlar", early: "Erken Erişim", res: "Kaynaklar", apply: "Yazar Başvuruları", docs: "Teknik Dokümanlar", api: "API Referansı", rights: "Tüm hakları saklıdır.", terms: "Hizmet Şartları", privacy: "Gizlilik Politikası", cookies: "Çerez Ayarları", desc: "Akademik yayıncılık için yeni nesil altyapı. Hakem değerlendirmesi, indeksleme ve yayımı küresel olarak kolaylaştırıyor." }
  }
};

const TABS_CONFIG = [
  { id: 'settings', icon: Settings },
  { id: 'kanban', icon: KanbanSquare, badge: 3 },
  { id: 'author', icon: FileText },
  { id: 'reviewer', icon: Search },
  { id: 'analytics', icon: Activity },
  { id: 'messenger', icon: MessageSquare, badgeDot: true },
  { id: 'compiler', icon: Layers },
];

/* =========================================================
   STAGGERED ANIMATION VARIANTS
   ========================================================= */
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

/* =========================================================
   MOCKUP COMPONENTS WITH AUTOPILOT LOGIC & ANIMATIONS
   ========================================================= */

const SettingsTab = ({ isActive, t }: { isActive: boolean, t: any }) => {
  const [typedName, setTypedName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const targetText = t.settings.targetText;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isActive) {
      setTypedName('');
      setShowToast(false);
      let i = 0;

      const typeChar = () => {
        if (i < targetText.length) {
          setTypedName(targetText.slice(0, i + 1));
          i++;
          timeout = setTimeout(typeChar, 60 + Math.random() * 40);
        } else {
          timeout = setTimeout(() => setShowToast(true), 600);
        }
      };

      timeout = setTimeout(typeChar, 1000);
    }
    return () => clearTimeout(timeout);
  }, [isActive, targetText]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="max-w-4xl relative">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -top-16 right-0 bg-emerald-50/90 backdrop-blur-md border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_10px_30px_rgba(16,185,129,0.2)] z-10"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check className="w-3 h-3" /></div>
            {t.settings.saved}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
        <h3 className="text-xl font-bold text-slate-900 mb-6">{t.settings.title}</h3>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <motion.div variants={itemVariants} className="flex flex-col gap-2 relative">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.settings.nativeName}</label>
            <input
              type="text"
              value={typedName}
              readOnly
              className={`px-4 py-3 bg-slate-50/50 border rounded-xl text-sm font-medium text-slate-900 focus:outline-none transition-colors ${showToast ? 'border-emerald-300 ring-4 ring-emerald-50' : 'border-slate-200'}`}
            />
            {isActive && !showToast && typedName.length < targetText.length && (
              <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="absolute right-4 top-10 w-0.5 h-5 bg-indigo-500" />
            )}
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.settings.englishTitle}</label>
            <input type="text" value="Journal of Clinical Research and Medicine" readOnly className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900" />
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.settings.issn}</label>
            <input type="text" value="1992-0453" readOnly className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900" />
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.settings.country}</label>
            <select disabled className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 appearance-none">
              <option>Turkey (TR)</option>
            </select>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.settings.cover}</label>
            <div className="h-32 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 flex flex-col items-center justify-center gap-2 text-indigo-500 transition-colors">
              <UploadCloud className="w-6 h-6" />
              <span className="text-xs font-semibold">{t.settings.coverDrop}</span>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.settings.logo}</label>
            <div className="h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 text-slate-400 transition-colors">
              <UploadCloud className="w-6 h-6" />
              <span className="text-xs font-semibold">{t.settings.logoDrop}</span>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-8 flex justify-end">
          <button className={`px-8 py-3 text-white rounded-xl text-sm font-bold transition-all duration-500 shadow-md ${showToast ? 'bg-emerald-500 shadow-emerald-500/40 translate-y-[-2px]' : 'bg-slate-900 shadow-slate-900/20'}`}>
            {showToast ? t.settings.savedBtn : t.settings.saveBtn}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const KanbanTab = ({ isActive, t }: { isActive: boolean, t: any }) => {
  const [taskState, setTaskState] = useState<'in_progress' | 'completed'>('in_progress');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isActive) {
      setTaskState('in_progress');
      timeout = setTimeout(() => {
        setTaskState('completed');
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isActive]);

  const TaskCard = () => (
    <motion.div
      layout
      layoutId="animated-task-card"
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-indigo-200 shadow-[0_15px_35px_rgba(79,70,229,0.12)] flex flex-col gap-3 ring-2 ring-indigo-50/50 relative z-10"
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{t.kanban.task2.tag1}</span>
      </div>
      <h5 className="font-semibold text-slate-800 text-sm leading-snug">{t.kanban.task2.title}</h5>
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 shadow-sm">SR</div>
          <div className="w-6 h-6 rounded-full border-2 border-white bg-sky-100 flex items-center justify-center text-[10px] font-bold text-sky-700 shadow-sm">MK</div>
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <Calendar className="w-3 h-3" /> {t.kanban.task2.today}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="h-full flex gap-6 overflow-hidden pb-4">
      {/* Column 1 */}
      <motion.div variants={itemVariants} className="w-80 shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]"></span> {t.kanban.backlog}
          </h4>
          <span className="text-xs font-bold bg-white text-slate-500 px-2.5 py-0.5 rounded-full shadow-sm border border-slate-200/50">3</span>
        </div>

        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/60 shadow-[0_8px_20px_rgba(0,0,0,0.03)] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{t.kanban.task1.tag1}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{t.kanban.task1.tag2}</span>
          </div>
          <h5 className="font-semibold text-slate-800 text-sm leading-snug">{t.kanban.task1.title}</h5>
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 shadow-sm">AH</div>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <FileText className="w-3 h-3" /> {t.kanban.task1.today}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Column 2 */}
      <motion.div variants={itemVariants} className="w-80 shrink-0 flex flex-col gap-4 relative">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.6)] animate-pulse"></span> {t.kanban.inProgress}
          </h4>
          <span className="text-xs font-bold bg-white text-slate-500 px-2.5 py-0.5 rounded-full shadow-sm border border-slate-200/50">{taskState === 'in_progress' ? '1' : '0'}</span>
        </div>
        <div className="min-h-[150px]">
          {taskState === 'in_progress' && <TaskCard />}
        </div>
      </motion.div>

      {/* Column 3 */}
      <motion.div variants={itemVariants} className="w-80 shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span> {t.kanban.completed}
          </h4>
          <span className="text-xs font-bold bg-white text-slate-500 px-2.5 py-0.5 rounded-full shadow-sm border border-slate-200/50">{taskState === 'completed' ? '1' : '0'}</span>
        </div>
        <div className={`min-h-[150px] rounded-2xl transition-all duration-500 ${taskState === 'completed' ? '' : 'border-2 border-dashed border-slate-200/80 bg-slate-50/30 flex items-center justify-center text-slate-400 text-xs font-semibold'}`}>
          {taskState === 'completed' ? <TaskCard /> : t.kanban.drop}
        </div>
      </motion.div>
    </motion.div>
  );
};

const AnalyticsTab = ({ isActive, t }: { isActive: boolean, t: any }) => {
  const [animatedOffset, setAnimatedOffset] = useState(251.2);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isActive) {
      setAnimatedOffset(251.2);
      timeout = setTimeout(() => {
        setAnimatedOffset(62.8);
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [isActive]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <motion.div variants={itemVariants} className="col-span-1 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center">
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#4f46e5"
                strokeWidth="8"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: animatedOffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="drop-shadow-[0_0_12px_rgba(79,70,229,0.5)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">8,241</span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1 bg-indigo-50 px-2 py-0.5 rounded-full">{t.analytics.active}</span>
            </div>
          </div>
          <h3 className="text-sm font-bold text-slate-800">{t.analytics.totalUsers}</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">{t.analytics.totalUsersSub}</p>
        </motion.div>

        <div className="col-span-2 grid grid-rows-2 gap-6">
          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] flex items-center justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mb-3 border border-sky-100">
                <TrendingUp className="w-5 h-5 text-sky-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.analytics.velocities}</h4>
              <div className="text-2xl font-black text-slate-900 mt-1">142 <span className="text-sm font-semibold text-slate-400">{t.analytics.velocitiesUnit}</span></div>
            </div>
            <div className="w-32 h-16 flex items-end justify-between gap-1">
              {[30, 45, 25, 60, 80, 50, 90].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: isActive ? `${h}%` : 0 }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                  className="w-full bg-sky-100 rounded-t-sm"
                >
                  <div className="w-full bg-sky-500 rounded-t-sm shadow-[0_0_10px_rgba(14,165,233,0.3)]" style={{ height: '10%' }}></div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] flex items-center justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3 border border-emerald-100">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.analytics.spikes}</h4>
              <div className="text-2xl font-black text-slate-900 mt-1">84.2K <span className="text-sm font-semibold text-slate-400">{t.analytics.spikesUnit}</span></div>
            </div>
            <div className="w-32 h-16 flex items-end justify-between gap-1">
              {[40, 30, 60, 40, 70, 85, 60].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: isActive ? `${h}%` : 0 }}
                  transition={{ duration: 0.8, delay: i * 0.1 + 0.3, ease: "easeOut" }}
                  className="w-full bg-emerald-100 rounded-t-sm"
                >
                  <div className="w-full bg-emerald-500 rounded-t-sm shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ height: '10%' }}></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

const MessengerTab = ({ isActive, t }: { isActive: boolean, t: any }) => {
  const [typedSubject, setTypedSubject] = useState('');
  const [pulse, setPulse] = useState(false);
  const targetSubject = t.messenger.targetSubject;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isActive) {
      setTypedSubject('');
      setPulse(false);
      let i = 0;

      const typeChar = () => {
        if (i < targetSubject.length) {
          setTypedSubject(targetSubject.slice(0, i + 1));
          i++;
          timeout = setTimeout(typeChar, 60 + Math.random() * 40);
        } else {
          timeout = setTimeout(() => setPulse(true), 500);
        }
      };

      timeout = setTimeout(typeChar, 800);
    }
    return () => clearTimeout(timeout);
  }, [isActive, targetSubject]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="h-full flex flex-col bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
      <motion.div variants={itemVariants} className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shadow-inner border border-indigo-200/50">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.messenger.thread}</h3>
            <div className="flex gap-2 mt-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{t.messenger.editor}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">{t.messenger.reviewer}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-sm transition-all"><Search className="w-4 h-4" /></button>
          <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-sm transition-all"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      </motion.div>

      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto bg-slate-50/30">
        <motion.div variants={itemVariants} className="flex flex-col gap-1 max-w-[80%] self-start">
          <div className="text-[10px] font-bold text-slate-400 ml-2">{t.messenger.editor} • 10:42 AM</div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-700 shadow-sm relative">
            <div className="absolute top-0 -left-1.5 w-3 h-3 bg-white border-l border-t border-slate-200 rotate-[-45deg] origin-bottom-right" />
            {t.messenger.msg1}
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col gap-1 max-w-[80%] self-end">
          <div className="text-[10px] font-bold text-slate-400 mr-2 self-end">{t.messenger.reviewer} • 11:05 AM</div>
          <div className="bg-indigo-600 p-4 rounded-2xl rounded-tr-sm text-sm text-white shadow-md relative">
            <div className="absolute top-0 -right-1.5 w-3 h-3 bg-indigo-600 rotate-[45deg] origin-bottom-left" />
            {t.messenger.msg2}
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="p-4 border-t border-slate-100 bg-white/50 backdrop-blur-md">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              value={typedSubject}
              readOnly
              placeholder={t.messenger.subject}
              className={`px-4 py-2 w-full text-sm font-bold text-slate-800 bg-transparent border-b ${pulse ? 'border-indigo-500' : 'border-slate-200'} focus:outline-none transition-colors`}
            />
            {isActive && !pulse && typedSubject.length < targetSubject.length && (
              <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="absolute left-0 bottom-3 w-0.5 h-5 bg-indigo-500" style={{ left: `calc(1rem + ${typedSubject.length * 8}px)` }} />
            )}
          </div>
          <div className={`flex items-end gap-2 bg-white border rounded-2xl p-2 transition-all shadow-sm ${pulse ? 'border-indigo-300 ring-4 ring-indigo-50' : 'border-slate-200'}`}>
            <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-slate-50 transition-colors"><Paperclip className="w-5 h-5" /></button>
            <textarea placeholder={t.messenger.placeholder} className="flex-1 max-h-32 min-h-[40px] bg-transparent text-sm resize-none focus:outline-none p-2 text-slate-700"></textarea>
            <motion.button
              animate={pulse ? { scale: [1, 1.15, 1], boxShadow: ["0px 0px 0px rgba(79,70,229,0)", "0px 10px 20px rgba(79,70,229,0.5)", "0px 0px 0px rgba(79,70,229,0)"] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 scale-0 rounded-xl hover:scale-100 transition-transform origin-center" />
              <Send className="w-4 h-4 relative z-10" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CompilerTab = ({ t }: { t: any }) => (
  <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="flex gap-6 h-full">
    {/* Left Panel: Settings */}
    <motion.div variants={itemVariants} className="w-80 shrink-0 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{t.compiler.title}</h3>
        <p className="text-xs text-slate-500 font-medium">{t.compiler.sub}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.compiler.volIss}</label>
          <div className="flex gap-2">
            <input type="text" placeholder="Vol. 12" className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <input type="text" placeholder="Iss. 4" className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.compiler.execEditor}</label>
          <select className="px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none">
            <option>Dr. Ayşe Yılmaz</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.compiler.jenerik}</label>
          <div className="h-24 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-colors cursor-pointer">
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{t.compiler.upload}</span>
          </div>
        </div>

        <button className="mt-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-indigo-600 transition-colors shadow-[0_5px_15px_rgba(0,0,0,0.1)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          {t.compiler.compile}
        </button>
      </div>
    </motion.div>

    {/* Right Panel: Table of Contents */}
    <motion.div variants={itemVariants} className="flex-1 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <h3 className="text-base font-bold text-slate-900">{t.compiler.toc}</h3>
        <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
          <Plus className="w-3 h-3" /> {t.compiler.add}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {[
          { doi: '10.1016/j.2026.04.12', title: 'Evaluating Long-Term Efficacy in Models', pages: '1-14' },
          { doi: '10.1016/j.2026.04.15', title: 'Sustainable Infrastructure Materials Review', pages: '15-28' },
          { doi: '10.1016/j.2026.04.18', title: 'Quantum Cryptography in Modern Networks', pages: '29-41' },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all group cursor-grab"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{idx + 1}</div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</span>
                <span className="text-[10px] font-semibold text-slate-400 font-mono">{item.doi}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 bg-white shadow-sm border border-slate-100 px-2 py-0.5 rounded">{t.compiler.pp} {item.pages}</span>
              <button className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><AlertCircle className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

const AuthorTab = ({ t }: { isActive: boolean, t: any }) => (
  <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-6 h-full">
    <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
      <h3 className="text-xl font-bold text-slate-900">{t.author.mySubs}</h3>
      <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20">
        <Plus className="w-4 h-4" /> {t.author.newSub}
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
        <div className="flex justify-between items-start">
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-100">{t.author.status}</span>
          <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        </div>
        <h4 className="text-base font-semibold text-slate-800 leading-snug">{t.author.title1}</h4>
        <p className="text-xs font-medium text-slate-400">{t.author.date1}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
        <div className="flex justify-between items-start">
          <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-rose-100">{t.author.status2}</span>
          <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        </div>
        <h4 className="text-base font-semibold text-slate-800 leading-snug">{t.author.title2}</h4>
        <p className="text-xs font-medium text-slate-400">{t.author.date2}</p>
      </motion.div>
    </div>
  </motion.div>
);

const ReviewerTab = ({ isActive, t }: { isActive: boolean, t: any }) => (
  <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="flex gap-6 h-full">
    <motion.div variants={itemVariants} className="flex-1 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 to-indigo-200" />
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><FileText className="w-5 h-5" /></div>
        <h3 className="text-lg font-bold text-slate-800">{t.reviewer.manuscript}</h3>
      </div>
      <div className="flex-1 bg-slate-50/50 border border-slate-200/50 rounded-xl p-6 relative overflow-hidden flex flex-col gap-4">
        <div className="w-3/4 h-6 bg-slate-200/50 rounded animate-pulse" />
        <div className="w-full h-3 bg-slate-200/50 rounded animate-pulse" />
        <div className="w-full h-3 bg-slate-200/50 rounded animate-pulse" />
        <div className="w-5/6 h-3 bg-slate-200/50 rounded animate-pulse" />

        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-6 right-6 px-3 py-1.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 flex items-center gap-2 shadow-sm"
          >
            <AlertCircle className="w-3.5 h-3.5" /> High Similarity Warning
          </motion.div>
        )}
      </div>
    </motion.div>

    <motion.div variants={itemVariants} className="w-80 shrink-0 bg-slate-900 rounded-3xl p-6 shadow-lg flex flex-col gap-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
      <div>
        <h3 className="text-lg font-bold">{t.reviewer.score}</h3>
        <p className="text-xs font-medium text-slate-400 mt-1">{t.reviewer.evalDesk}</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-300">{t.reviewer.q1}</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${i === 4 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{i}</div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-300">{t.reviewer.q2}</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${i === 3 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{i}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <button className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-sm transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]">
          {t.reviewer.submitRev}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* =========================================================
   MAIN LAYOUT COMPONENT
   ========================================================= */

export default function SystemFeatures() {
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
  const [activeTab, setActiveTab] = useState(TABS_CONFIG[0].id);
  const [isAutopilot, setIsAutopilot] = useState(true);

  // Mouse Glow Spotlight
  const workspaceRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const t = dict[lang];

  const getActiveRole = () => {
    if (activeTab === 'author') return t.header.roles.author;
    if (activeTab === 'reviewer') return t.header.roles.reviewer;
    return t.header.roles.editor;
  };
  const activeRole = getActiveRole();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutopilot) {
      interval = setInterval(() => {
        setActiveTab(current => {
          const currentIndex = TABS_CONFIG.findIndex(t => t.id === current);
          const nextIndex = (currentIndex + 1) % TABS_CONFIG.length;
          return TABS_CONFIG[nextIndex].id;
        });
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [isAutopilot]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'settings': return <SettingsTab key={`settings-${lang}`} isActive={activeTab === 'settings'} t={t} />;
      case 'kanban': return <KanbanTab key={`kanban-${lang}`} isActive={activeTab === 'kanban'} t={t} />;
      case 'author': return <AuthorTab key={`author-${lang}`} isActive={activeTab === 'author'} t={t} />;
      case 'reviewer': return <ReviewerTab key={`reviewer-${lang}`} isActive={activeTab === 'reviewer'} t={t} />;
      case 'analytics': return <AnalyticsTab key={`analytics-${lang}`} isActive={activeTab === 'analytics'} t={t} />;
      case 'messenger': return <MessengerTab key={`messenger-${lang}`} isActive={activeTab === 'messenger'} t={t} />;
      case 'compiler': return <CompilerTab key={`compiler-${lang}`} t={t} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 relative overflow-hidden flex flex-col">

      {/* Ambient Background with subtle noise */}
      <div className="fixed inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] -z-20 pointer-events-none opacity-40" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10 pointer-events-none animate-float" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-sky-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Navbar */}
      

      {/* Application Shell Workspace */}
      <main className="pt-32 pb-12 flex-1 flex flex-col max-w-[1400px] w-full mx-auto px-6 z-10 min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Enterprise Dashboard
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 tracking-tight py-2 leading-tight">{t.page.title}</h1>
            <p className="text-slate-500 font-medium text-lg">{t.page.desc}</p>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col bg-slate-50 rounded-[2rem] border border-slate-200/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,1)_inset] overflow-hidden relative">
          {/* macOS Top Bar */}
          <div className="h-12 border-b border-slate-200/50 bg-slate-100/50 flex items-center px-4 justify-between backdrop-blur-md relative z-20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500 shadow-sm" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-white/60 border border-slate-200/60 rounded-md shadow-sm text-[10px] font-bold text-slate-500">
              <Lock className="w-3 h-3 text-slate-400" />
              app.novaijournal.com
            </div>
            <div className="w-16" /> {/* Placeholder for balance */}
          </div>

          <div className="flex flex-1 gap-8 min-h-0 p-4 md:p-6 bg-slate-50/50">
            {/* Left Sidebar Navigation */}
            <aside className="w-72 shrink-0 flex flex-col gap-2">
              {TABS_CONFIG.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const tabData = t.tabs[tab.id as keyof typeof t.tabs];

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsAutopilot(false);
                    }}
                    className={`group relative flex items-center px-4 py-4 rounded-2xl transition-all duration-300 text-left border overflow-hidden ${isActive
                        ? 'bg-white border-indigo-200 shadow-[0_15px_35px_-10px_rgba(79,70,229,0.15)] scale-[1.02]'
                        : 'bg-transparent border-transparent hover:bg-white/50 hover:border-slate-200/50 hover:shadow-sm opacity-70 hover:opacity-100'
                      }`}
                  >
                    {/* Subtle active background gradient */}
                    {isActive && <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-transparent pointer-events-none" />}

                    <div className="flex items-center justify-between w-full relative z-10">
                      <div className="flex gap-4">
                        <div className={`mt-0.5 p-2 rounded-xl transition-colors ${isActive ? 'bg-indigo-600 text-white shadow-[0_4px_15px_rgba(79,70,229,0.3)]' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-indigo-500'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold transition-colors ${isActive ? 'text-indigo-950' : 'text-slate-700'}`}>{tabData.title}</span>
                          <span className={`text-[11px] font-bold tracking-wide transition-colors ${isActive ? 'text-indigo-500' : 'text-slate-400'}`}>
                            {tabData.sub}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {tab.badge && (
                          <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>{tab.badge}</span>
                        )}
                        {tab.badgeDot && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
                        )}
                        <ChevronRight className={`w-4 h-4 transition-all duration-300 ${isActive ? 'text-indigo-300 translate-x-0 opacity-100' : 'text-slate-300 -translate-x-2 opacity-0'}`} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </aside>

            {/* Right Main Content Workspace (Live Application Shell) */}
            <section
              ref={workspaceRef}
              onMouseMove={handleMouseMove}
              className="flex-1 min-h-0 bg-slate-100/40 backdrop-blur-3xl border border-slate-200/80 rounded-[2.5rem] p-2 shadow-[inset_0_2px_10px_rgba(255,255,255,0.7),0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden relative group/workspace flex flex-col"
            >
              {/* Ambient Cursor Spotlight */}
              <div
                className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover/workspace:opacity-100 transition-opacity duration-700 ease-out"
                style={{
                  background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.6), transparent 40%)`
                }}
              />

              {/* Realism Header */}
              <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200/50 bg-white/40 rounded-t-[2.2rem] backdrop-blur-md mb-4">
                <div className="flex items-center gap-4 bg-white/60 border border-slate-200/60 rounded-xl px-4 py-2 w-72 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input type="text" placeholder={t.header.search} className="bg-transparent text-sm font-medium focus:outline-none w-full placeholder:text-slate-400" />
                </div>

                <div className="flex items-center gap-5">
                  <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-100" />
                  </button>
                  <div className="w-px h-6 bg-slate-200" />
                  <div className="flex items-center gap-3 cursor-pointer group/user">
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">{activeRole.name}</p>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{activeRole.title}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 p-[2px] shadow-sm">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${activeRole.avatar}&background=f8fafc&color=4f46e5&bold=true`} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Content Area */}
              <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {renderActiveTab()}
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer Reused */}
      
    </div>
  );
}
