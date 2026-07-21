import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Users,
  FileText,
  Info,
  Target,
  PenLine,
  Building2,
  Mail,
  Send,
  UserCheck,
  Menu,
  Clock,
  Bell,
  ExternalLink,
  ChevronRight,
  Star,
  Globe,
  ArrowLeft,
  Loader2,
  Heart,
  BarChart2,
  CalendarDays,
  ChevronDown,
  Download,
  Rss,
} from 'lucide-react';
import { useTenantStore } from '../../store/useTenantStore';
import { useTranslation } from '../../hooks/useTranslation';

const JOURNAL_COVER = 'https://dergipark.org.tr/media/cache/journal_croped/2486/4b13/5a7a/5cc748f217520.jpg';

const ARCHIVE_ISSUES = [
  { id: '102909', year: 2026, volume: 32, number: 1, url: 'https://dergipark.org.tr/tr/pub/maruhad/issue/102909' },
  { id: '102760', year: 2025, volume: 31, number: 2, url: 'https://dergipark.org.tr/tr/pub/maruhad/issue/102760' },
  { id: '92607', year: 2025, volume: 31, number: 1, url: 'https://dergipark.org.tr/tr/pub/maruhad/issue/92607' },
  { id: '88623', year: 2024, volume: 30, number: 2, url: 'https://dergipark.org.tr/tr/pub/maruhad/issue/88623' },
];

const SPECIAL_ISSUES = [
  { id: '73986', date: 'Dec 2022', name: "Marmara Üniversitesi Hukuk Fakültesi'nin Kuruluşunun 40. Yılı Özel Sayısı", url: 'https://dergipark.org.tr/tr/pub/maruhad/issue/73986' },
  { id: '36611', date: 'Dec 2017', name: 'Cilt 23, Sayı 3', url: 'https://dergipark.org.tr/tr/pub/maruhad/issue/36611' },
  { id: '36500', date: 'Dec 2016', name: 'Marmara Üniversitesi Hukuk Fakültesi - Hukuk Araştırmaları Dergisi', url: 'https://dergipark.org.tr/tr/pub/maruhad/issue/36500' },
  { id: '27556', date: 'Jan 2016', name: 'Marmara Üniversitesi Hukuk Fakültesi-Hukuk Araştırmaları Dergisi 2015/2 Sayısı', url: 'https://dergipark.org.tr/tr/pub/maruhad/issue/27556' },
  { id: '44298', date: 'Jun 2014', name: "Prof. Dr. Ali Rıza Okur'a Armağan", url: 'https://dergipark.org.tr/tr/pub/maruhad/issue/44298' },
  { id: '48280', date: 'Dec 2013', name: "Prof. Dr. Nur Centel'e Armağan", url: 'https://dergipark.org.tr/tr/pub/maruhad/issue/48280' },
  { id: '48277', date: 'Dec 2012', name: "6102 Sayılı Yeni Türk Ticaret Kanunu'nu Beklerken (10-11-12 Mayıs 2012 Sempozyum)", url: 'https://dergipark.org.tr/tr/pub/maruhad/issue/48277' },
];

const ARTICLES = [
  {
    id: 1905780,
    type: 'Araştırma Makalesi',
    title: 'Antarktika Antlaşmalar Sistemi Çerçevesinde Üstlenileceği Taahhüt Edilen Danışman Taraf Yükümlülüklerinin Sistematik Analizi: Tavsiye ve Önlem Kararları',
    authors: [{ name: 'Havva Okudan Soytürk', isPrimary: true }, { name: 'Nil Kula', isPrimary: false }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 1-30',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1905780',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5796266',
    citations: 24,
    downloads: 145,
    views: 450
  },
  {
    id: 1835788,
    type: 'Araştırma Makalesi',
    title: 'AF KURUMUNUN ANLAMI, AMAÇLARI, TÜRLERİ VE DENETİMİ (Karşılaştırmalı Bir Anayasal İnceleme)',
    authors: [{ name: 'Tolga Şirin', isPrimary: true }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 31-86',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1835788',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5477187',
    citations: 18,
    downloads: 232,
    views: 612
  },
  {
    id: 1787279,
    type: 'Araştırma Makalesi',
    title: 'Uluslararası Hukuk Açısından Türk Dünyası Şartı',
    authors: [{ name: 'Tuğçe İsayev', isPrimary: true }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 87-107',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1787279',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5256481',
    citations: 12,
    downloads: 110,
    views: 310
  },
  {
    id: 1921104,
    type: 'Araştırma Makalesi',
    title: 'Seküler Devletin Teolojik Temelleri Pavlus, Aquino Thomas, Padovalı Marsiglio, Hobbes ve Rousseau izinde Modern Devletin Aşkın ve Metafizik Köklerine Dair Arkeolojik Bir Çalışma',
    authors: [{ name: 'Halit Serhan Ercivelek', isPrimary: true }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 108-134',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1921104',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5869208',
    citations: 31,
    downloads: 189,
    views: 520
  },
  {
    id: 1908488,
    type: 'Araştırma Makalesi',
    title: 'Mülkiyet Hakkına Vergilendirme Yoluyla Müdahalenin Ölçüsü Sorunu: Müdahalenin Ağırlığını Ölçmek Mümkün mü?',
    authors: [{ name: 'Eda Yıldız', isPrimary: true }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 135-169',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1908488',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5809064',
    citations: 15,
    downloads: 94,
    views: 285
  },
  {
    id: 1905741,
    type: 'Araştırma Makalesi',
    title: 'Türkiye’de Soyadını Değiştirmeden Kullanan Evli Kadına Yapılan Ayrımcılık',
    authors: [{ name: 'Ezgi Çaldıran', isPrimary: true }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 170-186',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1905741',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5796078',
    citations: 28,
    downloads: 305,
    views: 890
  },
  {
    id: 1907187,
    type: 'Araştırma Makalesi',
    title: 'Tutukluluk Halinin Devamına İlişkin Kararlarda Gerekçelendirme Yükümlülüğü',
    authors: [{ name: 'Beyzanur Yazar', isPrimary: true }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 187-212',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1907187',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5802959',
    citations: 5,
    downloads: 72,
    views: 210
  },
  {
    id: 1775530,
    type: 'Araştırma Makalesi',
    title: 'Suç Sonucu Oluşan Gebeliğin Sonlandırılması Sürecine İlişkin Sorunlar ve Anayasa Mahkemesi Kararlarına Yansıyan Örnekleri',
    authors: [{ name: 'Yasemin Baba', isPrimary: true }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 213-241',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1775530',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5201759',
    citations: 42,
    downloads: 412,
    views: 1105
  },
  {
    id: 1919061,
    type: 'Araştırma Makalesi',
    title: 'Grev Ertelemesi: Türk İş Hukuku ile ABD İş Hukukunun Karşılaştırmalı Analizi',
    authors: [{ name: 'Ercüment Özkaraca', isPrimary: true }, { name: 'Beril İrem Usta Yiğit', isPrimary: false }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 242-264',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1919061',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5859803',
    citations: 14,
    downloads: 120,
    views: 340
  },
  {
    id: 1775504,
    type: 'Araştırma Makalesi',
    title: 'Satılanın Helal Olmaması Ayıp Olarak Değerlendirilebilir mi?',
    authors: [{ name: 'Bedia Güleş', isPrimary: true }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 265-284',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1775504',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5201627',
    citations: 8,
    downloads: 165,
    views: 405
  },
  {
    id: 1795080,
    type: 'Araştırma Makalesi',
    title: 'Arabuluculuk Anlaşma Belgesinin Karayolları Trafik Kanunu’nun 111. Maddesinin II. Fıkrası Kapsamına Dahil Edilebilip Edilmeyeceği Sorunu',
    authors: [{ name: 'Yıldırım Keser', isPrimary: true }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 285-299',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1795080',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5292044',
    citations: 19,
    downloads: 142,
    views: 380
  },
  {
    id: 1776935,
    type: 'Araştırma Makalesi',
    title: 'Anonim Şirkette Nama Yazılı Payların Devrinde Kanuni Sınırlandırma Hakkında Bir Değerlendirme',
    authors: [{ name: 'Cansu Kahraman', isPrimary: true }, { name: 'Raziye Aksu', isPrimary: false }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 300-330',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1776935',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5208459',
    citations: 11,
    downloads: 104,
    views: 298
  },
  {
    id: 1906279,
    type: 'Araştırma Makalesi',
    title: '7438 Sayılı (EYT) Kanun’un Anayasal İlkeler Işığında Değerlendirilmesi: Adil, Makul ve Ölçülü Kademelendirme Sorunu',
    authors: [{ name: 'Melisa Aydin Yamakoğlu', isPrimary: false }, { name: 'Efe Yamakoğlu', isPrimary: true }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 331-348',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1906279',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5798684',
    citations: 35,
    downloads: 389,
    views: 990
  },
  {
    id: 1775477,
    type: 'Araştırma Makalesi',
    title: 'Tasarım Hukukunda Görünür Olma Şartı: Özellikle Yedek Parça Tasarımları Üzerinden Bir İnceleme',
    authors: [{ name: 'Başak Karmutoğlu', isPrimary: true }],
    date: '3 Temmuz 2026',
    pages: 'Sayfa 349-374',
    url: 'https://dergipark.org.tr/tr/pub/maruhad/article/1775477',
    pdfUrl: 'https://dergipark.org.tr/tr/download/article-file/5201483',
    citations: 16,
    downloads: 154,
    views: 410
  }
];

const TABS = [
  { id: 'hakkinda', label: 'Hakkında', icon: Info },
  { id: 'amac-kapsam', label: 'Amaç ve Kapsam', icon: Target },
  { id: 'ucret-politikasi', label: 'Ücret Politikası', icon: FileText },
  { id: 'yayin-kurulu', label: 'Yayın Kurulu', icon: Users },
  { id: 'danisma-kurulu', label: 'Danışma Kurulu', icon: Star },
  { id: 'istatistikler', label: 'İstatistikler', icon: BarChart2 },
  { id: 'yazim-ilkeleri', label: 'Yazım İlkeleri', icon: PenLine },
  { id: 'yayin-etigi', label: 'Yayın Etiği', icon: FileText },
  { id: 'dizinler', label: 'Dizinler', icon: BookOpen },
  { id: 'yayinevi', label: 'Yayıncı', icon: Building2 },
  { id: 'iletisim', label: 'İletişim', icon: Mail },
];

const EDITORIAL_BOARD = [
  {
    role: 'Baş Editör',
    name: 'Prof. Dr. Mehmet KARATAŞ',
    title: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'MK',
  },
  {
    role: 'Editör Yardımcısı',
    name: 'Doç. Dr. Ayşe YILMAZ',
    title: 'İstanbul Üniversitesi Hukuk Fakültesi',
    avatar: 'AY',
  },
  {
    role: 'Editör Yardımcısı',
    name: 'Dr. Öğr. Üyesi Ali KAYA',
    title: 'Ankara Üniversitesi Hukuk Fakültesi',
    avatar: 'AK',
  },
];

const ADVISORY_BOARD = [
  { name: 'Prof. Dr. Hans Müller', institution: 'Heidelberg Universität, Almanya' },
  { name: 'Prof. Dr. Marie Dubois', institution: 'Université Paris I, Fransa' },
  { name: 'Prof. Dr. John Richardson', institution: 'Oxford University, İngiltere' },
  { name: 'Prof. Dr. Kenji Tanaka', institution: 'Tokyo University, Japonya' },
  { name: 'Prof. Dr. Fatima Al-Hassan', institution: 'Cairo University, Mısır' },
  { name: 'Prof. Dr. Carlos Mendez', institution: 'Universidad Complutense de Madrid, İspanya' },
];

const JOURNAL_INFO_LOOKUP: Record<string, {
  eIssn: string;
  founded: string;
  coordinator: { name: string; email: string };
  editor: { name: string; email: string };
  model: { TR: string; EN: string };
  indexes: string;
  stats: {
    precheck: { TR: string; EN: string };
    evaluation: { TR: string; EN: string };
    publication: { TR: string; EN: string };
  }
}> = {
  am: {
    eIssn: '2529-0142',
    founded: '1986',
    coordinator: { name: 'Öğretim Görevlisi Birgül Çakıral', email: 'akademikdergi@marmara.edu.tr' },
    editor: { name: 'Prof. Dr. Ercüment Özkaraca', email: 'eozkaraca@marmara.edu.tr' },
    model: { TR: 'Süreli Yayın (Haziran - Aralık)', EN: 'Periodical (June - December)' },
    indexes: 'TR Dizin',
    stats: {
      precheck: { TR: '27 gün', EN: '27 days' },
      evaluation: { TR: '88 gün', EN: '88 days' },
      publication: { TR: '62 gün', EN: '62 days' }
    }
  },
  et: {
    eIssn: '3012-7830',
    founded: '2018',
    coordinator: { name: 'Dr. Alan Turing III', email: 'etr.coordinator@academianexus.com' },
    editor: { name: 'Prof. Kenan Demir', email: 'etr.editor@academianexus.com' },
    model: { TR: 'Süreli Yayın (Yıllık)', EN: 'Periodical (Annual)' },
    indexes: 'Crossref Pending',
    stats: {
      precheck: { TR: '14 gün', EN: '14 days' },
      evaluation: { TR: '42 gün', EN: '42 days' },
      publication: { TR: '30 gün', EN: '30 days' }
    }
  },
  js: {
    eIssn: '2845-9022',
    founded: '2015',
    coordinator: { name: 'Dr. Michael Chen', email: 'jse.coordinator@academianexus.com' },
    editor: { name: 'Prof. Dr. Sarah Jenkins', email: 'jse.editor@academianexus.com' },
    model: { TR: 'Süreli Yayın (Yılda İki Kez)', EN: 'Periodical (Semi-Annual)' },
    indexes: 'Scopus Indexed',
    stats: {
      precheck: { TR: '10 gün', EN: '10 days' },
      evaluation: { TR: '35 gün', EN: '35 days' },
      publication: { TR: '25 gün', EN: '25 days' }
    }
  },
  qc: {
    eIssn: '4451-2300',
    founded: '2020',
    coordinator: { name: 'Dr. John Richardson', email: 'qcl.coordinator@academianexus.com' },
    editor: { name: 'Prof. Dr. Jane Doe', email: 'qcl.editor@academianexus.com' },
    model: { TR: 'Süreli Yayın (Üç Aylık)', EN: 'Periodical (Quarterly)' },
    indexes: 'Scopus Indexed',
    stats: {
      precheck: { TR: '7 gün', EN: '7 days' },
      evaluation: { TR: '21 gün', EN: '21 days' },
      publication: { TR: '15 gün', EN: '15 days' }
    }
  }
};

const DEFAULT_JOURNAL_INFO = {
  eIssn: '2529-0142',
  founded: '2009',
  coordinator: { name: 'Platform Koordinatörü', email: 'support@academianexus.com' },
  editor: { name: 'Baş Editör', email: 'editor@academianexus.com' },
  model: { TR: 'Süreli Yayın', EN: 'Periodical' },
  indexes: 'Google Scholar',
  stats: {
    precheck: { TR: '15 gün', EN: '15 days' },
    evaluation: { TR: '45 gün', EN: '45 days' },
    publication: { TR: '30 gün', EN: '30 days' }
  }
};

export default function AboutJournal() {
  const navigate = useNavigate();
  const { tenant_slug } = useParams<{ tenant_slug: string }>();
  const { metadata, isLoading, fetchMetadata } = useTenantStore();
  const { lang } = useTranslation();

  const [activeTab, setActiveTab] = useState('hakkinda');
  const [followCount, setFollowCount] = useState(552);
  const [isFollowing, setIsFollowing] = useState(false);
  const [_mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const [activeArchiveTab, setActiveArchiveTab] = useState<'latest' | 'special'>('latest');
  const [activeArticlesTab, setActiveArticlesTab] = useState<'latest' | 'cited' | 'downloaded' | 'popular'>('latest');
  const [mobileArticlesSelectOpen, setMobileArticlesSelectOpen] = useState(false);
  const [favoriteArticles, setFavoriteArticles] = useState<Record<number, boolean>>({});

  const getSortedArticles = () => {
    const list = [...ARTICLES];
    if (activeArticlesTab === 'cited') {
      return list.sort((a, b) => b.citations - a.citations);
    }
    if (activeArticlesTab === 'downloaded') {
      return list.sort((a, b) => b.downloads - a.downloads);
    }
    if (activeArticlesTab === 'popular') {
      return list.sort((a, b) => b.views - a.views);
    }
    return list;
  };

  // Use tenant_slug from URL param, or fallback to first available journal
  const effectiveSlug = tenant_slug || 'am';
  const journalConfig = JOURNAL_INFO_LOOKUP[effectiveSlug.toLowerCase()] || DEFAULT_JOURNAL_INFO;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    fetchMetadata(effectiveSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveSlug]);

  const handleFollow = () => {
    setIsFollowing((prev) => {
      setFollowCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  const getTabContent = (field: any) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field['EN'] || '';
  };

  if (isLoading || !metadata) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-slate-500 font-bold text-sm">Dergi bilgileri yükleniyor...</span>
        </div>
      </div>
    );
  }

  const displayTitle = lang === 'TR' ? (metadata.tr || metadata.name) : metadata.name;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'hakkinda':
        return (
          <div className="prose prose-slate max-w-none">
            <div
              className="text-slate-600 leading-relaxed text-sm"
              dangerouslySetInnerHTML={{
                __html:
                  getTabContent(metadata.about) ||
                  `<p><strong>${displayTitle}</strong>, Marmara Üniversitesi Hukuk Fakültesi tarafından yılda iki kez (Haziran ve Aralık) yayımlanan hakemli bir hukuk dergisidir.</p>
                  <p>Dergi, hukukun tüm alanlarında özgün araştırma ve inceleme makalelerini Türkçe ve yabancı dillerde yayımlamaktadır. Dergiye gönderilen makaleler çift taraflı kör hakemlik sürecine tabi tutulmaktadır.</p>
                  <p>Dergi, 2009 yılında "Marmara Üniversitesi Hukuk Fakültesi Hukuk Araştırmaları Dergisi" adıyla yayın hayatına başlamıştır. Dergide yayımlanan makalelere <strong>TR Dizin</strong> aracılığıyla erişilebilmektedir.</p>`,
              }}
            />
          </div>
        );

      case 'yayin-kurulu':
        return (
          <div className="space-y-4">
            {(metadata.editorialBoard && metadata.editorialBoard.length > 0 ? metadata.editorialBoard.map((m: any, i: number) => ({
              role: m.role,
              name: m.name,
              title: m.title,
              avatar: m.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'ED',
            })) : EDITORIAL_BOARD).map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-100 hover:bg-emerald-50/30 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
                  {(member as any).avatar || '??'}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">{member.role}</span>
                  <h4 className="text-sm font-bold text-slate-900 truncate">{member.name}</h4>
                  <p className="text-xs text-slate-500 font-medium truncate">{member.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'danisma-kurulu':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(metadata.advisoryBoard && metadata.advisoryBoard.length > 0 ? metadata.advisoryBoard : ADVISORY_BOARD).map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-100 transition-all duration-200"
              >
                <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-emerald-500 shrink-0" />
                  {member.institution}
                </p>
              </motion.div>
            ))}
          </div>
        );

      case 'amac-kapsam':
        return (
          <div
            className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                getTabContent(metadata.aimsScope) ||
                `<p>Derginin amacı, hukuk alanındaki özgün bilimsel çalışmaları ulusal ve uluslararası akademik camiaya sunmaktır.</p>
                <h4>Kapsam</h4>
                <p>Dergi; özel hukuk, kamu hukuku, uluslararası hukuk ve hukuk felsefesi alanlarındaki özgün araştırma, inceleme ve derleme niteliğindeki makaleleri yayımlamaktadır.</p>
                <ul>
                  <li>Özel Hukuk (Medeni Hukuk, Borçlar Hukuku, Ticaret Hukuku)</li>
                  <li>Kamu Hukuku (Anayasa Hukuku, İdare Hukuku, Ceza Hukuku)</li>
                  <li>Uluslararası Hukuk ve Avrupa Birliği Hukuku</li>
                  <li>Hukuk Felsefesi ve Hukuk Sosyolojisi</li>
                </ul>`,
            }}
          />
        );

      case 'yazim-ilkeleri':
        return (
          <div
            className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                getTabContent(metadata.writingPrinciples) ||
                `<p>Dergiye gönderilen makaleler aşağıdaki kurallara uygun olarak hazırlanmalıdır:</p>
                <h4>Genel Kurallar</h4>
                <ul>
                  <li>Makaleler Microsoft Word formatında (.docx) gönderilmelidir.</li>
                  <li>Makale metni Times New Roman, 12 punto, 1,5 satır aralığıyla yazılmalıdır.</li>
                  <li>Makalelerin Türkçe ve İngilizce başlık, özet (en az 150, en fazla 250 kelime) ve anahtar kelimeler (en az 3, en fazla 7) içermesi zorunludur.</li>
                </ul>
                <h4>Atıf Sistemi</h4>
                <p>Dergide dipnot atıf sistemi kullanılmaktadır.</p>`,
            }}
          />
        );

      case 'yayin-etigi':
        return (
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>Dergimiz, yayın etiği konusunda <strong>COPE (Committee on Publication Ethics)</strong> ilkelerini benimsemektedir.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {[
                { title: 'Çift Taraflı Kör Hakemlik', desc: 'Yazar ve hakem kimlikleri karşılıklı olarak gizli tutulmaktadır.' },
                { title: 'Özgünlük Denetimi', desc: 'Tüm makaleler benzerlik analizi yazılımından geçirilmektedir.' },
                { title: 'Açık Erişim Politikası', desc: 'Yayımlanan tüm makaleler açık erişim prensibiyle sunulmaktadır.' },
                { title: 'Çıkar Çatışması', desc: 'Editörler ve hakemler çıkar çatışması beyan etmekle yükümlüdür.' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'yayinevi':
        return (
          <div
            className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                getTabContent(metadata.publisher) ||
                `<p><strong>Yayımcı:</strong> Marmara Üniversitesi</p>
                <p><strong>Adres:</strong> Marmara Üniversitesi Hukuk Fakültesi, Göztepe Yerleşkesi, 34722, Kadıköy, İstanbul</p>
                <p><strong>Web Sitesi:</strong> <a href="https://hukuk.marmara.edu.tr" target="_blank">hukuk.marmara.edu.tr</a></p>`,
            }}
          />
        );

      case 'iletisim':
        return (
          <div
            className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                getTabContent(metadata.contact) ||
                `<p><strong>Editör:</strong> maruhad@marmara.edu.tr</p>
                <p><strong>Teknik Destek:</strong> dergipark@tubitak.gov.tr</p>
                <p><strong>Adres:</strong> Marmara Üniversitesi Hukuk Fakültesi Hukuk Araştırmaları Dergisi, Göztepe Yerleşkesi, 34722, Kadıköy, İstanbul</p>`,
            }}
          />
        );

      case 'ucret-politikasi':
        return (
          <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed">
            <p>
              <strong>{displayTitle}</strong>, açık erişimli bir dergi olup makale gönderimi, değerlendirme, yayınlama veya benzeri hiçbir süreç için yazarlardan ücret talep etmez.
            </p>
            <p>
              Tüm yayın süreçleri tamamen ücretsizdir ve akademik bilgiye serbest erişimi desteklemek amacıyla ücretsiz olarak yürütülür.
            </p>
          </div>
        );

      case 'istatistikler':
        return (
          <div className="space-y-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Dergimize ait güncel değerlendirme ve yayın istatistikleri aşağıda yer almaktadır:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  id: 'precheck',
                  label: lang === 'TR' ? 'Ön Kontrol Süresi' : 'Pre-check Time',
                  value: lang === 'TR' ? journalConfig.stats.precheck.TR : journalConfig.stats.precheck.EN,
                  tooltip: lang === 'TR' 
                    ? 'Makalenin gönderiminden değerlendirmesiz iade, doğrudan ret/kabul veya ilk editör atamasına kadar geçen ortalama süreyi kapsar.'
                    : 'Covers the average time from submission to non-evaluated return, direct rejection/acceptance, or first editor assignment.'
                },
                {
                  id: 'evaluation',
                  label: lang === 'TR' ? 'Değerlendirme Süresi' : 'Evaluation Time',
                  value: lang === 'TR' ? journalConfig.stats.evaluation.TR : journalConfig.stats.evaluation.EN,
                  tooltip: lang === 'TR'
                    ? 'Makalenin gönderiminden nihai kararın verilmesine kadar geçen ortalama süreyi ifade eder.'
                    : 'Refers to the average time from article submission to the final decision.'
                },
                {
                  id: 'publication',
                  label: lang === 'TR' ? 'Yayım Süresi' : 'Publication Time',
                  value: lang === 'TR' ? journalConfig.stats.publication.TR : journalConfig.stats.publication.EN,
                  tooltip: lang === 'TR'
                    ? 'Makalenin kabulünden yayımlanmasına kadar geçen ortalama süredir. Erken görünümde yayımlanan makaleler de bu süreye dahildir.'
                    : 'Average time from article acceptance to publication. Articles published in early access are also included in this duration.'
                }
              ].map((metric) => (
                <div 
                  key={metric.id} 
                  className="relative bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm text-center transition-all duration-300 hover:border-emerald-500 hover:shadow-md group"
                >
                  <div className="text-sm text-slate-500 font-bold mb-3 flex items-center justify-center gap-1.5">
                    <span>{metric.label}</span>
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onMouseEnter={() => setHoveredTooltip(metric.id)}
                        onMouseLeave={() => setHoveredTooltip(null)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none"
                      >
                        <Info className="w-4 h-4 cursor-pointer" />
                      </button>
                      {hoveredTooltip === metric.id && (
                        <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl leading-relaxed text-center font-normal">
                          {metric.tooltip}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-emerald-700 leading-none">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'dizinler':
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              <strong>{displayTitle}</strong> aşağıdaki ulusal ve uluslararası indekslerde taranmaktadır:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['TR Dizin', 'Crossref', 'OpenAIRE', 'DOAJ', 'Academia.edu', 'Google Scholar'].map((idx, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-100 hover:bg-emerald-50/30 transition-all duration-200">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950">{idx}</h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">İndekslenmiş / Aktif</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">

      {/* ─── HERO HEADER (DergiPark Style) ─── */}
      <header
        className="relative overflow-hidden pt-28 pb-0"
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 30%, #047857 60%, #059669 100%)',
        }}
      >
        {/* Topo pattern background */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-300/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-400/10 blur-[80px] rounded-full pointer-events-none" />

        {/* Header Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 lg:gap-12 items-start">

            {/* Journal Cover */}
            <div className="flex flex-col items-center lg:items-start gap-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-white/20 rounded-2xl blur-sm group-hover:bg-white/30 transition-all duration-300" />
                <img
                  src={metadata.cover || JOURNAL_COVER}
                  alt="Kapak Resmi"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = JOURNAL_COVER;
                  }}
                  className="relative w-32 lg:w-full rounded-xl shadow-2xl border-2 border-white/20 object-cover"
                  style={{ aspectRatio: '3/4', objectFit: 'cover' }}
                />
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1 text-center lg:text-left">
                <span className="text-white/70 text-[11px] font-semibold">ISSN: {metadata.issn || '2146-0590'}</span>
                <span className="text-white/70 text-[11px] font-semibold">e-ISSN: 2529-0142</span>
              </div>
            </div>

            {/* Journal Info */}
            <div className="flex flex-col gap-4">

              {/* Publisher Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg text-white/90 text-[11px] font-bold tracking-wider">
                  <Building2 className="w-3.5 h-3.5 text-emerald-300" />
                  YAYIMCI: MARMARA ÜNİVERSİTESİ
                </span>
              </div>

              {/* Journal Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                {displayTitle || 'Marmara Üniversitesi Hukuk Fakültesi Hukuk Araştırmaları Dergisi'}
              </h1>

              {/* Meta badges row */}
              <div className="flex flex-wrap items-center gap-3 my-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-white/80 text-[11px] font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-300" />
                  Yayın Modeli: Süreli Yayın (Haziran - Aralık)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-white/80 text-[11px] font-semibold">
                  <CalendarDays className="w-3.5 h-3.5 text-emerald-300" />
                  2009'dan beri yayında
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {/* Submit Article (Closed) */}
                <button
                  disabled
                  title="Makale alımı şu anda kapalıdır."
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white font-bold text-sm cursor-not-allowed opacity-70"
                >
                  <Send className="w-4 h-4" />
                  Makale Gönder
                </button>

                {/* Reviewer Request */}
                <button
                  onClick={() => navigate('/dashboard/reviewer/assigned')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent backdrop-blur-sm border border-white/40 rounded-xl text-white font-bold text-sm hover:bg-white/10 hover:border-white/60 transition-all duration-200 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  Hakemlik İsteği Gönder
                </button>

                {/* Explore Button */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent backdrop-blur-sm border border-white/40 rounded-xl text-white font-bold text-sm hover:bg-white/10 hover:border-white/60 transition-all duration-200 cursor-pointer"
                >
                  <Menu className="w-4 h-4" />
                  Keşfet
                </button>
              </div>

              {/* Tags + Follow Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-1 border-t border-white/15">
                {/* Index Tags */}
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://search.trdizin.gov.tr/tr/dergi/detay/721"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/25 border border-white/10 rounded-lg text-white/90 text-[12px] font-semibold hover:bg-white/10 hover:text-white transition-all duration-200 no-underline"
                  >
                    TR Dizin
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/25 border border-white/10 rounded-lg text-white/90 text-[12px] font-semibold">
                    Crossref
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/25 border border-white/10 rounded-lg text-white/90 text-[12px] font-semibold">
                    OpenAIRE
                  </span>
                </div>

                {/* Follow Button */}
                <div className="flex items-center bg-black/20 rounded-full p-1 border border-white/15">
                  <button
                    onClick={handleFollow}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-[13px] transition-all duration-200 cursor-pointer ${
                      isFollowing
                        ? 'bg-white text-emerald-700 hover:bg-white/90'
                        : 'bg-white/15 text-white hover:bg-white hover:text-emerald-700'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 transition-all ${isFollowing ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                    <span>{isFollowing ? 'Takip Ediyorsunuz' : 'Takip Et'}</span>
                  </button>
                  <span className="px-3 text-white/80 font-semibold text-[13px]">{followCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="mt-8 relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
            <nav className="flex items-center gap-0 overflow-x-auto scrollbar-none" aria-label="Dergi Sekmeleri">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-4 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-all duration-200 cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-white text-white'
                        : 'border-transparent text-white/60 hover:text-white/90 hover:border-white/30'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          {/* Left: Tab Content */}
          <div>
            {/* Back button */}
            <div className="mb-5">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-emerald-600 bg-white hover:bg-emerald-50/30 border border-slate-200/80 hover:border-emerald-200/60 rounded-xl shadow-sm hover:shadow transition-all duration-300 group cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                Geri Dön
              </button>
            </div>

            {/* Makale Gönderimine Kapalı Widget */}
            <div className="flex flex-col bg-white border border-slate-200/80 rounded-2xl shadow-sm mb-6 overflow-hidden font-sans text-slate-800 mt-2">
              <div className="flex items-center justify-between p-5 bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="relative flex h-3.5 w-3.5 mt-[1px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-red-400"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 shadow-sm bg-red-500"></span>
                  </div>
                  <h3 className="text-[1.15rem] font-bold text-slate-900 m-0 leading-none tracking-tight">
                    Makale Gönderimine Kapalı
                  </h3>
                </div>
                <span className="text-[0.8rem] text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 mr-0.5" />
                  01.04.2026 16:45
                </span>
              </div>

              <div className="p-6">
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(true)}
                  className="flex text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline transition-colors cursor-pointer bg-transparent border-none p-0 items-center gap-1"
                  id="openSubmissionHistoryModal"
                >
                  <span>Makale Gönderim Tarihçesi</span>
                  <ChevronRight className="w-3 h-3 text-[0.65rem]" />
                </button>
              </div>
            </div>

            {/* Tab Content Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm"
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                  {(() => {
                    const tab = TABS.find((t) => t.id === activeTab);
                    const Icon = tab?.icon || BookOpen;
                    return (
                      <>
                        <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          {tab?.label}
                        </h2>
                      </>
                    );
                  })()}
                </div>

                {/* Tab Content */}
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>

            {/* Stats Row (below content) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {[
                { label: 'Makale Sayısı', value: metadata.articlesCount || '120+', icon: FileText, colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                { label: 'Yayın Süresi', value: metadata.reviewTime || '6 Hafta', icon: Clock, colorClass: 'text-blue-600 bg-blue-50 border-blue-100' },
                { label: 'Kabul Oranı', value: metadata.acceptRate || '20%', icon: BarChart2, colorClass: 'text-violet-600 bg-violet-50 border-violet-100' },
                { label: 'Takipçi', value: followCount.toString(), icon: Bell, colorClass: 'text-amber-600 bg-amber-50 border-amber-100' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${stat.colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-slate-900 leading-none">{stat.value}</div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ─── NEW SECTION: İSTATİSTİKLER ─── */}
            <section className="mt-10 mb-10">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-5 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-600" />
                {lang === 'TR' ? 'İstatistikler' : 'Statistics'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                {[
                  {
                    id: 'precheck',
                    label: lang === 'TR' ? 'Ön Kontrol Süresi' : 'Pre-check Time',
                    value: lang === 'TR' ? journalConfig.stats.precheck.TR : journalConfig.stats.precheck.EN,
                    tooltip: lang === 'TR' 
                      ? 'Makalenin gönderiminden değerlendirmesiz iade, doğrudan ret/kabul veya ilk editör atamasına kadar geçen ortalama süreyi kapsar.'
                      : 'Covers the average time from submission to non-evaluated return, direct rejection/acceptance, or first editor assignment.'
                  },
                  {
                    id: 'evaluation',
                    label: lang === 'TR' ? 'Değerlendirme Süresi' : 'Evaluation Time',
                    value: lang === 'TR' ? journalConfig.stats.evaluation.TR : journalConfig.stats.evaluation.EN,
                    tooltip: lang === 'TR'
                      ? 'Makalenin gönderiminden nihai kararın verilmesine kadar geçen ortalama süreyi ifade eder.'
                      : 'Refers to the average time from article submission to the final decision.'
                  },
                  {
                    id: 'publication',
                    label: lang === 'TR' ? 'Yayım Süresi' : 'Publication Time',
                    value: lang === 'TR' ? journalConfig.stats.publication.TR : journalConfig.stats.publication.EN,
                    tooltip: lang === 'TR'
                      ? 'Makalenin kabulünden yayımlanmasına kadar geçen ortalama süredir. Erken görünümde yayımlanan makaleler de bu süreye dahildir.'
                      : 'Average time from article acceptance to publication. Articles published in early access are also included in this duration.'
                  }
                ].map((metric) => (
                  <div 
                    key={metric.id} 
                    className="relative bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center transition-all duration-300 hover:border-emerald-500 hover:shadow-md group"
                  >
                    <div className="text-sm text-slate-500 font-bold mb-3 flex items-center justify-center gap-1.5">
                      <span>{metric.label}</span>
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onMouseEnter={() => setHoveredTooltip(metric.id)}
                          onMouseLeave={() => setHoveredTooltip(null)}
                          className="text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none"
                        >
                          <Info className="w-4 h-4 cursor-pointer" />
                        </button>
                        {hoveredTooltip === metric.id && (
                          <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl leading-relaxed text-center font-normal">
                            {metric.tooltip}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-3xl font-black text-emerald-700 leading-none">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>

              <a 
                href={`/tr/pub/${effectiveSlug}/rejection-statistics`} 
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="mt-4 flex text-xs font-bold text-emerald-600 hover:text-emerald-700 underline transition-colors cursor-pointer bg-transparent border-none p-0 items-center gap-1 w-fit"
              >
                <span>{lang === 'TR' ? 'Tüm İstatistikleri Görüntüle' : 'View All Statistics'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </section>

            {/* ─── NEW SECTION: ARŞİV ─── */}
            <section className="mb-10" id="latest-issue-section">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-5 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                {lang === 'TR' ? 'Arşiv' : 'Archive'}
              </h2>
              
              <div className="relative flex flex-col md:flex-row bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 gap-6 min-h-[220px]">
                {/* Journal Cover column */}
                <div className="w-full md:w-[150px] shrink-0 flex items-center justify-center">
                  <div className="relative group w-28 md:w-full">
                    <div className="absolute -inset-1 bg-slate-100 rounded-xl blur-sm group-hover:bg-slate-200/80 transition-all duration-300" />
                    <img 
                      src={metadata.cover || JOURNAL_COVER} 
                      className="relative w-full rounded-lg shadow-md border border-slate-200/50 object-cover animate-fade-in-up" 
                      alt="Journal Cover"
                      style={{ aspectRatio: '3/4', objectFit: 'cover' }}
                    />
                  </div>
                </div>

                {/* Content & Tabs column */}
                <div className="flex-1 flex flex-col">
                  {/* Tab header buttons */}
                  <div className="flex border-b border-slate-100 pb-3 mb-4 gap-4" role="tablist" aria-label="Arşiv Sekmeleri">
                    <button 
                      onClick={() => setActiveArchiveTab('latest')}
                      className={`pb-1 text-sm font-extrabold transition-all duration-200 border-b-2 cursor-pointer ${
                        activeArchiveTab === 'latest' 
                          ? 'border-emerald-600 text-emerald-700' 
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                      role="tab" 
                      aria-selected={activeArchiveTab === 'latest'}
                    >
                      {lang === 'TR' ? 'Son Sayılar' : 'Latest Issues'}
                    </button>
                    <button 
                      onClick={() => setActiveArchiveTab('special')}
                      className={`pb-1 text-sm font-extrabold transition-all duration-200 border-b-2 cursor-pointer ${
                        activeArchiveTab === 'special' 
                          ? 'border-emerald-600 text-emerald-700' 
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                      role="tab" 
                      aria-selected={activeArchiveTab === 'special'}
                    >
                      {lang === 'TR' ? 'Özel Sayılar' : 'Special Issues'}
                    </button>
                  </div>

                  {/* Tab Contents */}
                  {activeArchiveTab === 'latest' ? (
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ARCHIVE_ISSUES.map((issue) => (
                          <a 
                            key={issue.id}
                            href={issue.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20 rounded-xl transition-all font-semibold text-xs text-slate-700 hover:text-emerald-700"
                          >
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-700 rounded-md font-bold">{issue.year}</span>
                            <span>Cilt {issue.volume}, Sayı {issue.number}</span>
                          </a>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-50 flex">
                        <a 
                          href={`https://dergipark.org.tr/tr/pub/${effectiveSlug}/archive`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex text-xs font-bold text-emerald-600 hover:text-emerald-700 underline transition-colors cursor-pointer bg-transparent border-none p-0 items-center gap-1"
                        >
                          <span>{lang === 'TR' ? 'Tüm Sayıları Görüntüle' : 'View All Issues'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {SPECIAL_ISSUES.map((issue) => (
                          <a 
                            key={issue.id}
                            href={issue.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20 rounded-xl transition-all gap-1 text-left"
                          >
                            <span className="text-xs font-bold text-slate-800 leading-tight flex-1">{issue.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono self-start sm:self-center bg-slate-200/50 px-2 py-0.5 rounded-md">{issue.date}</span>
                          </a>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-50 flex">
                        <a 
                          href={`https://dergipark.org.tr/tr/pub/${effectiveSlug}/archive`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex text-xs font-bold text-emerald-600 hover:text-emerald-700 underline transition-colors cursor-pointer bg-transparent border-none p-0 items-center gap-1"
                        >
                          <span>{lang === 'TR' ? 'Tüm Sayıları Görüntüle' : 'View All Issues'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ─── NEW SECTION: MAKALELER ─── */}
            <section className="mb-10" id="articles-section">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                {lang === 'TR' ? 'Makaleler' : 'Articles'}
              </h2>

              {/* Desktop Tabs Header */}
              <div className="hidden md:flex border-b border-slate-200 mb-6 gap-2" role="tablist">
                {[
                  { id: 'latest', label: lang === 'TR' ? 'Son Makaleler' : 'Latest Articles' },
                  { id: 'cited', label: lang === 'TR' ? 'En Çok Atıf Alanlar' : 'Most Cited' },
                  { id: 'downloaded', label: lang === 'TR' ? 'En Çok İndirilenler' : 'Most Downloaded' },
                  { id: 'popular', label: lang === 'TR' ? 'En Çok Görüntülenenler' : 'Most Viewed' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveArticlesTab(tab.id as any)}
                    className={`px-4 py-2 text-xs font-bold transition-all duration-200 border-b-2 -mb-[2px] cursor-pointer ${
                      activeArticlesTab === tab.id 
                        ? 'border-emerald-600 text-emerald-700' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                    role="tab"
                    aria-selected={activeArticlesTab === tab.id}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Mobile Select Dropdown */}
              <div className="md:hidden relative mb-6">
                <button
                  onClick={() => setMobileArticlesSelectOpen(!mobileArticlesSelectOpen)}
                  className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm font-bold text-xs text-slate-700 cursor-pointer text-left"
                >
                  <span>
                    {activeArticlesTab === 'latest' && (lang === 'TR' ? 'Son Makaleler' : 'Latest Articles')}
                    {activeArticlesTab === 'cited' && (lang === 'TR' ? 'En Çok Atıf Alanlar' : 'Most Cited')}
                    {activeArticlesTab === 'downloaded' && (lang === 'TR' ? 'En Çok İndirilenler' : 'Most Downloaded')}
                    {activeArticlesTab === 'popular' && (lang === 'TR' ? 'En Çok Görüntülenenler' : 'Most Viewed')}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileArticlesSelectOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileArticlesSelectOpen && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200/80 rounded-xl shadow-lg overflow-hidden py-1">
                    {[
                      { id: 'latest', label: lang === 'TR' ? 'Son Makaleler' : 'Latest Articles' },
                      { id: 'cited', label: lang === 'TR' ? 'En Çok Atıf Alanlar' : 'Most Cited' },
                      { id: 'downloaded', label: lang === 'TR' ? 'En Çok İndirilenler' : 'Most Downloaded' },
                      { id: 'popular', label: lang === 'TR' ? 'En Çok Görüntülenenler' : 'Most Viewed' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveArticlesTab(tab.id as any);
                          setMobileArticlesSelectOpen(false);
                        }}
                        className={`w-full text-left p-3.5 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer ${
                          activeArticlesTab === tab.id ? 'bg-emerald-50/40 text-emerald-700 font-bold' : 'text-slate-600'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Articles List */}
              <div className="space-y-4">
                {getSortedArticles().map((article) => (
                  <article 
                    key={article.id} 
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-emerald-200/60 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left"
                  >
                    <div className="flex-1 space-y-2.5">
                      {/* Top labels */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-wider">
                          {article.type}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          <Globe className="w-3 h-3" />
                          {lang === 'TR' ? 'Açık Erişim' : 'Open Access'}
                        </span>
                        
                        {/* Quick Stats display depending on active tab for rich context */}
                        {activeArticlesTab === 'cited' && (
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {lang === 'TR' ? `Atıf: ${article.citations}` : `Citations: ${article.citations}`}
                          </span>
                        )}
                        {activeArticlesTab === 'downloaded' && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {lang === 'TR' ? `İndirilme: ${article.downloads}` : `Downloads: ${article.downloads}`}
                          </span>
                        )}
                        {activeArticlesTab === 'popular' && (
                          <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                            {lang === 'TR' ? `Görüntülenme: ${article.views}` : `Views: ${article.views}`}
                          </span>
                        )}
                      </div>

                      {/* Title & authors */}
                      <div className="space-y-1">
                        <a 
                          href={article.url} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm font-bold text-slate-800 hover:text-emerald-600 leading-snug transition-colors"
                        >
                          {article.title}
                        </a>
                        
                        <div className="flex flex-wrap items-center text-xs text-slate-500 font-medium">
                          {article.authors.map((author, index) => (
                            <span key={index} className="inline-flex items-center">
                              {index > 0 && <span className="mx-1 text-slate-300">,</span>}
                              <a href={`/tr/pub/@${author.name.toLowerCase().replace(/\s+/g, '')}`} onClick={(e) => e.preventDefault()} className="hover:text-emerald-600">
                                {author.name}
                              </a>
                              {author.isPrimary && <sup className="text-emerald-500 font-bold ml-[1px]">*</sup>}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Meta dates and pages */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                        <span>{article.date}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{article.pages}</span>
                      </div>
                    </div>

                    {/* Actions buttons */}
                    <div className="flex items-center gap-2 self-stretch md:self-auto justify-end border-t border-slate-100 pt-3 md:border-none md:pt-0">
                      <button 
                        type="button"
                        onClick={() => {
                          setFavoriteArticles((prev) => ({
                            ...prev,
                            [article.id]: !prev[article.id]
                          }));
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          favoriteArticles[article.id] 
                            ? 'bg-amber-50 border-amber-200 text-amber-500' 
                            : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 text-slate-400 hover:text-amber-500'
                        }`}
                        title={lang === 'TR' ? 'Favorilere Ekle' : 'Add to Favorites'}
                      >
                        <Star className={`w-4 h-4 ${favoriteArticles[article.id] ? 'fill-amber-500' : ''}`} />
                      </button>
                      
                      <a 
                        href={article.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{lang === 'TR' ? 'PDF Görüntüle' : 'View PDF'}</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* ─── NEW SECTION: DERGİ BİLGİLERİ ─── */}
            <section className="mb-10 mt-10">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-5 flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-600" />
                {lang === 'TR' ? 'Dergi Bilgileri' : 'Journal Information'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm text-left">
                <div>
                  <h3 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-1">e-ISSN</h3>
                  <p className="text-base font-bold text-slate-800">{journalConfig.eIssn}</p>
                </div>
                
                <div>
                  <h3 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-1">ISSN</h3>
                  <p className="text-base font-bold text-slate-800">{metadata.issn || '2146-0590'}</p>
                </div>

                <div>
                  <h3 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-1">{lang === 'TR' ? 'Başlangıç' : 'Founded'}</h3>
                  <p className="text-base font-bold text-slate-800">{journalConfig.founded}</p>
                </div>

                <div>
                  <h3 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-1">{lang === 'TR' ? 'Yayımcı' : 'Publisher'}</h3>
                  <p className="text-base font-bold text-slate-800">
                    {getTabContent(metadata.publisher) || (lang === 'TR' ? 'Marmara Üniversitesi' : 'Marmara University')}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-1">{lang === 'TR' ? 'Bilimsel Yayın Koordinatörü' : 'Scientific Publication Coordinator'}</h3>
                  <p className="text-sm font-semibold text-slate-700">
                    {journalConfig.coordinator.name}
                    <br />
                    <a href={`mailto:${journalConfig.coordinator.email}`} className="text-emerald-600 hover:text-emerald-700 underline font-bold transition-colors">
                      {journalConfig.coordinator.email}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-1">{lang === 'TR' ? 'Baş Editör' : 'Editor-in-Chief'}</h3>
                  <p className="text-sm font-semibold text-slate-700">
                    {journalConfig.editor.name}
                    <br />
                    <a href={`mailto:${journalConfig.editor.email}`} className="text-emerald-600 hover:text-emerald-700 underline font-bold transition-colors">
                      {journalConfig.editor.email}
                    </a>
                  </p>
                </div>

                <div className="md:col-span-1">
                  <h3 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-1">{lang === 'TR' ? 'Yayın Modeli' : 'Publication Model'}</h3>
                  <p className="text-sm font-bold text-slate-800">
                    {lang === 'TR' ? journalConfig.model.TR : journalConfig.model.EN}
                  </p>
                </div>

                <div className="md:col-span-1">
                  <h3 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-1">{lang === 'TR' ? 'Dizinler' : 'Indexes'}</h3>
                  <p className="text-sm font-bold text-slate-800">
                    {metadata.index || journalConfig.indexes}
                  </p>
                </div>

                <div className="md:col-span-2 flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
                  <div />
                  <a 
                    href={`/tr/pub/${effectiveSlug}/rss`} 
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold text-xs underline transition-colors"
                  >
                    <Rss className="w-4 h-4 text-amber-500 fill-amber-500/10" />
                    RSS
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-5">

            {/* Keşfet Menu Card */}
            <div className="mb-6 max-lg:hidden">
              <div className="flex justify-start items-center w-full gap-[15px] mb-5">
                <h2 className="text-[1.1rem] font-extrabold text-slate-900 uppercase pb-2.5 border-b-2 border-emerald-600 inline-block m-0">
                  Keşfet
                </h2>
              </div>
              <nav aria-label="Explore Menu">
                <ul className="list-none bg-white rounded-2xl border border-slate-200/80 overflow-hidden p-0 m-0 max-lg:hidden shadow-sm">
                  {[
                    { id: 'hakkinda', label: 'Hakkında' },
                    { id: 'amac-kapsam', label: 'Amaç ve Kapsam' },
                    { id: 'ucret-politikasi', label: 'Ücret Politikası' },
                    { id: 'yayin-kurulu', label: 'Dergi Kurulları' },
                    { id: 'istatistikler', label: 'İstatistikler' },
                    { id: 'yazim-ilkeleri', label: 'Yazım Kuralları' },
                    { id: 'yayin-etigi', label: 'Etik İlkeler ve Yayın Politikası' },
                    { id: 'dizinler', label: 'Dizinler' },
                    { id: 'iletisim', label: 'Dergi İletişim' }
                  ].map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab(item.id);
                            const el = document.getElementById('latest-issue-section');
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                            }
                          }}
                          className={`w-full text-left block px-5 py-3 border-b border-slate-100 last:border-b-0 text-slate-500 font-medium transition-all duration-200 cursor-pointer text-[13px] ${
                            isActive
                              ? 'bg-emerald-600 text-white pl-[25px] font-bold no-underline'
                              : 'underline decoration-1 underline-offset-2 hover:bg-emerald-600 hover:text-white hover:pl-[25px] hover:no-underline'
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Index Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Star className="w-4 h-4 text-emerald-600" />
                Dizinler
              </h3>
              <div className="flex flex-col gap-2">
                {['TR Dizin', 'Crossref', 'OpenAIRE', 'DOAJ', 'Academia.edu'].map((idx, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all duration-200 cursor-default">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">{idx}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-gradient-to-b from-emerald-900 to-slate-950 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden text-white border border-emerald-900/50">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/20 blur-[40px] rounded-full pointer-events-none" />
              <h3 className="text-sm font-extrabold flex items-center gap-2 border-b border-white/10 pb-3 relative z-10">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Hızlı Erişim
              </h3>
              <div className="flex flex-col gap-1.5 relative z-10">
                {[
                  { label: 'Son Sayı', action: () => navigate(`/${effectiveSlug}/current`) },
                  { label: 'Arşiv', action: () => navigate(`/${effectiveSlug}/archives`) },
                  { label: 'Makale Gönder', action: () => navigate('/dashboard/yazar/submit-wizard') },
                  { label: 'Makale Takip', action: () => navigate('/dashboard/yazar/submissions') },
                  { label: 'Dergi Politikaları', action: () => navigate(`/${effectiveSlug}/policies`) },
                ].map((link, i) => (
                  <button
                    key={i}
                    onClick={link.action}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white font-semibold text-xs transition-colors cursor-pointer text-left group"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* Makale Gönderim Tarihçesi Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 font-sans"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-base font-bold text-slate-900">Makale Gönderim Tarihçesi</h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Timeline Content */}
              <div className="p-6 space-y-6">
                <div className="space-y-6">
                  {/* Item 1 */}
                  <div className="flex gap-4 relative pb-2 border-l-2 border-emerald-500 pl-5 ml-2">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Haziran 2026 Sayısı</h4>
                      <p className="text-xs text-slate-500 mt-1">Makale alımları 9 Mart 2026 - 31 Mart 2026 tarihleri arasında planlanmıştı.</p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-md text-amber-800 text-[11px] font-semibold mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Editoryal yoğunluk nedeniyle 21 Mart 2026 itibariyle erken kapatılmıştır.
                      </div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex gap-4 relative pb-2 border-l-2 border-slate-200 pl-5 ml-2">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700">Aralık 2025 Sayısı</h4>
                      <p className="text-xs text-slate-500 mt-1">Makale alımları 1 Eylül 2025 - 30 Eylül 2025 tarihleri arasında gerçekleştirildi.</p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-md text-emerald-800 text-[11px] font-semibold mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Süreç başarıyla tamamlandı.
                      </div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex gap-4 relative pl-5 ml-2">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white shadow-sm" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400">Gelecek Dönem (Aralık 2026 Sayısı)</h4>
                      <p className="text-xs text-slate-400 mt-1">Makale alım tarihleri ilerleyen tarihlerde duyurulacaktır.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-4 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
