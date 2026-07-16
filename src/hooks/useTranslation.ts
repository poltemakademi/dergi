import { useLanguageStore } from '../store/languageStore';
import { translations } from '../locales/translations';

export function useTranslation() {
  const lang = useLanguageStore((state) => state.lang);
  const setLang = useLanguageStore((state) => state.setLang);
  const t = translations[lang] || translations.TR;

  return { t, lang, setLang };
}
