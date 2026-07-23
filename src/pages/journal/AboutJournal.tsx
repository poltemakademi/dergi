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
  ShieldCheck,
  CheckCircle2,
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

const TABS_RAW = [
  { id: 'hakkinda', label: 'Hakkında', icon: Info },
  { id: 'amac-kapsam', label: 'Amaç ve Kapsam', icon: Target },
  { id: 'ucret-politikasi', label: 'Ücret Politikası', icon: FileText },
  { id: 'dergi-kurullari', label: 'Dergi Kurulları', icon: Users },
  { id: 'istatistikler', label: 'İstatistikler', icon: BarChart2 },
  { id: 'yazim-kurallari', label: 'Yazım Kuralları', icon: PenLine },
  { id: 'etik-ilkeler-ve-yayin-politikasi', label: 'Etik İlkeler ve Yayın Politikası', icon: FileText },
  { id: 'dizinler', label: 'Dizinler', icon: BookOpen },
  { id: 'dergi-iletisim', label: 'Dergi İletişim', icon: Mail },
];

const EDITORS_BOARD = [
  {
    title: 'Prof. Dr.',
    name: 'Mehmet Selim Arslan',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    initials: 'MA',
    specialties: ['İş Hukuku', 'İş ve Sosyal Güvenlik Hukuku', 'Hukuk ve Yasal Çalışmalar']
  },
  {
    title: 'Doç. Dr.',
    name: 'Ayşe Yılmaz',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    initials: 'AY',
    specialties: ['Hukuk ve Yasal Çalışmalar', 'Ceza Hukuku', 'Uluslararası Ceza Hukuku']
  },
  {
    title: 'Doç. Dr.',
    name: 'Burak Kaya',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    initials: 'BK',
    specialties: ['Ticaret Hukuku']
  },
  {
    title: 'Doç. Dr.',
    name: 'Elif Demir',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    initials: 'ED',
    specialties: ['İş Hukuku']
  },
  {
    title: 'Dr. Öğr. Üyesi',
    name: 'Zeynep Şahin',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    initials: 'ZŞ',
    specialties: ['İdare Hukuku']
  },
  {
    title: 'Dr. Öğr. Üyesi',
    name: 'Caner Yıldırım',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    initials: 'CY',
    specialties: ['Yasa Çatışmaları', 'Uluslararası Tahkim']
  }
];

const PUBLISHING_BOARD = [
  {
    title: 'Dr. Öğr. Üyesi',
    name: 'Kerem Özkan',
    institution: 'Marmara University',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    initials: 'KÖ',
    specialties: ['Anayasa Hukuku', 'Uluslararası İnsani ve İnsan Hakları Hukuku']
  },
  {
    title: 'Arş. Gör.',
    name: 'Murat Çelik',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    initials: 'MÇ',
    specialties: ['Uluslararası Kamu Hukuku']
  },
  {
    title: 'Arş. Gör.',
    name: 'Selin Aksoy',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    initials: 'SA',
    specialties: ['Şirketler ve Dernekler Hukuku', 'Ticaret Hukuku']
  },
  {
    title: 'Arş. Gör.',
    name: 'Merve Aydın',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    initials: 'MA',
    specialties: ['Çevre Hukuku', 'Uluslararası Kamu Hukuku']
  },
  {
    title: 'Arş. Gör.',
    name: 'Emre Öztürk',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    initials: 'EÖ',
    specialties: ['Hukuk Tarihi']
  },
  {
    title: 'Arş. Gör.',
    name: 'Tarık Erdem',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=400&auto=format&fit=crop&q=80',
    initials: 'TE',
    specialties: ['Vergi Hukuku']
  },
  {
    title: 'Arş. Gör.',
    name: 'Deniz Bozkurt',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    initials: 'DB',
    specialties: ['Roma Hukuku']
  },
  {
    title: 'Arş. Gör.',
    name: 'Onur Doğan',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
    initials: 'OD',
    specialties: ['Medeni Usul ve İcra İflas Hukuku']
  },
  {
    title: 'Arş. Gör.',
    name: 'Yasemin Koç',
    institution: 'Marmara Üniversitesi Hukuk Fakültesi',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80',
    initials: 'YK',
    specialties: ['Aile Hukuku', 'Mülkiyet Hukuku', 'Sözleşme Hukuku']
  }
];

const ADVISORY_BOARD = [
  { name: 'Prof. Dr. Alexander Weber', institution: 'Heidelberg Universität, Almanya' },
  { name: 'Prof. Dr. Sophie Laurent', institution: 'Université Paris I, Fransa' },
  { name: 'Prof. Dr. David Sterling', institution: 'Oxford University, İngiltere' },
  { name: 'Prof. Dr. Hiroshi Takahashi', institution: 'Tokyo University, Japonya' },
  { name: 'Prof. Dr. Tariq Al-Mansoor', institution: 'Cairo University, Mısır' },
  { name: 'Prof. Dr. Javier Fernandez', institution: 'Universidad Complutense de Madrid, İspanya' },
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
    editor: { name: 'Prof. Dr. Mehmet Selim Arslan', email: 'msarslan@marmara.edu.tr' },
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
  const { t, lang } = useTranslation();
  const abtT = (t as any)?.aboutJournal || {};

  const TABS = TABS_RAW.map((tab) => ({
    ...tab,
    label: abtT?.tabs?.[tab.id] || tab.label,
  }));

  const [activeTab, setActiveTab] = useState('hakkinda');
  const [followCount, setFollowCount] = useState(552);
  const [isFollowing, setIsFollowing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    const syncTabFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && TABS_RAW.some((t) => t.id === hash)) {
        setActiveTab(hash);
      } else if (!hash) {
        setActiveTab('hakkinda');
      }
    };

    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);
    return () => window.removeEventListener('hashchange', syncTabFromHash);
  }, []);

  const handleTabSelect = (tabId: string, shouldScroll = true) => {
    setActiveTab(tabId);
    try {
      window.history.replaceState(null, '', `#${tabId}`);
    } catch (e) {
      // ignore
    }
    if (shouldScroll) {
      const el = document.getElementById('journal-main-slot') || document.getElementById('journal-tab-content-card');
      if (el) {
        const yOffset = -100;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }
  };

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
          <span className="text-slate-500 font-bold text-sm">
            {lang === 'TR' ? 'Dergi bilgileri yükleniyor...' : 'Loading journal details...'}
          </span>
        </div>
      </div>
    );
  }

  const displayTitle = lang === 'TR'
    ? (metadata.tr || metadata.name || 'Marmara Üniversitesi Hukuk Fakültesi Hukuk Araştırmaları Dergisi')
    : (metadata.en || (metadata.name === 'Marmara Üniversitesi Hukuk Fakültesi Hukuk Araştırmaları Dergisi' ? 'Marmara University Journal of Law Research' : metadata.name));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'hakkinda':
        return (
          <div className="space-y-6">
            <div
              className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm"
              dangerouslySetInnerHTML={{
                __html:
                  getTabContent(metadata.about) ||
                  (lang === 'TR'
                    ? `<p><strong>${displayTitle}</strong>, Marmara Üniversitesi Hukuk Fakültesi tarafından yılda iki kez (Haziran ve Aralık) yayımlanan hakemli bir hukuk dergisidir.</p>
                    <p>Dergi, hukukun tüm alanlarında özgün araştırma ve inceleme makalelerini Türkçe ve yabancı dillerde yayımlamaktadır. Dergiye gönderilen makaleler çift taraflı kör hakemlik sürecine tabi tutulmaktadır.</p>
                    <p>Dergi, 2009 yılında "Marmara Üniversitesi Hukuk Fakültesi Hukuk Araştırmaları Dergisi" adıyla yayın hayatına başlamıştır. Dergide yayımlanan makalelere <strong>TR Dizin</strong> aracılığıyla erişilebilmektedir.</p>`
                    : `<p><strong>${displayTitle}</strong> is a peer-reviewed law journal published twice a year (June and December) by Marmara University Faculty of Law.</p>
                    <p>The journal publishes original research and review articles in all fields of law in Turkish and foreign languages. Manuscripts submitted to the journal undergo a double-blind peer review process.</p>
                    <p>The journal started its publication life in 2009 under the name "Marmara University Journal of Law Research". Articles published in the journal can be accessed through <strong>TR Dizin</strong>.</p>`),
              }}
            />
            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                <CalendarDays className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase">{lang === 'TR' ? 'Yayın Periyodu' : 'Frequency'}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">{lang === 'TR' ? 'Yılda 2 Sayı (Haziran & Aralık)' : 'Bi-annual (June & December)'}</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase">{lang === 'TR' ? 'Değerlendirme' : 'Review Type'}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">{lang === 'TR' ? 'Çift Kör Hakemlik' : 'Double-Blind Peer Review'}</p>
                </div>
              </div>
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-start gap-3">
                <Globe className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase">{lang === 'TR' ? 'Erişim Modeli' : 'Access Model'}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">{lang === 'TR' ? 'Açık Erişim (CC BY 4.0)' : 'Open Access (CC BY 4.0)'}</p>
                </div>
              </div>
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-start gap-3">
                <Star className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase">{lang === 'TR' ? 'Dizinlenme' : 'Indexing'}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">{lang === 'TR' ? 'TR Dizin & Aktif Dizinler' : 'TR Dizin & Active Indexes'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'amac-kapsam':
        return (
          <div className="space-y-6">
            <div
              className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  getTabContent(metadata.aimsScope) ||
                  (lang === 'TR'
                    ? `<p><strong>${displayTitle}</strong> amacı, hukuk alanındaki özgün bilimsel çalışmaları ulusal ve uluslararası akademik camiaya sunmak, hukuki gelişmelere ve doktrine nitelikli katkıda bulunmaktır.</p>`
                    : `<p>The aim of <strong>${displayTitle}</strong> is to present original scientific studies in the field of law to the national and international academic community and contribute to legal doctrine.</p>`),
              }}
            />
            <div>
              <h3 className="text-sm font-black uppercase text-emerald-800 tracking-wider mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                {lang === 'TR' ? 'Kapsamındaki Hukuk Disiplinleri' : 'Covered Law Disciplines'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { title: lang === 'TR' ? 'Özel Hukuk' : 'Private Law', items: lang === 'TR' ? 'Medeni Hukuk, Borçlar Hukuku, Ticaret Hukuku' : 'Civil Law, Law of Obligations, Commercial Law' },
                  { title: lang === 'TR' ? 'Kamu Hukuku' : 'Public Law', items: lang === 'TR' ? 'Anayasa Hukuku, İdare Hukuku, Ceza Hukuku' : 'Constitutional, Administrative & Criminal Law' },
                  { title: lang === 'TR' ? 'Uluslararası Hukuk' : 'International Law', items: lang === 'TR' ? 'Devletler Genel Hukuku, AB Hukuku' : 'Public International Law, EU Law' },
                  { title: lang === 'TR' ? 'Hukuk Felsefesi' : 'Legal Philosophy', items: lang === 'TR' ? 'Hukuk Sosyolojisi, Hukuk Tarihi' : 'Legal Sociology, Legal History' },
                  { title: lang === 'TR' ? 'İş & Sosyal Güvenlik' : 'Labor & Social Security', items: lang === 'TR' ? 'Bireysel İş Hukuku, Toplu İş Hukuku' : 'Individual & Collective Labor Law' },
                  { title: lang === 'TR' ? 'Mali Hukuk' : 'Financial & Tax Law', items: lang === 'TR' ? 'Vergi Hukuku, Vergi Ceza Hukuku' : 'Tax Law, Tax Penalty Law' },
                ].map((field, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/20 transition-all duration-200">
                    <h4 className="text-xs font-bold text-slate-900">{field.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">{field.items}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'ucret-politikasi':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg border border-emerald-800/40">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none" />
              <div className="relative z-10 space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'TR' ? '%100 Ücretsiz & Açık Erişim' : '100% Free & Open Access'}
                </span>
                <h3 className="text-lg font-black tracking-tight text-white">
                  {lang === 'TR' ? 'Yayın ve Değerlendirme Ücret Politikası' : 'Publication and Evaluation Fee Policy'}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed max-w-2xl">
                  {lang === 'TR'
                    ? `${displayTitle}, açık erişim ilkelerini benimseyen ücretsiz bir akademik dergidir. Makale gönderimi, hakem değerlendirmesi, basım veya yayınlama aşamalarında yazarlardan hiçbir ad altında ücret talep edilmez.`
                    : `${displayTitle} is a free academic journal adhering to open-access principles. Authors are never charged any fees under any name for submission, peer review, printing, or publication.`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">{lang === 'TR' ? 'Gönderim Ücreti' : 'Submission Fee'}</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">₺0</span>
                <span className="text-[11px] text-slate-500 font-medium">{lang === 'TR' ? 'Tamamen Ücretsiz' : 'Completely Free'}</span>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">{lang === 'TR' ? 'Değerlendirme Ücreti' : 'Evaluation Fee'}</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">₺0</span>
                <span className="text-[11px] text-slate-500 font-medium">{lang === 'TR' ? 'Ücretsiz Hakemlik' : 'Free Peer-Review'}</span>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">{lang === 'TR' ? 'Yayın / APC Ücreti' : 'Publication / APC Fee'}</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">₺0</span>
                <span className="text-[11px] text-slate-500 font-medium">{lang === 'TR' ? 'Sıfır Maliyet' : 'Zero Cost'}</span>
              </div>
            </div>
          </div>
        );

      case 'dergi-kurullari':
        return (
          <div className="space-y-10">
            {/* Section 1: Editörler Kurulu */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-l-4 border-emerald-600 pl-3 pb-1">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  {lang === 'TR' ? 'Editörler Kurulu' : 'Editors Board'}
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                  {EDITORS_BOARD.length} {lang === 'TR' ? 'Üye' : 'Members'}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {EDITORS_BOARD.map((member, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex flex-col sm:flex-row items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 group relative"
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent && !parent.querySelector('.fallback-initials')) {
                                const span = document.createElement('span');
                                span.className = 'fallback-initials text-lg font-extrabold text-slate-600';
                                span.innerText = member.initials || 'ED';
                                parent.appendChild(span);
                              }
                            }}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-extrabold text-slate-600">
                            {member.initials || 'ED'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="flex-1 min-w-0 space-y-2 text-left">
                      <div>
                        <div className="inline-block">
                          <span className="text-xs font-bold text-slate-400 mr-1.5">{member.title}</span>
                          <span className="text-base font-extrabold text-slate-900 leading-snug">{member.name}</span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{member.institution}</span>
                        </div>
                      </div>

                      {/* Specialties Keywords */}
                      {member.specialties && member.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {member.specialties.map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="inline-block px-2.5 py-1 bg-black/5 text-slate-700 text-[11px] font-medium rounded-md leading-tight"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Section 2: Yayın Kurulu */}
            <div className="space-y-5 pt-4">
              <div className="flex items-center justify-between border-l-4 border-emerald-600 pl-3 pb-1">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  {lang === 'TR' ? 'Yayın Kurulu' : 'Publishing Board'}
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                  {PUBLISHING_BOARD.length} {lang === 'TR' ? 'Üye' : 'Members'}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {PUBLISHING_BOARD.map((member, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex flex-col sm:flex-row items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 group relative"
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent && !parent.querySelector('.fallback-initials')) {
                                const span = document.createElement('span');
                                span.className = 'fallback-initials text-lg font-extrabold text-slate-600';
                                span.innerText = member.initials || 'ED';
                                parent.appendChild(span);
                              }
                            }}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-extrabold text-slate-600">
                            {member.initials || 'ED'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="flex-1 min-w-0 space-y-2 text-left">
                      <div>
                        <div className="inline-block">
                          <span className="text-xs font-bold text-slate-400 mr-1.5">{member.title}</span>
                          <span className="text-base font-extrabold text-slate-900 leading-snug">{member.name}</span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{member.institution}</span>
                        </div>
                      </div>

                      {/* Specialties Keywords */}
                      {member.specialties && member.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {member.specialties.map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="inline-block px-2.5 py-1 bg-black/5 text-slate-700 text-[11px] font-medium rounded-md leading-tight"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Section 3: Danışma Kurulu */}
            <div className="space-y-5 pt-4">
              <div className="flex items-center justify-between border-l-4 border-emerald-600 pl-3 pb-1">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-600" />
                  {abtT.advisoryBoardTitle || (lang === 'TR' ? 'Danışma Kurulu' : 'Advisory Board')}
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                  {ADVISORY_BOARD.length} {lang === 'TR' ? 'Üye' : 'Members'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ADVISORY_BOARD.map((member, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl hover:border-emerald-200 hover:bg-white transition-all duration-200"
                  >
                    <h4 className="text-sm font-extrabold text-slate-900">{member.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {member.institution}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Last Updated Badge */}
            <div className="flex justify-end pt-6 border-t border-slate-100">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100/80 border border-slate-200/80 rounded-full text-xs font-bold text-slate-500">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'TR' ? 'Son Güncelleme Zamanı: 9 Nisan 2026' : 'Last Updated: April 9, 2026'}</span>
              </div>
            </div>
          </div>
        );

      case 'istatistikler':
        return (
          <div className="space-y-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              {lang === 'TR'
                ? 'Dergimize ait güncel değerlendirme, ön kontrol ve yayın süreleri istatistikleri aşağıda yer almaktadır:'
                : 'Below are the latest evaluation, pre-check, and publication duration statistics for our journal:'}
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
                  className="relative bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center transition-all duration-300 hover:border-emerald-500 hover:shadow-md group"
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

      case 'yazim-kurallari':
        return (
          <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{lang === 'TR' ? 'Makale Şablonu ve Yazım Kılavuzu' : 'Article Template & Guidelines'}</h4>
                <p className="text-xs text-slate-500 mt-1">{lang === 'TR' ? 'Makalenizi dergi şablonumuza uygun olarak hazırlayabilirsiniz.' : 'Please prepare your manuscript using our template.'}</p>
              </div>
              <button
                type="button"
                onClick={() => alert(lang === 'TR' ? 'Şablon indirme başlatıldı.' : 'Template download started.')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'TR' ? 'Şablonu İndir (.docx)' : 'Download Template (.docx)'}</span>
              </button>
            </div>

            <div
              className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  getTabContent(metadata.writingPrinciples) ||
                  (lang === 'TR'
                    ? `<p>Dergiye gönderilen makaleler aşağıdaki kurallara uygun olarak hazırlanmalıdır:</p>
                    <h4>Genel Format Kuralları</h4>
                    <ul>
                      <li>Makaleler Microsoft Word formatında (.docx) gönderilmelidir.</li>
                      <li>Makale metni Times New Roman, 12 punto, 1,5 satır aralığıyla yazılmalıdır.</li>
                      <li>Makalelerin Türkçe ve İngilizce başlık, özet (en az 150, en fazla 250 kelime) ve anahtar kelimeler (en az 3, en fazla 7) içermesi zorunludur.</li>
                    </ul>
                    <h4>Dipnot ve Atıf Usulü</h4>
                    <p>Dergide dipnot atıf sistemi kullanılmaktadır. Kaynakça metnin sonunda alfabetik sırayla verilmelidir.</p>`
                    : `<p>Manuscripts submitted to the journal must be prepared in accordance with the following rules:</p>
                    <h4>General Format Rules</h4>
                    <ul>
                      <li>Manuscripts must be submitted in Microsoft Word format (.docx).</li>
                      <li>The manuscript text should be written in Times New Roman, 12 pt, with 1.5 line spacing.</li>
                      <li>Manuscripts must include titles, abstracts (min. 150, max. 250 words), and keywords (min. 3, max. 7) in Turkish and English.</li>
                    </ul>
                    <h4>Footnotes & Citations</h4>
                    <p>Footnote citation system is used. Bibliography should be listed alphabetically at the end of the manuscript.</p>`),
              }}
            />
          </div>
        );

      case 'etik-ilkeler-ve-yayin-politikasi':
        return (
          <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
            <p className="font-medium text-slate-700">
              {abtT.ethicsTitle || (lang === 'TR' ? 'Dergimiz, yayın etiğinde yüksek standartlara bağlı olup COPE (Committee on Publication Ethics) ilkelerini benimsemektedir.' : 'Our journal strictly adheres to high publication ethics standards based on COPE (Committee on Publication Ethics) guidelines.')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {(abtT.ethicsItems || [
                { title: lang === 'TR' ? 'Çift Taraflı Kör Hakemlik' : 'Double-Blind Peer Review', desc: lang === 'TR' ? 'Yazar ve hakem kimlikleri karşılıklı olarak tamamen gizli tutulmaktadır.' : 'Author and reviewer identities remain strictly confidential.' },
                { title: lang === 'TR' ? 'İntihal & Özgünlük Denetimi' : 'Plagiarism Inspection', desc: lang === 'TR' ? 'Tüm makaleler Turnitin / iThenticate yazılımından geçirilmektedir.' : 'All manuscripts are screened via Turnitin / iThenticate.' },
                { title: lang === 'TR' ? 'Açık Erişim & Telif Hakları' : 'Open Access & Copyright', desc: lang === 'TR' ? 'Yayımlanan çalışmalar Creative Commons CC BY 4.0 lisansı altındadır.' : 'Published works are licensed under Creative Commons CC BY 4.0.' },
                { title: lang === 'TR' ? 'Çıkar Çatışması Beyanı' : 'Conflict of Interest', desc: lang === 'TR' ? 'Tüm taraf yazar, editör ve hakemlerin çıkar çatışması beyan etmesi zorunludur.' : 'All authors, editors, and reviewers must declare any conflicts of interest.' },
              ]).map((item: any, i: number) => (
                <div key={i} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'dizinler':
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              <strong>{displayTitle}</strong> aşağıdaki ulusal ve uluslararası indeks ve veri tabanlarında taranmaktadır:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'TR Dizin', desc: 'TÜBİTAK ULAKBİM Sosyal ve Beşeri Bilimler Veri Tabanı', badge: 'Aktif' },
                { name: 'Crossref', desc: 'Uluslararası Dijital Nesne Tanımlayıcı (DOI) Sağlayıcısı', badge: 'Aktif' },
                { name: 'OpenAIRE', desc: 'Avrupa Açık Erişim Bilimsel Altyapısı', badge: 'Aktif' },
                { name: 'DOAJ', desc: 'Directory of Open Access Journals', badge: 'Aktif' },
                { name: 'Academia.edu', desc: 'Akademik Yayın ve İnceleme Ağı', badge: 'Aktif' },
                { name: 'Google Scholar', desc: 'Google Akademik Arama Ağı', badge: 'Aktif' },
              ].map((idx, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-200">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{idx.name}</h4>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">{idx.badge}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{idx.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'dergi-iletisim':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{lang === 'TR' ? 'Editörlük İletişim' : 'Editorial Office'}</h4>
                <p className="text-xs text-slate-500">{journalConfig.editor.name}</p>
                <a href={`mailto:${journalConfig.editor.email}`} className="text-xs font-bold text-emerald-700 hover:underline block">
                  {journalConfig.editor.email}
                </a>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{lang === 'TR' ? 'Yayımcı & Adres' : 'Publisher & Address'}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Marmara Üniversitesi Hukuk Fakültesi, Göztepe Yerleşkesi, 34722 Kadıköy / İstanbul
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${journalConfig.editor.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>{lang === 'TR' ? 'E-posta Gönder' : 'Send Email'}</span>
              </a>
              <a
                href="https://hukuk.marmara.edu.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>{lang === 'TR' ? 'Fakülte Web Sitesi' : 'Faculty Website'}</span>
              </a>
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
                  {abtT.publisherLabel || (lang === 'TR' ? 'YAYIMCI: MARMARA ÜNİVERSİTESİ' : 'PUBLISHER: MARMARA UNIVERSITY')}
                </span>
              </div>

              {/* Journal Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                {displayTitle}
              </h1>

              {/* Meta badges row */}
              <div className="flex flex-wrap items-center gap-3 my-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-white/80 text-[11px] font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-300" />
                  {abtT.publicationModel || (lang === 'TR' ? `Yayın Modeli: ${journalConfig.model.TR}` : `Publication Model: ${journalConfig.model.EN}`)}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-white/80 text-[11px] font-semibold">
                  <CalendarDays className="w-3.5 h-3.5 text-emerald-300" />
                  {abtT.sinceYear || (lang === 'TR' ? "2009'dan beri yayında" : "Published since 2009")}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {/* Submit Article (Closed) */}
                <button
                  disabled
                  title={abtT.closedTitle || (lang === 'TR' ? 'Makale alımı şu anda kapalıdır.' : 'Manuscript submissions are currently closed.')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white font-bold text-sm cursor-not-allowed opacity-70"
                >
                  <Send className="w-4 h-4" />
                  {abtT.submitArticle || (lang === 'TR' ? 'Makale Gönder' : 'Submit Manuscript')}
                </button>

                {/* Reviewer Request */}
                <button
                  onClick={() => navigate('/dashboard/reviewer/assigned')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent backdrop-blur-sm border border-white/40 rounded-xl text-white font-bold text-sm hover:bg-white/10 hover:border-white/60 transition-all duration-200 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  {abtT.reviewerRequest || (lang === 'TR' ? 'Hakemlik İsteği Gönder' : 'Submit Reviewer Request')}
                </button>

                {/* Explore Button */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent backdrop-blur-sm border border-white/40 rounded-xl text-white font-bold text-sm hover:bg-white/10 hover:border-white/60 transition-all duration-200 cursor-pointer"
                >
                  <Menu className="w-4 h-4" />
                  {abtT.explore || (lang === 'TR' ? 'Keşfet' : 'Explore')}
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
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-[13px] transition-all duration-200 cursor-pointer ${isFollowing
                      ? 'bg-white text-emerald-700 hover:bg-white/90'
                      : 'bg-white/15 text-white hover:bg-white hover:text-emerald-700'
                      }`}
                  >
                    <Heart className={`w-3.5 h-3.5 transition-all ${isFollowing ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                    <span>{isFollowing ? (abtT.following || (lang === 'TR' ? 'Takip Ediyorsunuz' : 'Following')) : (abtT.follow || (lang === 'TR' ? 'Takip Et' : 'Follow'))}</span>
                  </button>
                  <span className="px-3 text-white/80 font-semibold text-[13px]">{followCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="mt-8 relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
            <nav className="flex items-center justify-between overflow-x-auto scrollbar-none" aria-label="Dergi Sekmeleri">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSelect(tab.id)}
                    className={`flex items-center gap-1.5 px-2.5 lg:px-3 xl:px-3.5 py-3.5 text-[12px] lg:text-[12.5px] xl:text-[13px] font-semibold whitespace-nowrap border-b-2 transition-all duration-200 cursor-pointer shrink-0 ${activeTab === tab.id
                      ? 'border-white text-white font-bold bg-white/10'
                      : 'border-transparent text-white/70 hover:text-white hover:border-white/40'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
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

          {/* Left: Dynamic Main Content Area Slot */}
          <div className="min-w-0 flex-1">
            {/* Back button */}
            <div className="mb-5">
              <button
                onClick={() => {
                  if (activeTab !== 'hakkinda') {
                    handleTabSelect('hakkinda');
                  } else {
                    navigate(-1);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-emerald-600 bg-white hover:bg-emerald-50/30 border border-slate-200/80 hover:border-emerald-200/60 rounded-xl shadow-sm hover:shadow transition-all duration-300 group cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                {activeTab !== 'hakkinda'
                  ? (lang === 'TR' ? 'Ana Sayfaya (Hakkında) Dön' : 'Back to Main View')
                  : (t.journal.back || (lang === 'TR' ? 'Geri Dön' : 'Go Back'))}
              </button>
            </div>

            {/* Dynamic Outlet Slot with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                id="journal-main-slot"
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-6"
              >
                {activeTab === 'hakkinda' ? (
                  <>
                    {/* Makale Gönderimine Kapalı Widget */}
                    <div className="flex flex-col bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden font-sans text-slate-800">
                      <div className="flex items-center justify-between p-5 bg-slate-50/50 border-b border-slate-100">
                        <div className="flex items-center gap-3.5">
                          <div className="relative flex h-3.5 w-3.5 mt-[1px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-red-400"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 shadow-sm bg-red-500"></span>
                          </div>
                          <h3 className="text-[1.15rem] font-bold text-slate-900 m-0 leading-none tracking-tight">
                            {abtT.submissionClosedBanner || (lang === 'TR' ? 'Makale Gönderimine Kapalı' : 'Closed for Manuscript Submissions')}
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
                          <span>{abtT.submissionHistory || (lang === 'TR' ? 'Makale Gönderim Tarihçesi' : 'Manuscript Submission History')}</span>
                          <ChevronRight className="w-3 h-3 text-[0.65rem]" />
                        </button>
                      </div>
                    </div>

                    {/* Tab Content Card for Hakkında */}
                    <div
                      id="journal-tab-content-card"
                      className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                        <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                          <Info className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          {abtT?.tabs?.hakkinda || (lang === 'TR' ? 'Hakkında' : 'About')}
                        </h2>
                      </div>
                      {renderTabContent()}
                    </div>

                    {/* Stats Row (below content) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
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

                    {/* ─── LANDING SECTION: İSTATİSTİKLER ─── */}
                    <section className="mt-4 mb-8">
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

                      <button
                        type="button"
                        onClick={() => handleTabSelect('istatistikler')}
                        className="mt-2 flex text-xs font-bold text-emerald-600 hover:text-emerald-700 underline transition-colors cursor-pointer bg-transparent border-none p-0 items-center gap-1 w-fit"
                      >
                        <span>{lang === 'TR' ? 'Tüm İstatistikleri Görüntüle' : 'View All Statistics'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </section>

                    {/* ─── LANDING SECTION: ARŞİV ─── */}
                    <section className="mb-8" id="latest-issue-section">
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
                              className={`pb-1 text-sm font-extrabold transition-all duration-200 border-b-2 cursor-pointer ${activeArchiveTab === 'latest'
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
                              className={`pb-1 text-sm font-extrabold transition-all duration-200 border-b-2 cursor-pointer ${activeArchiveTab === 'special'
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
                                <button
                                  type="button"
                                  onClick={() => navigate(`/${effectiveSlug}/archives`)}
                                  className="flex text-xs font-bold text-emerald-600 hover:text-emerald-700 underline transition-colors cursor-pointer bg-transparent border-none p-0 items-center gap-1"
                                >
                                  <span>{lang === 'TR' ? 'Tüm Sayıları Görüntüle' : 'View All Issues'}</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
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
                                <button
                                  type="button"
                                  onClick={() => navigate(`/${effectiveSlug}/archives`)}
                                  className="flex text-xs font-bold text-emerald-600 hover:text-emerald-700 underline transition-colors cursor-pointer bg-transparent border-none p-0 items-center gap-1"
                                >
                                  <span>{lang === 'TR' ? 'Tüm Sayıları Görüntüle' : 'View All Issues'}</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>

                    {/* ─── LANDING SECTION: MAKALELER ─── */}
                    <section className="mb-8" id="articles-section">
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
                            className={`px-4 py-2 text-xs font-bold transition-all duration-200 border-b-2 -mb-[2px] cursor-pointer ${activeArticlesTab === tab.id
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
                                className={`w-full text-left p-3.5 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer ${activeArticlesTab === tab.id ? 'bg-emerald-50/40 text-emerald-700 font-bold' : 'text-slate-600'
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
                        {getSortedArticles().map((article, idx) => (
                          <article
                            key={`${article.id}-${idx}`}
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
                                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${favoriteArticles[article.id]
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

                    {/* ─── LANDING SECTION: DERGİ BİLGİLERİ ─── */}
                    <section className="mb-8">
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
                  </>
                ) : (
                  /* Single Inner Tab View Card */
                  <div
                    id="journal-tab-content-card"
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm transition-all"
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
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-5">

            {/* Keşfet Menu Card */}
            <div className="mb-6 max-lg:hidden">
              <div className="flex justify-start items-center w-full gap-[15px] mb-4">
                <h2 className="text-[1.1rem] font-extrabold text-slate-900 uppercase pb-1 border-b-2 border-orange-600 inline-block m-0 tracking-wide">
                  {abtT.exploreMenu || (lang === 'TR' ? 'KEŞFET' : 'EXPLORE')}
                </h2>
              </div>
              <nav aria-label="Explore Menu">
                <ul className="list-none bg-white rounded-2xl border border-slate-300/90 overflow-hidden p-0 m-0 shadow-sm divide-y divide-slate-100">
                  {TABS.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => handleTabSelect(item.id)}
                          className={`w-full text-left flex items-center justify-between px-5 py-3.5 transition-all duration-200 cursor-pointer text-[13.5px] group ${isActive
                            ? 'bg-emerald-700 text-white font-bold'
                            : 'text-slate-700 font-semibold hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'
                              }`} />
                            <span className={`truncate ${isActive ? 'underline decoration-1 underline-offset-2' : ''}`}>
                              {item.label}
                            </span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 transition-all shrink-0 ${isActive
                            ? 'text-white translate-x-0.5'
                            : 'text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5'
                            }`} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>



            {/* Quick Links Card */}
            <div className="bg-gradient-to-b from-emerald-900 to-slate-950 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden text-white border border-emerald-900/50">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/20 blur-[40px] rounded-full pointer-events-none" />
              <h3 className="text-sm font-extrabold flex items-center gap-2 border-b border-white/10 pb-3 relative z-10">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                {abtT.quickLinksTitle || (lang === 'TR' ? 'Hızlı Erişim' : 'Quick Access')}
              </h3>
              <div className="flex flex-col gap-1.5 relative z-10">
                {[
                  { label: lang === 'TR' ? 'Son Sayı' : 'Last Issue', action: () => navigate(`/${effectiveSlug}/current`) },
                  { label: lang === 'TR' ? 'Arşiv' : 'Archive', action: () => navigate(`/${effectiveSlug}/archives`) },
                  { label: lang === 'TR' ? 'Makale Gönder' : 'Submit Manuscript', action: () => navigate('/dashboard/yazar/submit-wizard') },
                  { label: lang === 'TR' ? 'Makale Takip' : 'Manuscript Tracking', action: () => navigate('/dashboard/yazar/submissions') },
                  { label: lang === 'TR' ? 'Dergi Politikaları' : 'Journal Policies', action: () => navigate(`/${effectiveSlug}/policies`) },
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
                <h3 className="text-base font-bold text-slate-900">
                  {abtT.historyModalTitle || (lang === 'TR' ? 'Makale Gönderim Tarihçesi' : 'Manuscript Submission History')}
                </h3>
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
                      <h4 className="text-sm font-bold text-slate-900">
                        {lang === 'TR' ? 'Haziran 2026 Sayısı' : 'June 2026 Issue'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {lang === 'TR'
                          ? 'Makale alımları 9 Mart 2026 - 31 Mart 2026 tarihleri arasında planlanmıştı.'
                          : 'Submissions were scheduled between March 9, 2026 and March 31, 2026.'}
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-md text-amber-800 text-[11px] font-semibold mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {lang === 'TR'
                          ? 'Editoryal yoğunluk nedeniyle 21 Mart 2026 itibariyle erken kapatılmıştır.'
                          : 'Closed early as of March 21, 2026 due to editorial workload.'}
                      </div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex gap-4 relative pb-2 border-l-2 border-slate-200 pl-5 ml-2">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700">
                        {lang === 'TR' ? 'Aralık 2025 Sayısı' : 'December 2025 Issue'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {lang === 'TR'
                          ? 'Makale alımları 1 Eylül 2025 - 30 Eylül 2025 tarihleri arasında gerçekleştirildi.'
                          : 'Submissions were conducted between September 1, 2025 and September 30, 2025.'}
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-md text-emerald-800 text-[11px] font-semibold mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {lang === 'TR' ? 'Süreç başarıyla tamamlandı.' : 'Process successfully completed.'}
                      </div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex gap-4 relative pl-5 ml-2">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white shadow-sm" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400">
                        {lang === 'TR' ? 'Gelecek Dönem (Aralık 2026 Sayısı)' : 'Upcoming Period (December 2026 Issue)'}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {lang === 'TR'
                          ? 'Makale alım tarihleri ilerleyen tarihlerde duyurulacaktır.'
                          : 'Submission dates will be announced in due course.'}
                      </p>
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
                  {abtT.close || (lang === 'TR' ? 'Kapat' : 'Close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Keşfet Menu Modal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 font-sans"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80">
                <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide border-b-2 border-orange-600 inline-block pb-0.5">
                  {abtT.exploreMenu || (lang === 'TR' ? 'KEŞFET' : 'EXPLORE')}
                </h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-2 max-h-[70vh] overflow-y-auto">
                <ul className="list-none p-0 m-0 divide-y divide-slate-100">
                  {TABS.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            handleTabSelect(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left flex items-center justify-between px-4 py-3 text-[13.5px] transition-all duration-200 cursor-pointer ${isActive
                            ? 'bg-emerald-700 text-white font-bold rounded-xl'
                            : 'text-slate-700 font-semibold hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
