import en from '../locales/en.json';
import vi from '../locales/vi.json';

const translations = {
  en,
  vi,

};

export function getTranslations(locale) {
  return translations[locale] || translations['en']; // Fallback to default locale
}