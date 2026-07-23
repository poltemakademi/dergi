import { create } from 'zustand';
import { useLocaleStore } from './useLocaleStore';

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
    const upperLang = (String(lang).toUpperCase() === 'EN') ? 'EN' : 'TR';
    localStorage.setItem('app_lang', upperLang);
    set({ lang: upperLang });
    
    try {
      useLocaleStore.getState().setLocale(upperLang.toLowerCase() as 'en' | 'tr');
    } catch {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('lang-change'));
    }
  },
}));

if (typeof window !== 'undefined') {
  window.addEventListener('lang-change', () => {
    const stored = localStorage.getItem('app_lang');
    const appLang = (stored && stored.toUpperCase() === 'EN') ? 'EN' : 'TR';
    if (useLanguageStore.getState().lang !== appLang) {
      useLanguageStore.setState({ lang: appLang });
    }
  });
}

