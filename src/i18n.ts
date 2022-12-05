import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
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

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const useTranslation = () => ({
  i18n,
  t: (key: string) => {
    // console.debug(key);
    return i18n.t(key);
  },
});

export default i18n;
