import { create } from 'zustand';

export interface Journal {
  id: string;
  name: string;
  tr: string;
  issn: string;
  index: string;
  indexColor: string;
  cover: string;
  impactFactor: string;
  reviewTime: string;
  acceptRate: string;
  articles: string;
}

interface JournalState {
  journals: Journal[];
  isLoading: boolean;
  error: string | null;
  fetchJournals: () => Promise<void>;
}

const mockJournals: Journal[] = [
  { id: 'JS', name: 'Journal of Space Exploration', tr: 'Uzay Keşifleri Dergisi', issn: '2845-901X', index: 'Scopus Indexed', indexColor: 'text-emerald-700 bg-emerald-50 border-emerald-200', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop', impactFactor: '3.8', reviewTime: '4 Weeks Avg', acceptRate: '18%', articles: '342' },
  { id: 'AM', name: 'Annals of Modern Medicine', tr: 'Modern Tıp Yıllıkları', issn: '1992-0453', index: 'Web of Science', indexColor: 'text-blue-700 bg-blue-50 border-blue-200', cover: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop', impactFactor: '4.5', reviewTime: '6 Weeks Avg', acceptRate: '12%', articles: '512' },
  { id: 'ET', name: 'Engineering & Tech Review', tr: 'Mühendislik ve Teknoloji İncelemeleri', issn: '3012-7822', index: 'Crossref Pending', indexColor: 'text-amber-700 bg-amber-50 border-amber-200', cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop', impactFactor: '2.1', reviewTime: '8 Weeks Avg', acceptRate: '25%', articles: '198' },
  { id: 'QC', name: 'Quantum Computing Letters', tr: 'Kuantum Hesaplama Mektupları', issn: '4451-229X', index: 'Scopus Indexed', indexColor: 'text-emerald-700 bg-emerald-50 border-emerald-200', cover: 'https://images.unsplash.com/photo-1614935151651-0bea6508ab6b?q=80&w=600&auto=format&fit=crop', impactFactor: '5.2', reviewTime: '3 Weeks Avg', acceptRate: '10%', articles: '120' },
  { id: 'ES', name: 'Earth & Environmental Science', tr: 'Dünya ve Çevre Bilimleri', issn: '5512-8812', index: 'Web of Science', indexColor: 'text-blue-700 bg-blue-50 border-blue-200', cover: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=600&auto=format&fit=crop', impactFactor: '2.9', reviewTime: '5 Weeks Avg', acceptRate: '20%', articles: '289' },
  { id: 'AI', name: 'Artificial Intelligence Horizon', tr: 'Yapay Zeka Ufku', issn: '9912-445X', index: 'Scopus Indexed', indexColor: 'text-emerald-700 bg-emerald-50 border-emerald-200', cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop', impactFactor: '6.4', reviewTime: '4 Weeks Avg', acceptRate: '14%', articles: '456' },
];

export const useJournalStore = create<JournalState>((set) => ({
  journals: [],
  isLoading: false,
  error: null,
  fetchJournals: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ journals: mockJournals, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch journals', isLoading: false });
    }
  },
}));
