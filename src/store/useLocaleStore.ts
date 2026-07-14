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
      locale: 'tr', // Default language matched to public default
      setLocale: (locale) => {
        set({ locale });
        // Synchronize with public pages' legacy language system
        localStorage.setItem('app_lang', locale.toUpperCase());
        window.dispatchEvent(new Event('lang-change'));
      },
      t: (key) => {
        const { locale } = get();
        const dict = translations[locale] || translations['tr'];
        return dict[key] || translations['en'][key] || key;
      },
    }),
    {
      name: 'locale-storage', // name of item in the storage (must be unique)
    }
  )
);

// Listen to 'lang-change' events to keep Zustand synced if public pages change it
if (typeof window !== 'undefined') {
  window.addEventListener('lang-change', () => {
    const appLang = localStorage.getItem('app_lang') as 'EN' | 'TR' || 'TR';
    const targetLocale = appLang.toLowerCase() as Locale;
    if (useLocaleStore.getState().locale !== targetLocale) {
      useLocaleStore.setState({ locale: targetLocale });
    }
  });

  // Sync initial state on load
  const initialAppLang = localStorage.getItem('app_lang') as 'EN' | 'TR';
  if (initialAppLang) {
    useLocaleStore.setState({ locale: initialAppLang.toLowerCase() as Locale });
  } else {
    // If not set in legacy, copy over from zustand to legacy
    const state = useLocaleStore.getState();
    localStorage.setItem('app_lang', state.locale.toUpperCase());
  }
}
