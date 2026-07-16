import { create } from 'zustand';

interface LanguageState {
  lang: 'EN' | 'TR';
  setLang: (lang: 'EN' | 'TR') => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: (localStorage.getItem('app_lang') as 'EN' | 'TR') || 'TR',
  setLang: (lang) => {
    localStorage.setItem('app_lang', lang);
    set({ lang });
    // Keep compatibility with legacy page event listeners during transition
    window.dispatchEvent(new Event('lang-change'));
  },
}));

if (typeof window !== 'undefined') {
  window.addEventListener('lang-change', () => {
    const appLang = localStorage.getItem('app_lang') as 'EN' | 'TR' || 'TR';
    if (useLanguageStore.getState().lang !== appLang) {
      useLanguageStore.setState({ lang: appLang });
    }
  });
}
