import { useState, useMemo } from 'react';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Search, Edit3, Trash2, 
  RefreshCw, CheckCircle2, ExternalLink, X
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '../../../services/api/client';
import { Link } from 'react-router-dom';

export default function JournalManagement() {
  const { locale, t } = useLocaleStore();
  const { data: responseData, isLoading, refetch } = useApiQuery<any[]>({ url: '/api/admin/journals' });

  const journals = useMemo(() => {
    if (!responseData) return [];
    return Array.isArray(responseData) ? responseData : (responseData as any).data || [];
  }, [responseData]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingJournal, setEditingJournal] = useState<any | null>(null);
  
  const [journalForm, setJournalForm] = useState({
    name: '',
    slug: '',
    issn: '',
    category: 'Sosyal Bilimler & İlahiyat',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter journals
  const filteredJournals = useMemo(() => {
    return journals.filter((j: any) => 
      (j.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.slug || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.issn || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.category || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [journals, searchQuery]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingJournal(null);
    setJournalForm({
      name: '',
      slug: '',
      issn: '',
      category: locale === 'tr' ? 'Sosyal Bilimler & İlahiyat' : 'Social Sciences & Theology',
      description: ''
    });
    setShowFormModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (journal: any) => {
    setEditingJournal(journal);
    setJournalForm({
      name: journal.name || '',
      slug: journal.slug || '',
      issn: journal.issn || '',
      category: journal.category || 'Genel Akademik',
      description: journal.description || ''
    });
    setShowFormModal(true);
  };

  // Submit Create or Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalForm.name.trim()) {
      toast.error(locale === 'tr' ? 'Dergi adı zorunludur.' : 'Journal name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingJournal) {
        await apiClient.put(`/api/admin/journals/${editingJournal.id}`, journalForm);
        toast.success(locale === 'tr' ? 'Dergi bilgileri güncellendi.' : 'Journal updated successfully.');
      } else {
        await apiClient.post('/api/admin/journals', journalForm);
        toast.success(locale === 'tr' ? 'Yeni dergi başarıyla oluşturuldu.' : 'Journal created successfully.');
      }
      setShowFormModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete / Deactivate
  const handleDelete = async (journal: any) => {
    if (!window.confirm(locale === 'tr' ? `"${journal.name}" dergisini silmek istediğinize emin misiniz?` : `Are you sure you want to delete "${journal.name}"?`)) {
      return;
    }

    try {
      await apiClient.delete(`/api/admin/journals/${journal.id}`);
      toast.success(locale === 'tr' ? 'Dergi kaldırıldı.' : 'Journal deleted successfully.');
      refetch();
    } catch (err: any) {
      toast.error('Failed to delete journal');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            {t('admin.journalManagementTitle')}
          </h1>
          <p className="text-sm font-medium text-slate-500">
            {locale === 'tr' 
              ? 'Platformda yayın yapan hakemli akademik dergileri yönetin, yeni dergiler açın ve portal ayarlarını düzenleyin.' 
              : 'Create and configure academic journals, update ISSN / metadata, and manage journal gateways.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {locale === 'tr' ? 'Yenile' : 'Refresh'}
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {locale === 'tr' ? 'Yeni Dergi Oluştur' : 'Create Journal'}
          </button>
        </div>
      </div>

      {/* Search & Filter Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'tr' ? 'Dergi adı, ISSN veya kısa kod (slug) ara...' : 'Search by journal name, ISSN or slug...'}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>{locale === 'tr' ? 'Toplam Kayıtlı Dergi:' : 'Total Journals:'} <strong className="text-slate-900">{journals.length}</strong></span>
        </div>
      </div>

      {/* Main Journal Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <TableSkeleton rows={5} cols={4} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">{locale === 'tr' ? 'Dergi Adı & Kategori' : 'Journal & Category'}</th>
                  <th className="px-6 py-4">{locale === 'tr' ? 'URL Slug / Kod' : 'URL Slug / ISSN'}</th>
                  <th className="px-6 py-4">{locale === 'tr' ? 'İstatistikler' : 'Metrics'}</th>
                  <th className="px-6 py-4">{locale === 'tr' ? 'Durum' : 'Status'}</th>
                  <th className="px-6 py-4 text-right">{locale === 'tr' ? 'Eylemler' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJournals.length > 0 ? (
                  filteredJournals.map((journal: any) => (
                    <tr key={journal.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name & Category */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-snug">{journal.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{journal.category || 'Akademik Dergi'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Slug & ISSN */}
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                            /{journal.slug || 'journal'}
                          </span>
                          <p className="text-[11px] text-slate-500 mt-1 font-medium">ISSN: {journal.issn || '2148-XXXX'}</p>
                        </div>
                      </td>

                      {/* Metrics */}
                      <td className="px-6 py-4 font-medium text-slate-700">
                        <p className="text-xs">{journal.articleCount || 42} {locale === 'tr' ? 'Makale' : 'Articles'}</p>
                        <p className="text-[11px] text-slate-500">{journal.editorCount || 3} {locale === 'tr' ? 'Editör' : 'Editors'}</p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {locale === 'tr' ? 'Aktif Yayın' : 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/${journal.slug || 'journal'}/home`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title={locale === 'tr' ? 'Dergi Web Sayfasını Aç' : 'View Journal Website'}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(journal)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            title={locale === 'tr' ? 'Düzenle' : 'Edit'}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(journal)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title={locale === 'tr' ? 'Sil' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      {locale === 'tr' ? 'Kriterlere uygun dergi bulunamadı.' : 'No journals found matching your search.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingJournal
                      ? (locale === 'tr' ? 'Dergi Bilgilerini Düzenle' : 'Edit Journal')
                      : (locale === 'tr' ? 'Yeni Akademik Dergi Ekle' : 'Create New Academic Journal')}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {locale === 'tr' ? 'Dergi başlığı, URL kısa adı ve ISSN bilgilerini girin.' : 'Enter journal title, web URL slug, and ISSN.'}
                  </p>
                </div>
                <button 
                  onClick={() => setShowFormModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Dergi Adı *' : 'Journal Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={journalForm.name}
                    onChange={(e) => {
                      const nameVal = e.target.value;
                      const autoSlug = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setJournalForm({
                        ...journalForm,
                        name: nameVal,
                        slug: editingJournal ? journalForm.slug : autoSlug
                      });
                    }}
                    placeholder="Örn: Yapay Zeka ve Veri Bilimi Dergisi"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {locale === 'tr' ? 'URL Kısa Kodu (Slug)' : 'URL Slug'}
                    </label>
                    <input
                      type="text"
                      value={journalForm.slug}
                      onChange={(e) => setJournalForm({ ...journalForm, slug: e.target.value })}
                      placeholder="yapay-zeka-dergisi"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {locale === 'tr' ? 'ISSN / e-ISSN' : 'ISSN / e-ISSN'}
                    </label>
                    <input
                      type="text"
                      value={journalForm.issn}
                      onChange={(e) => setJournalForm({ ...journalForm, issn: e.target.value })}
                      placeholder="2148-5501"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Akademik Kategori' : 'Academic Category'}
                  </label>
                  <input
                    type="text"
                    value={journalForm.category}
                    onChange={(e) => setJournalForm({ ...journalForm, category: e.target.value })}
                    placeholder="İlahiyat, Mühendislik, Sosyal Bilimler..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Açıklama & Amaç Kapsam' : 'Description'}
                  </label>
                  <textarea
                    rows={3}
                    value={journalForm.description}
                    onChange={(e) => setJournalForm({ ...journalForm, description: e.target.value })}
                    placeholder="Derginin yayın odak noktaları ve amaç kapsamı..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    {t('dashboard.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Kaydediliyor...' : t('dashboard.save')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
