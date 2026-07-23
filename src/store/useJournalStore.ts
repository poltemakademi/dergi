import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { MOCK_JOURNALS } from '../lib/mockData';

export const getJournalAbbreviation = (journal: any): string => {
  if (!journal) return 'JN';
  if (journal.abbreviation && journal.abbreviation.trim()) return journal.abbreviation.trim();
  if (journal.shortCode && journal.shortCode.trim()) return journal.shortCode.trim();
  
  const idStr = (journal.id || '').toString().trim();
  if (idStr.length > 0 && idStr.length <= 4 && !idStr.includes('-')) {
    return idStr.toUpperCase();
  }

  const name = journal.name || journal.tr || '';
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length >= 2) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return 'JN';
};

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
      const dbJournals = (fetchedData || [])
        .filter((fetched: any) => {
          // Filter out dirty numerical test names like "1", "2", "22"
          const name = (fetched.name || '').trim();
          if (!name) return false;
          if (/^\d+$/.test(name)) return false;
          return true;
        })
        .map((fetched: any) => {
          const mockMatch = MOCK_JOURNALS.find(
            (mj) => mj.id.toLowerCase() === (fetched.id || '').toString().toLowerCase() ||
              mj.slug.toLowerCase() === (fetched.slug || '').toString().toLowerCase() ||
              mj.name.toLowerCase() === (fetched.name || '').toString().toLowerCase()
          );

          const name = fetched.name || mockMatch?.name || '';
          const tr = fetched.tr || mockMatch?.tr || name;

          return {
            id: fetched.id || mockMatch?.id || 'JOURNAL',
            abbreviation: mockMatch?.abbreviation || getJournalAbbreviation({ id: fetched.id, name, abbreviation: fetched.abbreviation }),
            slug: fetched.slug || mockMatch?.slug || name.toLowerCase().replace(/\s+/g, '-'),
            name,
            tr,
            issn: fetched.issn || mockMatch?.issn || '2687-4321',
            index: fetched.index || mockMatch?.index || 'Crossref Indexed',
            indexColor: fetched.indexColor || mockMatch?.indexColor || 'text-slate-700 bg-slate-50 border-slate-200',
            cover: fetched.cover || fetched.cover_image || mockMatch?.cover || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop',
            impactFactor: fetched.impactFactor || mockMatch?.impactFactor || '3.2',
            reviewTime: fetched.reviewTime || mockMatch?.reviewTime || '4 Weeks Avg',
            acceptRate: fetched.acceptRate || mockMatch?.acceptRate || '20%',
            articlesCount: fetched.articlesCount || fetched.articles_count || mockMatch?.articlesCount || '0',
            description: fetched.description || mockMatch?.description || { EN: name, TR: tr },
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
      }).map((mj) => ({
        ...mj,
        abbreviation: mj.abbreviation || getJournalAbbreviation(mj)
      }));

      // 3. Combine both lists (DB journals first, then mock journals)
      const combinedJournals = [...dbJournals, ...unmatchedMockJournals];
      set({ journals: combinedJournals, isLoading: false });
    } catch (err: any) {
      console.warn('Failed to fetch live journals, using mock data:', err.message || err);
      const fallbackMockJournals = MOCK_JOURNALS.map((mj) => ({
        ...mj,
        abbreviation: mj.abbreviation || getJournalAbbreviation(mj)
      }));
      set({ journals: fallbackMockJournals as any[], error: null, isLoading: false });
    }
  }
}));
