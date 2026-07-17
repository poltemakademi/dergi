import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { MOCK_JOURNALS } from '../lib/mockData';
import type { MockJournal } from '../lib/mockData';


interface JournalState {
  journals: MockJournal[];
  isLoading: boolean;
  error: string | null;
  fetchJournals: () => Promise<void>;
}

export const useJournalStore = create<JournalState>((set) => ({
  journals: MOCK_JOURNALS, // initialize with mock data as fallback
  isLoading: false,
  error: null,

  fetchJournals: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: fetchedData, error } = await supabase
        .from('journals')
        .select('*');

      if (error) throw error;


      // If we receive valid journals from the server, we use them.
      // We will also merge them with mock data details (like covers, ISSN, tr names) 
      // if those aren't fully populated by the backend, ensuring a premium visual UI.
      if (Array.isArray(fetchedData) && fetchedData.length > 0) {
        const mergedJournals = fetchedData.map((fetched: any) => {
          // Find matching mock journal by ID or name to merge rich static assets
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
            description: fetched.description || mockMatch?.description || { EN: '', TR: '' },
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
        set({ journals: mergedJournals, isLoading: false });
      } else {
        // If empty response, keep mock data
        set({ journals: MOCK_JOURNALS, isLoading: false });
      }
    } catch (err: any) {
      console.warn('Failed to fetch live journals, using fallback mock data:', err.message || err);
      // Fail-safe: keep mock data on error
      set({ journals: MOCK_JOURNALS, error: err.message || 'Failed to fetch journals', isLoading: false });
    }
  }
}));
