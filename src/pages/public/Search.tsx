import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search as SearchIcon,
  X,
  Loader2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  Filter,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useJournalStore } from '../../store/useJournalStore';

/* ─── Static filter options with reference counts ──────────────────────────── */

const PUBLISHER_TYPE_OPTIONS = [
  { value: 'Universite', label: '\u00dcniversite', count: 1812 },
  { value: 'Sahis', label: '\u015eah\u0131s', count: 633 },
  { value: 'Dernek', label: 'Dernek', count: 314 },
  { value: 'Firma', label: 'Firma', count: 153 },
  { value: 'Kamu', label: 'Kamu', count: 130 },
  { value: 'Vakif', label: 'Vak\u0131f', count: 57 },
  { value: 'Meslek Odasi', label: 'Meslek Odas\u0131', count: 28 },
  { value: 'Sendika', label: 'Sendika', count: 10 },
];

const PERIOD_OPTIONS = [
  { value: 'Haziran', label: 'Haziran', count: 1265 },
  { value: 'Mart', label: 'Mart', count: 470 },
  { value: 'Nisan', label: 'Nisan', count: 461 },
  { value: 'Ocak', label: 'Ocak', count: 416 },
  { value: 'Eylul', label: 'Eyl\u00fcl', count: 412 },
  { value: 'Aralik', label: 'Aral\u0131k', count: 412 },
  { value: 'Temmuz', label: 'Temmuz', count: 344 },
  { value: 'Agustos', label: 'A\u011fustos', count: 302 },
  { value: 'Mayis', label: 'May\u0131s', count: 242 },
  { value: 'Subat', label: '\u015eubat', count: 131 },
  { value: 'Ekim', label: 'Ekim', count: 99 },
  { value: 'Kasim', label: 'Kas\u0131m', count: 74 },
];

const INDEX_FALLBACK_OPTIONS = [
  { value: 'TR Dizin', label: 'TR Dizin', count: 956 },
  { value: 'DOAJ', label: 'DOAJ', count: 522 },
  { value: 'Scopus Indexed', label: 'Scopus', count: 170 },
  { value: 'ESCI', label: 'Emerging Sources CI (ESCI)', count: 133 },
  { value: 'SCI-EXPANDED', label: 'SCI-EXPANDED', count: 10 },
  { value: 'Web of Science', label: 'Web of Science', count: 8 },
  { value: 'Crossref Indexed', label: 'Crossref', count: 4 },
];

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
        className="w-full flex items-center justify-between px-5 py-4 text-left group hover:bg-slate-50/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className={`text-sm font-bold transition-colors ${open || activeCount > 0 ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-600'}`}>
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
      className={`flex items-center justify-between py-2 cursor-pointer group gap-3 rounded-lg px-1 -mx-1 transition-colors ${checked ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}
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
}

function ShowMoreList({ items, selected, onToggle, initialCount = 6 }: ShowMoreListProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, initialCount);
  const remaining = items.length - initialCount;

  return (
    <div>
      {visible.map(opt => (
        <CheckboxItem
          key={opt.value}
          label={opt.label}
          count={opt.count}
          checked={selected.includes(opt.value)}
          onChange={() => onToggle(opt.value)}
        />
      ))}
      {items.length > initialCount && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 py-2 border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
        >
          {expanded
            ? <><ChevronUp className="w-3.5 h-3.5" /> Daha Az</>
            : <><ChevronDown className="w-3.5 h-3.5" /> {remaining} tane daha</>}
        </button>
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

/* ─── Main Page ────────────────────────────────────────────────────────────── */

export default function Search() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const { journals, fetchJournals, isLoading } = useJournalStore();
  const [searchInput, setSearchInput] = useState(queryParam);

  // Filters
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => { fetchJournals(); }, [fetchJournals]);
  useEffect(() => { setSearchInput(queryParam); }, [queryParam]);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const executeSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchParams(searchInput ? { q: searchInput } : {});
  };
  const handleClear = () => { setSearchInput(''); setSearchParams({}); };

  /* Derive index options from store with counts */
  const indexOptions = useMemo(() => {
    const map = new Map<string, number>();
    journals.forEach(j => { if (j.index) map.set(j.index, (map.get(j.index) || 0) + 1); });
    if (map.size === 0) return INDEX_FALLBACK_OPTIONS;
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ value: label, label, count }));
  }, [journals]);

  /* Apply all filters + text search */
  const filteredJournals = useMemo(() => {
    const q = normalizeText(queryParam);
    return journals.filter(j => {
      if (q) {
        const publisherName = j.publisher?.TR || j.publisher?.EN || j.publisher || '';
        const m =
          normalizeText(j.name).includes(q) ||
          normalizeText(j.tr).includes(q) ||
          normalizeText(j.issn).includes(q) ||
          normalizeText(j.index).includes(q) ||
          normalizeText(publisherName).includes(q);
        if (!m) return false;
      }
      if (selectedIndexes.length > 0 && !selectedIndexes.includes(j.index)) return false;
      // If only "close" is selected, hide all (demo: all journals assumed open)
      if (selectedStatuses.length === 1 && selectedStatuses.includes('close')) return false;
      return true;
    });
  }, [journals, queryParam, selectedIndexes, selectedStatuses]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const activeFilterCount = selectedStatuses.length + selectedPublishers.length + selectedIndexes.length + selectedPeriods.length;
  const clearAll = () => { setSelectedStatuses([]); setSelectedPublishers([]); setSelectedIndexes([]); setSelectedPeriods([]); };

  /* Sidebar JSX (shared desktop + mobile) */
  const sidebarContent = (
    <div className="space-y-3">
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
          <span className="text-xs font-bold text-indigo-700">{activeFilterCount} filtre aktif</span>
          <button onClick={clearAll} className="text-xs font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer">
            <X className="w-3 h-3" /> Temizle
          </button>
        </div>
      )}

      {/* Makale Gonderim Durumu */}
      <FilterSection title="Makale G\u00f6nderim Durumu" activeCount={selectedStatuses.length}>
        <CheckboxItem
          label="Makale g\u00f6nderimi a\u00e7\u0131k olan dergiler"
          count={2479}
          checked={selectedStatuses.includes('open')}
          onChange={() => toggle(selectedStatuses, setSelectedStatuses, 'open')}
        />
        <CheckboxItem
          label="Makale g\u00f6nderimi kapal\u0131 olan dergiler"
          count={658}
          checked={selectedStatuses.includes('close')}
          onChange={() => toggle(selectedStatuses, setSelectedStatuses, 'close')}
        />
      </FilterSection>

      {/* Yayimci Turu */}
      <FilterSection title="Yay\u0131mc\u0131 T\u00fcr\u00fc" defaultOpen={false} activeCount={selectedPublishers.length}>
        <ShowMoreList
          items={PUBLISHER_TYPE_OPTIONS}
          selected={selectedPublishers}
          onToggle={v => toggle(selectedPublishers, setSelectedPublishers, v)}
          initialCount={6}
        />
      </FilterSection>

      {/* Dizin */}
      <FilterSection title="Dizin" defaultOpen={false} activeCount={selectedIndexes.length}>
        <ShowMoreList
          items={indexOptions}
          selected={selectedIndexes}
          onToggle={v => toggle(selectedIndexes, setSelectedIndexes, v)}
          initialCount={6}
        />
      </FilterSection>

      {/* Periyot */}
      <FilterSection title="Periyot" defaultOpen={false} activeCount={selectedPeriods.length}>
        <ShowMoreList
          items={PERIOD_OPTIONS}
          selected={selectedPeriods}
          onToggle={v => toggle(selectedPeriods, setSelectedPeriods, v)}
          initialCount={6}
        />
      </FilterSection>
    </div>
  );

  return (
    <main className="pb-24 pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-[80vh]">

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
        <div className="max-w-2xl text-left">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group w-fit">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t.directory?.back || 'Ana Sayfa'}
            </Link>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300" />
            <div className="inline-flex items-center gap-1.5 text-indigo-600 font-bold text-xs md:text-sm tracking-wider uppercase">
              <ChevronRight className="w-3.5 h-3.5" /> Arama Sonu\u00e7lar\u0131
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">
            {queryParam
              ? <>&ldquo;<span className="text-indigo-600">{queryParam}</span>&rdquo; i\u00e7in sonu\u00e7lar</>
              : 'Dergi Arama'}
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
            Akademik a\u011f\u0131m\u0131zdaki dergiler, makaleler ve DOI&apos;ler aras\u0131nda ke\u015ffedin.
          </p>
        </div>
        {!isLoading && (
          <div className="shrink-0 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-600 text-xs font-bold flex items-center gap-2 self-start md:self-auto">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>{filteredJournals.length.toLocaleString('tr-TR')} dergi bulundu</span>
          </div>
        )}
      </div>

      {/* Search bar */}
      <form onSubmit={executeSearch} className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm flex gap-3 mb-8">
        <div className="relative flex-1 group">
          <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </span>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder={t.hero?.searchPlaceholder || 'Dergi ad\u0131, ISSN veya anahtar kelime ara...'}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
          />
          {searchInput && (
            <button type="button" onClick={handleClear} className="absolute inset-y-0 right-3 flex items-center px-1 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap">
          {t.hero?.searchBtn || 'Ara'}
        </button>
        {/* Mobile filter button */}
        <button
          type="button"
          onClick={() => setShowMobileSidebar(true)}
          className="lg:hidden relative px-3.5 py-2.5 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-all font-bold text-sm flex items-center gap-1.5 cursor-pointer bg-white"
        >
          <Filter className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </form>

      {/* Active filter pills */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            ...selectedStatuses.map(v => ({ type: 'status', value: v, label: v === 'open' ? 'G\u00f6nderim A\u00e7\u0131k' : 'G\u00f6nderim Kapal\u0131' })),
            ...selectedPublishers.map(v => ({ type: 'pub', value: v, label: PUBLISHER_TYPE_OPTIONS.find(o => o.value === v)?.label || v })),
            ...selectedIndexes.map(v => ({ type: 'idx', value: v, label: v })),
            ...selectedPeriods.map(v => ({ type: 'per', value: v, label: PERIOD_OPTIONS.find(o => o.value === v)?.label || v })),
          ].map(pill => (
            <span
              key={`${pill.type}-${pill.value}`}
              className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full"
            >
              {pill.label}
              <button
                onClick={() => {
                  if (pill.type === 'status') toggle(selectedStatuses, setSelectedStatuses, pill.value);
                  else if (pill.type === 'pub') toggle(selectedPublishers, setSelectedPublishers, pill.value);
                  else if (pill.type === 'idx') toggle(selectedIndexes, setSelectedIndexes, pill.value);
                  else toggle(selectedPeriods, setSelectedPeriods, pill.value);
                }}
                className="w-4 h-4 bg-indigo-200 hover:bg-indigo-300 text-indigo-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 pl-3 pr-2 py-1.5 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 text-xs font-bold rounded-full transition-colors cursor-pointer"
          >
            T\u00fcm\u00fcn\u00fc Temizle <X className="w-2.5 h-2.5" />
          </button>
        </div>
      )}

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setShowMobileSidebar(false)} />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" /> Filtreler
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button onClick={() => setShowMobileSidebar(false)} className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">{sidebarContent}</div>
              <div className="sticky bottom-0 p-4 bg-white border-t border-slate-100">
                <button onClick={() => setShowMobileSidebar(false)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all cursor-pointer">
                  {filteredJournals.length.toLocaleString('tr-TR')} Sonucu G\u00f6ster
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className="flex gap-6 items-start">

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-28">
          <div className="flex items-center gap-2 mb-4 text-xs font-black text-slate-400 uppercase tracking-widest">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filtreler
          </div>
          {sidebarContent}
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Dergiler y\u00fckleniyor...</p>
            </div>
          ) : filteredJournals.length > 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="flex items-center justify-between mb-5 px-1">
                <span className="text-sm text-slate-500 font-medium">
                  <strong className="text-slate-800 font-bold">{filteredJournals.length.toLocaleString('tr-TR')}</strong> dergi listeleniyor
                </span>
                {activeFilterCount > 0 && (
                  <button onClick={clearAll} className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 transition-colors cursor-pointer">
                    <X className="w-3 h-3" /> Filtreleri Temizle
                  </button>
                )}
              </div>

              <AnimatePresence mode="popLayout">
                {filteredJournals.map((journal, i) => (
                  <motion.div
                    key={journal.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                  >
                    <Link
                      to={`/${journal.slug || journal.id.toLowerCase()}`}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 group shadow-sm"
                    >
                      <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 shadow border border-slate-200/50 group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={journal.cover || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=120'}
                          alt={journal.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-extrabold text-slate-800 text-sm md:text-base group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                          {journal.name}
                        </div>
                        {journal.tr && journal.tr !== journal.name && (
                          <div className="text-xs text-slate-400 font-medium italic mt-0.5 truncate">{journal.tr}</div>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2.5">
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200/50 font-mono">
                            {journal.issn || 'XXXX-XXXX'}
                          </span>
                          {journal.index && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${journal.indexColor || 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                              <CheckCircle2 className="w-3 h-3 shrink-0" /> {journal.index}
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            G\u00f6nderim A\u00e7\u0131k
                          </span>
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 shrink-0 transition-colors">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : queryParam || activeFilterCount > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-50 border border-slate-200 border-dashed rounded-[2.5rem] p-16 text-center max-w-lg mx-auto"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200">
                <SearchIcon className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Sonu\u00e7 Bulunamad\u0131</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                {queryParam
                  ? <>&ldquo;<strong>{queryParam}</strong>&rdquo; i\u00e7in herhangi bir dergi bulunamad\u0131.</>
                  : 'Se\u00e7ilen filtreler i\u00e7in sonu\u00e7 bulunamad\u0131.'}
              </p>
              <button
                onClick={() => { handleClear(); clearAll(); }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                T\u00fcm Filtreleri Temizle
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-slate-400"
            >
              <SearchIcon className="w-12 h-12 mb-4 text-slate-300" />
              <p className="text-sm font-semibold">Dergileri ve makaleleri aramak i\u00e7in yukar\u0131ya bir arama sorgusu girin.</p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
