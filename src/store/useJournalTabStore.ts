import { create } from 'zustand';

interface JournalTabState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useJournalTabStore = create<JournalTabState>((set) => ({
  activeTab: 'Anasayfa',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
