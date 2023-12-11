import { createInstance } from 'i18next';
import it from './locales/it.json';
import en from './locales/en.json';

const resources = {
  en: {
    translation: en,
  },
  it: {
    translation: it,
  },
};

const i18n = createInstance({
  resources,
  lng: 'en',
  fallbackLng: 'it',
  supportedLngs: ['en', 'it'],
  nonExplicitSupportedLngs: true,
  interpolation: {
    escapeValue: false,
  },
});

i18n.init();

export default i18n;
