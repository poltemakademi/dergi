import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { MOCK_JOURNALS } from '../lib/mockData';

interface JournalState {
  journals: any[];
  isLoading: boolean;
  error: string | null;
  fetchJournals: () => Promise<void>;
}

export const useJournalStore = create<JournalState>((set) => ({
  journals: [],
  isLoading: false,
  error: null,

  fetchJournals: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: fetchedData, error } = await supabase
        .from('journals')
        .select('*');

      if (error) throw error;

      // 1. Map database journals and merge them with mock data if a match exists.
      const dbJournals = (fetchedData || []).map((fetched: any) => {
        const mockMatch = MOCK_JOURNALS.find(
          (mj) => mj.id.toLowerCase() === (fetched.id || '').toString().toLowerCase() ||
            mj.slug.toLowerCase() === (fetched.slug || '').toString().toLowerCase() ||
            mj.name.toLowerCase() === (fetched.name || '').toString().toLowerCase()
        );

        return {
          id: fetched.id || mockMatch?.id || 'JOURNAL',
          slug: fetched.slug || mockMatch?.slug || (fetched.name || '').toLowerCase().replace(/\s+/g, '-'),
          name: fetched.name || mockMatch?.name || '',
          tr: fetched.tr || mockMatch?.tr || fetched.name || '',
          issn: fetched.issn || mockMatch?.issn || 'XXXX-XXXX',
          index: fetched.index || mockMatch?.index || 'Crossref Indexed',
          indexColor: fetched.indexColor || mockMatch?.indexColor || 'text-slate-700 bg-slate-50 border-slate-200',
          cover: fetched.cover || fetched.cover_image || mockMatch?.cover || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
          impactFactor: fetched.impactFactor || mockMatch?.impactFactor || '0.0',
          reviewTime: fetched.reviewTime || mockMatch?.reviewTime || '4 Weeks Avg',
          acceptRate: fetched.acceptRate || mockMatch?.acceptRate || '20%',
          articlesCount: fetched.articlesCount || fetched.articles_count || mockMatch?.articlesCount || '0',
          description: fetched.description || mockMatch?.description || { EN: fetched.name || '', TR: fetched.name || '' },
          about: fetched.about || mockMatch?.about || { EN: '', TR: '' },
          aimsScope: fetched.aimsScope || mockMatch?.aimsScope || { EN: '', TR: '' },
          writingPrinciples: fetched.writingPrinciples || mockMatch?.writingPrinciples || { EN: '', TR: '' },
          publisher: fetched.publisher || mockMatch?.publisher || { EN: '', TR: '' },
          contact: fetched.contact || mockMatch?.contact || { EN: '', TR: '' },
          editorialBoard: fetched.editorialBoard || mockMatch?.editorialBoard || [],
          advisoryBoard: fetched.advisoryBoard || mockMatch?.advisoryBoard || [],
          articles: fetched.articles || mockMatch?.articles || [],
          announcements: fetched.announcements || mockMatch?.announcements || []
        };
      });

      // 2. Filter mock journals that are not represented in the database list
      const unmatchedMockJournals = MOCK_JOURNALS.filter((mj) => {
        return !dbJournals.some((dbj) =>
          dbj.name.toLowerCase() === mj.name.toLowerCase() ||
          dbj.id.toLowerCase() === mj.id.toLowerCase() ||
          dbj.slug.toLowerCase() === mj.slug.toLowerCase()
        );
      });

      // 3. Combine both lists (DB journals first, then mock journals)
      const combinedJournals = [...dbJournals, ...unmatchedMockJournals];
      set({ journals: combinedJournals, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch live journals, using mock data:', err.message || err);
      set({ journals: MOCK_JOURNALS as any[], error: null, isLoading: false });
    }
  }
}));
