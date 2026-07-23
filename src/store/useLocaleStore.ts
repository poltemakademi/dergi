import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations } from '../i18n/translations';
import type { Locale, TranslationKey } from '../i18n/translations';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: 'tr', // Primary default language is Turkish (TR)
      setLocale: (targetLocale) => {
        const cleanLocale: Locale = targetLocale === 'en' ? 'en' : 'tr';
        set({ locale: cleanLocale });
        
        const upper = cleanLocale.toUpperCase();
        localStorage.setItem('app_lang', upper);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('lang-change'));
        }
      },
      t: (key) => {
        const { locale } = get();
        const dict = translations[locale] || translations['tr'];
        return dict[key] || translations['en']?.[key] || key;
      },
    }),
    {
      name: 'locale-storage',
    }
  )
);

if (typeof window !== 'undefined') {
  window.addEventListener('lang-change', () => {
    const stored = localStorage.getItem('app_lang');
    const appLang = (stored ? stored.toUpperCase() : 'TR') as 'EN' | 'TR';
    const targetLocale: Locale = appLang === 'EN' ? 'en' : 'tr';
    
    if (useLocaleStore.getState().locale !== targetLocale) {
      useLocaleStore.setState({ locale: targetLocale });
    }
  });

  const initialAppLang = localStorage.getItem('app_lang');
  if (initialAppLang) {
    const clean: Locale = initialAppLang.toUpperCase() === 'EN' ? 'en' : 'tr';
    useLocaleStore.setState({ locale: clean });
  } else {
    localStorage.setItem('app_lang', 'TR');
  }
}
