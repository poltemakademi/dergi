import { create } from 'zustand';
import { apiClient } from '../services/api/client';

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
      const response = await apiClient.get('/api/global/search', {
        params: { q: '', type: 'journals' }
      });
      const fetchedData = response.data;
      if (Array.isArray(fetchedData)) {
        set({ journals: fetchedData, isLoading: false });
      } else {
        set({ journals: [], isLoading: false });
      }
    } catch (err: any) {
      console.warn('Failed to fetch live journals:', err.message || err);
      set({ journals: [], error: err.message || 'Failed to fetch journals', isLoading: false });
    }
  }
}));
