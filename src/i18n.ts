import { createInstance } from 'i18next';
import it from './locales/it.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import es from './locales/es.json';

const resources = {
  en: {
    translation: en,
  },
  it: {
    translation: it,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  de: {
    translation: de,
  },
};

const i18n = createInstance({
  resources,
  lng: 'en',
  fallbackLng: 'it',
  supportedLngs: ['en', 'it', 'fr', 'es', 'de'],
  nonExplicitSupportedLngs: true,
  interpolation: {
    escapeValue: false,
  },
});

i18n.init();

export default i18n;
