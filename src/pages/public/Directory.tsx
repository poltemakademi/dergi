import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  CheckCircle2,
  LayoutGrid,
  ArrowRight,
  Loader2,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Info,
  User,
  Building
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useJournalStore } from '../../store/useJournalStore';

/* ─── Static filter options with reference counts ──────────────────────────── */

const PUBLISHER_TYPE_OPTIONS = [
  { value: 'Universite', label: 'Üniversite', count: 1812 },
  { value: 'Sahis', label: 'Şahıs', count: 633 },
  { value: 'Dernek', label: 'Dernek', count: 314 },
  { value: 'Firma', label: 'Firma', count: 153 },
  { value: 'Kamu', label: 'Kamu', count: 130 },
  { value: 'Vakif', label: 'Vakıf', count: 57 },
  { value: 'Meslek Odasi', label: 'Meslek Odası', count: 28 },
  { value: 'Sendika', label: 'Sendika', count: 10 },
];

const PERIOD_OPTIONS = [
  { value: 'Ocak', label: 'Ocak', count: 416 },
  { value: 'Subat', label: 'Şubat', count: 131 },
  { value: 'Mart', label: 'Mart', count: 470 },
  { value: 'Nisan', label: 'Nisan', count: 461 },
  { value: 'Mayis', label: 'Mayıs', count: 242 },
  { value: 'Haziran', label: 'Haziran', count: 1265 },
  { value: 'Temmuz', label: 'Temmuz', count: 344 },
  { value: 'Agustos', label: 'Ağustos', count: 302 },
  { value: 'Eylul', label: 'Eylül', count: 412 },
  { value: 'Ekim', label: 'Ekim', count: 99 },
  { value: 'Kasim', label: 'Kasım', count: 74 },
  { value: 'Aralik', label: 'Aralık', count: 412 },
];

const INDEX_OPTIONS = [
  { value: 'TR Dizin', label: 'TR Dizin', count: 956 },
  { value: 'DOAJ', label: 'DOAJ', count: 522 },
  { value: 'Scopus Indexed', label: 'Scopus', count: 170 },
  { value: 'ESCI', label: 'Emerging Sources Citation Index (ESCI)', count: 133 },
  { value: 'SCI-EXPANDED', label: 'Science Citation Index Expanded (SCI-EXPANDED)', count: 10 },
  { value: 'Arts & Humanities Citation Index (A&HCI)', label: 'Arts & Humanities Citation Index (A&HCI)', count: 4 },
  { value: 'Social Sciences Citation Index (SSCI)', label: 'Social Sciences Citation Index (SSCI)', count: 3 },
];

/* Helper to map deterministic attributes if not present in DB */
const getJournalAttributes = (journal: any) => {
  const id = (journal.id || '').toUpperCase();

  // Submission Status
  const submissionStatus = journal.submissionStatus || journal.submission_status || (id === 'ET' ? 'close' : 'open');

  // Publisher Type
  let publisherType = journal.publisherType || journal.publisher_type;
  if (!publisherType) {
    if (id === 'JS') publisherType = 'Dernek';
    else if (id === 'AM') publisherType = 'Universite';
    else if (id === 'ET') publisherType = 'Firma';
    else publisherType = 'Universite'; // default fallback
  }

  // Period
  let periods = journal.periods || journal.period;
  if (!periods) {
    if (id === 'JS') periods = ['Haziran', 'Aralik'];
    else if (id === 'AM') periods = ['Mart', 'Eylul'];
    else if (id === 'ET') periods = ['Ocak', 'Temmuz'];
    else periods = ['Haziran', 'Aralik'];
  }
  if (typeof periods === 'string') {
    periods = periods.split(',').map((p: string) => p.trim());
  }

  // Index
  const index = journal.index || 'Crossref Pending';

  return { submissionStatus, publisherType, periods, index };
};

/* ─── FilterSection ────────────────────────────────────────────────────────── */

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  activeCount?: number;
}

function FilterSection({ title, children, defaultOpen = true, activeCount = 0 }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200/80 rounded-2xl bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left group hover:bg-slate-50/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className={`text-sm font-bold transition-colors ${open || activeCount > 0 ? 'text-indigo-700 font-extrabold' : 'text-slate-700 group-hover:text-indigo-600'}`}>
            {title}
          </span>
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-slate-100">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── CheckboxItem ─────────────────────────────────────────────────────────── */

interface CheckboxItemProps {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}

function CheckboxItem({ label, count, checked, onChange }: CheckboxItemProps) {
  return (
    <label
      className={`flex items-center justify-between py-2 cursor-pointer group gap-3 rounded-lg px-2 -mx-1 transition-colors ${checked ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}
      onClick={onChange}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-all duration-200 ${checked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300 group-hover:border-indigo-400'}`}>
          {checked && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
              <path d="M1 4l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className={`text-sm leading-tight transition-colors truncate ${checked ? 'text-indigo-700 font-semibold' : 'text-slate-600 group-hover:text-slate-900'}`}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className={`shrink-0 text-[11px] font-bold px-1.5 py-0.5 rounded-md transition-colors ${checked ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 bg-slate-100'}`}>
          {count.toLocaleString('tr-TR')}
        </span>
      )}
    </label>
  );
}

/* ─── ShowMoreList ─────────────────────────────────────────────────────────── */

interface ShowMoreListProps {
  items: { value: string; label: string; count?: number }[];
  selected: string[];
  onToggle: (v: string) => void;
  initialCount?: number;
  searchPlaceholder?: string;
}

function ShowMoreList({ items, selected, onToggle, initialCount = 6, searchPlaceholder }: ShowMoreListProps) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter(item =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const visible = expanded ? filteredItems : filteredItems.slice(0, initialCount);
  const remaining = filteredItems.length - initialCount;

  return (
    <div className="space-y-1">
      {searchPlaceholder && (
        <div className="mb-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
          />
        </div>
      )}
      {visible.map(opt => (
        <CheckboxItem
          key={opt.value}
          label={opt.label}
          count={opt.count}
          checked={selected.includes(opt.value)}
          onChange={() => onToggle(opt.value)}
        />
      ))}
      {!search && items.length > initialCount && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 py-2 border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
        >
          {expanded
            ? <><ChevronUp className="w-3.5 h-3.5" /> Daha Az</>
            : <><ChevronDown className="w-3.5 h-3.5" /> Tümünü Göster ({remaining} daha)</>}
        </button>
      )}
      {search && filteredItems.length === 0 && (
        <div className="text-center py-2 text-xs text-slate-400">Sonuç bulunamadı</div>
      )}
    </div>
  );
}

/* Helper to normalize text for Turkish-aware, accent-insensitive search */
const normalizeText = (str: string | null | undefined): string => {
  if (!str) return '';
  return str
    .toString()
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i');
};

/* ─── Main Directory Component ──────────────────────────────────────────────── */

export default function Directory() {
  const { t, lang } = useTranslation();
  const { journals, isLoading, fetchJournals } = useJournalStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Dynamic Tabs and Sorting states
  const [activeTab, setActiveTab] = useState<'journal' | 'article' | 'researcher' | 'publisher'>('journal');
  const [sortBy, setSortBy] = useState<string>('smart');

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ─── Data Aggregations ─────────────────────────────────────────────────── */

  // 1. Compile all articles from all journals
  const allArticles = useMemo(() => {
    const list: any[] = [];
    journals.forEach((j) => {
      if (j.articles && Array.isArray(j.articles)) {
        j.articles.forEach((a: any) => {
          list.push({
            ...a,
            journalId: j.id,
            journalName: j.name,
            journalSlug: j.slug || j.id.toLowerCase()
          });
        });
      }
    });
    return list;
  }, [journals]);

  // 2. Compile unique researchers from article authors
  const researchers = useMemo(() => {
    const unique = new Map<string, any>();

    // Add default pre-defined mock researchers
    const defaultMocks = [
      { name: 'Prof. Dr. Sarah Jenkins', institution: 'MIT, Aerospace Engineering', count: 12, email: 's.jenkins@mit.edu' },
      { name: 'Dr. Michael Chen', institution: 'Stanford University, Orbital Mechanics', count: 8, email: 'mchen@stanford.edu' },
      { name: 'Prof. Dr. Elizabeth Vance', institution: 'Oxford University, Clinical Oncology', count: 15, email: 'e.vance@oxford.ac.uk' },
      { name: 'Dr. Yusuf Yılmaz', institution: 'Hacettepe Üniversitesi, Kardiyoloji', count: 9, email: 'yusuf.yilmaz@hacettepe.edu.tr' },
      { name: 'Prof. Kenan Demir', institution: 'ODTÜ, Bilgisayar Mühendisliği', count: 14, email: 'kdemir@metu.edu.tr' },
      { name: 'Dr. Elena Rostova', institution: 'Roscosmos Research Div', count: 5, email: 'e.rostova@roscosmos.ru' },
    ];

    defaultMocks.forEach(m => unique.set(m.name.toLowerCase(), m));

    // Aggregate authors dynamically from articles
    allArticles.forEach(a => {
      if (typeof a.author === 'string') {
        const authors = a.author.split(/,|&/).map((name: string) => name.trim());
        authors.forEach((name: string) => {
          if (!name) return;
          const key = name.toLowerCase();
          if (!unique.has(key)) {
            unique.set(key, {
              name,
              institution: 'Academia Network Researcher',
              count: 1,
              email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@academianexus.com`
            });
          }
        });
      }
    });

    return Array.from(unique.values());
  }, [allArticles]);

  // 3. Compile unique publishers from journals
  const publishers = useMemo(() => {
    const unique = new Map<string, any>();

    // Add default mock publishers
    const defaultPubs = [
      { name: 'Academia Nexus Publishing Group', type: lang === 'TR' ? 'Dernek / Kuruluş' : 'Association / Organization', count: 1, location: 'Ankara, TR' },
      { name: 'Academia Nexus Medical Press', type: lang === 'TR' ? 'Üniversite / Kamu' : 'University / Public', count: 1, location: 'İstanbul, TR' },
      { name: 'Academia Nexus Engineering House', type: lang === 'TR' ? 'Firma / Şirket' : 'Company / Corporate', count: 1, location: 'İzmir, TR' },
    ];

    defaultPubs.forEach(p => unique.set(p.name.toLowerCase(), p));

    journals.forEach(j => {
      const pubName = j.publisher?.TR || j.publisher?.EN || j.publisher;
      if (pubName && typeof pubName === 'string') {
        const key = pubName.toLowerCase();
        if (!unique.has(key)) {
          unique.set(key, {
            name: pubName,
            type: j.publisherType === 'Universite' ? (lang === 'TR' ? 'Üniversite' : 'University') : (lang === 'TR' ? 'Yayımcı Kuruluş' : 'Publisher House'),
            count: 1,
            location: lang === 'TR' ? 'Türkiye' : 'Turkey'
          });
        } else {
          const existing = unique.get(key);
          existing.count += 1;
        }
      }
    });

    return Array.from(unique.values());
  }, [journals, lang]);

  /* Derive index options from store with counts */
  const indexOptions = useMemo(() => {
    const map = new Map<string, number>();
    journals.forEach(j => {
      if (j.index) map.set(j.index, (map.get(j.index) || 0) + 1);
    });
    if (map.size === 0) return INDEX_OPTIONS;
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ value: label, label, count }));
  }, [journals]);

  const toggleFilter = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const activeFilterCount =
    selectedStatuses.length +
    selectedPublishers.length +
    selectedIndexes.length +
    selectedPeriods.length;

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedPublishers([]);
    setSelectedIndexes([]);
    setSelectedPeriods([]);
    handleSearchChange('');
  };

  /* ─── Filtering Arrays ──────────────────────────────────────────────────── */

  const filteredJournals = useMemo(() => {
    return journals.filter((journal) => {
      const q = normalizeText(searchQuery);
      if (q) {
        const publisherName = journal.publisher?.TR || journal.publisher?.EN || journal.publisher || '';
        const matchesText =
          normalizeText(journal.name).includes(q) ||
          normalizeText(journal.tr).includes(q) ||
          normalizeText(journal.issn).includes(q) ||
          normalizeText(journal.index).includes(q) ||
          normalizeText(publisherName).includes(q);
        if (!matchesText) return false;
      }

      const { submissionStatus, publisherType, periods, index } = getJournalAttributes(journal);

      if (selectedStatuses.length > 0 && !selectedStatuses.includes(submissionStatus)) return false;
      if (selectedPublishers.length > 0 && !selectedPublishers.includes(publisherType)) return false;
      if (selectedIndexes.length > 0 && !selectedIndexes.includes(index)) return false;
      if (selectedPeriods.length > 0) {
        const hasMatchingPeriod = periods.some((p: string) => selectedPeriods.includes(p));
        if (!hasMatchingPeriod) return false;
      }

      return true;
    });
  }, [journals, searchQuery, selectedStatuses, selectedPublishers, selectedIndexes, selectedPeriods]);

  const filteredArticles = useMemo(() => {
    return allArticles.filter((art) => {
      const q = normalizeText(searchQuery);
      if (q) {
        const matchesText =
          normalizeText(art.title).includes(q) ||
          normalizeText(art.author).includes(q) ||
          normalizeText(art.journalName).includes(q) ||
          normalizeText(art.doi).includes(q);
        if (!matchesText) return false;
      }

      const journal = journals.find((j) => j.id === art.journalId);
      if (!journal) return true;

      const { submissionStatus, publisherType, periods, index } = getJournalAttributes(journal);

      if (selectedStatuses.length > 0 && !selectedStatuses.includes(submissionStatus)) return false;
      if (selectedPublishers.length > 0 && !selectedPublishers.includes(publisherType)) return false;
      if (selectedIndexes.length > 0 && !selectedIndexes.includes(index)) return false;
      if (selectedPeriods.length > 0) {
        const hasMatchingPeriod = periods.some((p: string) => selectedPeriods.includes(p));
        if (!hasMatchingPeriod) return false;
      }

      return true;
    });
  }, [allArticles, journals, searchQuery, selectedStatuses, selectedPublishers, selectedIndexes, selectedPeriods]);

  const filteredResearchers = useMemo(() => {
    return researchers.filter((res) => {
      const q = normalizeText(searchQuery);
      if (q) {
        return (
          normalizeText(res.name).includes(q) ||
          normalizeText(res.institution).includes(q) ||
          normalizeText(res.email).includes(q)
        );
      }
      return true;
    });
  }, [researchers, searchQuery]);

  const filteredPublishers = useMemo(() => {
    return publishers.filter((pub) => {
      const q = normalizeText(searchQuery);
      if (q) {
        return (
          normalizeText(pub.name).includes(q) ||
          normalizeText(pub.location).includes(q) ||
          normalizeText(pub.type).includes(q)
        );
      }
      return true;
    });
  }, [publishers, searchQuery]);

  /* ─── Sorting Arrays ────────────────────────────────────────────────────── */

  const sortedJournals = useMemo(() => {
    const list = [...filteredJournals];
    if (sortBy === 'az') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    } else if (sortBy === 'za') {
      list.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
    }
    return list;
  }, [filteredJournals, sortBy]);

  const sortedArticles = useMemo(() => {
    const list = [...filteredArticles];
    if (sortBy === 'az') {
      list.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
    } else if (sortBy === 'za') {
      list.sort((a, b) => b.title.localeCompare(a.title, 'tr'));
    }
    return list;
  }, [filteredArticles, sortBy]);

  const sortedResearchers = useMemo(() => {
    const list = [...filteredResearchers];
    if (sortBy === 'az') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    } else if (sortBy === 'za') {
      list.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
    }
    return list;
  }, [filteredResearchers, sortBy]);

  const sortedPublishers = useMemo(() => {
    const list = [...filteredPublishers];
    if (sortBy === 'az') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    } else if (sortBy === 'za') {
      list.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
    }
    return list;
  }, [filteredPublishers, sortBy]);

  /* Sidebar content reusable for desktop and mobile drawer */
  const sidebarContent = (
    <div className="space-y-4">
      {/* Active Filter Clear Info */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <span className="text-xs font-bold text-indigo-700">
            {activeFilterCount} {lang === 'TR' ? 'filtre aktif' : 'filters active'}
          </span>
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> {lang === 'TR' ? 'Temizle' : 'Clear'}
          </button>
        </div>
      )}

      {/* Makale Gönderim Durumu */}
      <FilterSection
        title={lang === 'TR' ? 'Makale Gönderim Durumu' : 'Article Submission Status'}
        activeCount={selectedStatuses.length}
      >
        <div className="space-y-1">
          <CheckboxItem
            label={lang === 'TR' ? 'Makale gönderimi açık olan dergiler' : 'Open for submissions'}
            count={2479}
            checked={selectedStatuses.includes('open')}
            onChange={() => toggleFilter(selectedStatuses, setSelectedStatuses, 'open')}
          />
          <CheckboxItem
            label={lang === 'TR' ? 'Makale gönderimi kapalı olan dergiler' : 'Closed for submissions'}
            count={658}
            checked={selectedStatuses.includes('close')}
            onChange={() => toggleFilter(selectedStatuses, setSelectedStatuses, 'close')}
          />
        </div>
      </FilterSection>

      {/* Yayımcı Türü */}
      <FilterSection
        title={lang === 'TR' ? 'Yayımcı Türü' : 'Publisher Type'}
        defaultOpen={false}
        activeCount={selectedPublishers.length}
      >
        <ShowMoreList
          items={PUBLISHER_TYPE_OPTIONS}
          selected={selectedPublishers}
          onToggle={v => toggleFilter(selectedPublishers, setSelectedPublishers, v)}
          initialCount={6}
        />
      </FilterSection>

      {/* Dizin */}
      <FilterSection
        title={lang === 'TR' ? 'Dizin' : 'Index'}
        defaultOpen={false}
        activeCount={selectedIndexes.length}
      >
        <ShowMoreList
          items={indexOptions}
          selected={selectedIndexes}
          onToggle={v => toggleFilter(selectedIndexes, setSelectedIndexes, v)}
          initialCount={6}
        />
      </FilterSection>

      {/* Periyot */}
      <FilterSection
        title={lang === 'TR' ? 'Periyot' : 'Period'}
        defaultOpen={false}
        activeCount={selectedPeriods.length}
      >
        <ShowMoreList
          items={PERIOD_OPTIONS}
          selected={selectedPeriods}
          onToggle={v => toggleFilter(selectedPeriods, setSelectedPeriods, v)}
          initialCount={6}
          searchPlaceholder={lang === 'TR' ? 'Ara...' : 'Search...'}
        />
      </FilterSection>
    </div>
  );

  return (
    <main className="pb-24 pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-[85vh]">
      {/* Subheader and Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-slate-100 pb-8">
        <div className="max-w-2xl text-left">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t.directory.back}
            </Link>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300"></div>
            <div className="inline-flex items-center gap-1.5 text-indigo-600 font-bold text-xs md:text-sm tracking-wider uppercase">
              <ChevronRight className="w-3.5 h-3.5" />
              {lang === 'TR' ? 'Arama Sonuçları' : 'Search Results'}
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">
            {activeFilterCount > 0 || searchQuery ? (lang === 'TR' ? 'Arama Sonuçları' : 'Search Results') : t.directory.title}
          </h1>
          <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed">
            {t.directory.desc}
          </p>
        </div>

        <div className="shrink-0 self-start md:self-auto">
          <div className="px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-600 text-xs font-bold flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-indigo-600" />
            <span>
              {activeTab === 'journal'
                ? filteredJournals.length
                : activeTab === 'article'
                  ? filteredArticles.length
                  : activeTab === 'researcher'
                    ? filteredResearchers.length
                    : filteredPublishers.length}{' '}
              {t.directory.activeCount}
            </span>
          </div>
        </div>
      </div>

      {/* Info Alert Banner */}
      <div className="mb-8 p-4 md:p-5 bg-gradient-to-r from-blue-500/10 to-indigo-500/5 border border-blue-200/80 rounded-2xl md:rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0 shadow-inner">
            <Info className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700 leading-relaxed text-left">
            {lang === 'TR' ? (
              <>
                Makale gönderebileceğiniz uygun dergileri keşfetmek için{' '}
                <span className="text-blue-600 font-bold">Dergi Sihirbazını</span> kullanabilirsiniz. Dergi Sihirbazı için{' '}
                <Link to="/basvurular/dergi" className="font-extrabold text-blue-600 hover:text-blue-800 underline underline-offset-4 decoration-2 decoration-blue-300 hover:decoration-blue-500 transition-colors">
                  tıklayınız.
                </Link>
              </>
            ) : (
              <>
                You can use the{' '}
                <span className="text-blue-600 font-bold">Journal Wizard</span> to discover suitable journals to submit your articles. Click{' '}
                <Link to="/basvurular/dergi" className="font-extrabold text-blue-600 hover:text-blue-800 underline underline-offset-4 decoration-2 decoration-blue-300 hover:decoration-blue-500 transition-colors">
                  here
                </Link>{' '}
                for the Journal Wizard.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden overflow-y-auto shadow-2xl flex flex-col text-left"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <span>{lang === 'TR' ? 'Filtreler' : 'Filters'}</span>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">{sidebarContent}</div>
              <div className="sticky bottom-0 p-4 bg-white border-t border-slate-100">
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  {activeTab === 'journal'
                    ? filteredJournals.length
                    : activeTab === 'article'
                      ? filteredArticles.length
                      : activeTab === 'researcher'
                        ? filteredResearchers.length
                        : filteredPublishers.length}{' '}
                  {lang === 'TR' ? 'Sonucu Göster' : 'Show Results'}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main layout container */}
      <div className="flex gap-8 items-start text-left">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-32">
          <div className="flex items-center gap-2 mb-4 text-xs font-black text-slate-400 uppercase tracking-widest">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{lang === 'TR' ? 'Filtreler' : 'Filters'}</span>
          </div>
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
            {sidebarContent}
          </div>
        </aside>

        {/* Results container */}
        <div className="flex-1 min-w-0">
          {/* Search Box & Mobile Filter Toggle */}
          <div className="flex gap-3 mb-6 items-center">
            <div className="relative flex-1 group">
              <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  const params = new URLSearchParams(window.location.search);
                  if (val) params.set('q', val); else params.delete('q');
                  setSearchParams(params);
                }}
                placeholder={t.directory.searchPlaceholder || (lang === 'TR' ? 'İsim veya ISSN ile ara...' : 'Search by name or ISSN...')}
                className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium shadow-sm text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute inset-y-0 right-3 flex items-center px-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="lg:hidden relative p-3 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 rounded-2xl transition-all font-bold text-sm flex items-center gap-1.5 cursor-pointer bg-white"
            >
              <Filter className="w-5 h-5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Dynamic Entity Tabs & Sorting Dropdown */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2 mb-6 gap-4">
            <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-none pb-1">
              {[
                { id: 'article', label: lang === 'TR' ? 'Makale' : 'Articles', count: filteredArticles.length, icon: BookOpen },
                { id: 'journal', label: lang === 'TR' ? 'Dergi' : 'Journals', count: filteredJournals.length, icon: LayoutGrid },
                { id: 'researcher', label: lang === 'TR' ? 'Araştırmacı' : 'Researchers', count: filteredResearchers.length, icon: User },
                { id: 'publisher', label: lang === 'TR' ? 'Yayımcı' : 'Publishers', count: filteredPublishers.length, icon: Building },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2.5 px-4 py-3 border-b-2 font-extrabold text-sm transition-all whitespace-nowrap cursor-pointer ${isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div className="flex flex-col items-start leading-none gap-1">
                      <span>{tab.label}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{tab.count.toLocaleString('tr-TR')}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-bold hidden sm:inline uppercase tracking-wider">{lang === 'TR' ? 'Sıralama:' : 'Sort By:'}</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all cursor-pointer"
              >
                <option value="smart">{lang === 'TR' ? 'Akıllı Sıralama' : 'Smart Sorting'}</option>
                <option value="az">{lang === 'TR' ? "A'dan Z'ye" : 'A to Z'}</option>
                <option value="za">{lang === 'TR' ? "Z'den A'ya" : 'Z to A'}</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                ...selectedStatuses.map(v => ({ type: 'status', value: v, label: v === 'open' ? (lang === 'TR' ? 'Gönderim Açık' : 'Submissions Open') : (lang === 'TR' ? 'Gönderim Kapalı' : 'Submissions Closed') })),
                ...selectedPublishers.map(v => ({ type: 'pub', value: v, label: PUBLISHER_TYPE_OPTIONS.find(o => o.value === v)?.label || v })),
                ...selectedIndexes.map(v => ({ type: 'idx', value: v, label: indexOptions.find(o => o.value === v)?.label || v })),
                ...selectedPeriods.map(v => ({ type: 'per', value: v, label: PERIOD_OPTIONS.find(o => o.value === v)?.label || v })),
              ].map(pill => (
                <span
                  key={`${pill.type}-${pill.value}`}
                  className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full shadow-sm"
                >
                  {pill.label}
                  <button
                    onClick={() => {
                      if (pill.type === 'status') toggleFilter(selectedStatuses, setSelectedStatuses, pill.value);
                      else if (pill.type === 'pub') toggleFilter(selectedPublishers, setSelectedPublishers, pill.value);
                      else if (pill.type === 'idx') toggleFilter(selectedIndexes, setSelectedIndexes, pill.value);
                      else toggleFilter(selectedPeriods, setSelectedPeriods, pill.value);
                    }}
                    className="w-4 h-4 bg-indigo-200 hover:bg-indigo-300 text-indigo-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 pl-3 pr-2 py-1.5 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 text-xs font-bold rounded-full transition-colors cursor-pointer"
              >
                {lang === 'TR' ? 'Tümünü Temizle' : 'Clear All'} <X className="w-2.5 h-2.5" />
              </button>
            </div>
          )}

          {/* Cards Grid / List view switcher based on activeTab */}
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 space-y-3"
              >
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <span className="text-slate-400 text-xs font-bold tracking-wider uppercase">
                  {lang === 'TR' ? 'Veriler Yükleniyor...' : 'Loading Data...'}
                </span>
              </motion.div>
            ) : (activeTab === 'journal' ? sortedJournals : activeTab === 'article' ? sortedArticles : activeTab === 'researcher' ? sortedResearchers : sortedPublishers).length > 0 ? (
              <motion.div
                layout
                key={`${activeTab}-view`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {/* ─── JOURNALS VIEW ─── */}
                {activeTab === 'journal' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedJournals.map((journal) => (
                      <div
                        key={journal.id}
                        className="bg-white rounded-2xl md:rounded-[2.2rem] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_70px_-15px_rgba(79,70,229,0.15)] hover:border-indigo-300/80 transition-all duration-500 group/card relative flex flex-col overflow-hidden text-left"
                      >
                        <Link to={`/${journal.slug || journal.id.toLowerCase()}`} className="flex flex-col flex-1 h-full cursor-pointer">
                          {/* Cover Area */}
                          <div className="h-28 md:h-48 relative overflow-hidden shrink-0 block">
                            <div className="absolute inset-0 bg-slate-900">
                              <img
                                src={journal.cover}
                                alt={journal.name}
                                className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-700"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                            <div className="absolute bottom-3 md:bottom-4 left-3 md:left-6 right-3 md:right-6 flex items-end justify-between z-10 gap-1">
                              <div className="w-8 h-8 md:w-14 md:h-14 bg-white/20 backdrop-blur-md text-white font-black text-xs md:text-xl rounded-lg md:rounded-[1rem] flex items-center justify-center border border-white/30 shadow-lg group-hover/card:bg-indigo-50 group-hover/card:border-indigo-400 group-hover/card:scale-110 transition-all duration-500 shrink-0">
                                {journal.id}
                              </div>
                              <div className={`flex items-center gap-1 md:gap-1.5 px-1.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border ${journal.indexColor} bg-white shadow-sm scale-[0.85] md:scale-90 origin-bottom-right group-hover/card:scale-[0.95] md:group-hover/card:scale-100 transition-transform duration-500 min-w-0`}>
                                <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                                <span className="text-[9px] md:text-[10px] font-bold tracking-wide uppercase truncate">{journal.index}</span>
                              </div>
                            </div>
                          </div>

                          {/* Info Area */}
                          <div className="p-3 md:p-6 flex flex-col flex-1 justify-between space-y-3 md:space-y-6">
                            <div>
                              <h3 className="text-sm md:text-2xl font-black text-slate-900 mb-1 md:mb-2 leading-tight group-hover/card:text-indigo-700 transition-colors line-clamp-2 md:line-clamp-2" title={journal.name}>
                                {journal.name}
                              </h3>
                              <p className="text-slate-500 font-medium text-[10px] md:text-sm italic line-clamp-1 md:line-clamp-none">
                                {journal.tr}
                              </p>
                            </div>

                            {/* Card CTA Actions */}
                            <div className="mt-auto pt-3 md:pt-6 border-t border-slate-100/80 flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[8px] md:text-[10px] font-black tracking-widest text-slate-400 uppercase mb-0 md:mb-0.5">E-ISSN</span>
                                <span className="text-[10px] md:text-sm font-bold text-slate-700 font-mono">{journal.issn}</span>
                              </div>
                              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover/card:bg-indigo-50 group-hover/card:border-indigo-100 transition-colors shrink-0">
                                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-slate-400 group-hover/card:text-indigo-600 transition-colors group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* ─── ARTICLES VIEW ─── */}
                {activeTab === 'article' && (
                  <div className="space-y-4">
                    {sortedArticles.map((art) => (
                      <div
                        key={art.id}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-indigo-200/80 transition-all text-left relative overflow-hidden group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-extrabold text-slate-800 text-sm md:text-base leading-snug group-hover:text-indigo-600 transition-colors">
                              {art.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-semibold mt-1">
                              {art.author}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-md border border-slate-200/50">
                                DOI: {art.doi}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {lang === 'TR' ? 'Yayın Yeri:' : 'Published in:'}{' '}
                                <Link to={`/${art.journalSlug}`} className="text-indigo-600 font-extrabold hover:underline">
                                  {art.journalName}
                                </Link>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ─── RESEARCHERS VIEW ─── */}
                {activeTab === 'researcher' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedResearchers.map((res, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-indigo-200/80 transition-all text-left flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm uppercase">
                          {res.name.split(' ').pop()?.charAt(0) || 'R'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-slate-800 text-sm md:text-base leading-tight truncate">
                            {res.name}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                            {res.institution}
                          </p>
                          <div className="mt-2.5 flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-md shrink-0">
                              {res.count} {lang === 'TR' ? 'Makale' : 'Articles'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono truncate">
                              {res.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ─── PUBLISHERS VIEW ─── */}
                {activeTab === 'publisher' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedPublishers.map((pub, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-indigo-200/80 transition-all text-left flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <Building className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-slate-800 text-sm md:text-base leading-tight truncate">
                            {pub.name}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                            {pub.type} • {pub.location}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200/50 px-2 py-0.5 rounded-md">
                              {pub.count} {lang === 'TR' ? 'Aktif Dergi' : 'Active Journals'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              /* Empty state */
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-50 border border-slate-200 border-dashed rounded-[2.5rem] p-16 text-center max-w-lg mx-auto"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200">
                  <Search className="w-7 h-7 text-slate-400 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{t.directory.noResults}</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                  {t.directory.noResultsDesc.replace('{query}', searchQuery || (lang === 'TR' ? 'seçilen filtreler' : 'selected filters'))}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {t.directory.reset}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

