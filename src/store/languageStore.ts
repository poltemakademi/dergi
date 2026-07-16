import { create } from 'zustand';

interface LanguageState {
  lang: 'EN' | 'TR';
  setLang: (lang: 'EN' | 'TR') => void;
}

const getInitialLang = (): 'EN' | 'TR' => {
  if (typeof window === 'undefined') return 'TR';
  const stored = localStorage.getItem('app_lang');
  if (stored) {
    const upper = stored.toUpperCase();
    if (upper === 'EN' || upper === 'TR') {
      return upper;
    }
  }
  return 'TR';
};

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: getInitialLang(),
  setLang: (lang) => {
    const upperLang = lang.toUpperCase() as 'EN' | 'TR';
    localStorage.setItem('app_lang', upperLang);
    set({ lang: upperLang });
    // Keep compatibility with legacy page event listeners during transition
    window.dispatchEvent(new Event('lang-change'));
  },
}));

if (typeof window !== 'undefined') {
  window.addEventListener('lang-change', () => {
    const stored = localStorage.getItem('app_lang');
    const appLang = (stored ? stored.toUpperCase() : 'TR') as 'EN' | 'TR';
    const validatedLang = (appLang === 'EN' || appLang === 'TR') ? appLang : 'TR';
    if (useLanguageStore.getState().lang !== validatedLang) {
      useLanguageStore.setState({ lang: validatedLang });
    }
  });
}

