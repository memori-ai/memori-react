import '@testing-library/jest-dom/extend-expect';
import { Settings, DateTime } from 'luxon';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

let i18n = {
  language: 'en',
  lng: 'en',
  fallbackLng: 'en',
  languages: ['it', 'en', 'fr', 'de', 'es', 'default'],
  options: {},
  changeLanguage: jest.fn(),
};
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key, i18n }),
  i18n,
  withTranslation: () => Component => props => <Component {...props} />,
}));

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
});

jest.mock('@react-leaflet/core', () => ({
  useLeafletContext: () => ({
    map: {
      on: jest.fn(),
      off: jest.fn(),
      remove: jest.fn(),
      addLayer: jest.fn(),
      removeLayer: jest.fn(),
      setView: jest.fn(),
    },
    layerContainer: {
      addLayer: jest.fn(),
      removeLayer: jest.fn(),
    },
  }),
}));

const now = new Date('2022-09-24');

jest.setSystemTime(now);
Date.now = jest.fn(() => new Date(now).valueOf());

jest.spyOn(global.Date, 'now').mockImplementation(() => now.valueOf());

Settings.defaultLocale = 'en';
Settings.defaultZone = 'UTC';
Settings.now = () => DateTime.fromJSDate(now).toMillis();

const DateTimeFormat = Intl.DateTimeFormat;
jest
  .spyOn(global.Intl, 'DateTimeFormat')
  .mockImplementation(
    (locale, options) =>
      new DateTimeFormat(locale, { ...options, timeZone: 'Europe/Rome' })
  );

// mocks external MathJax as global object
global.MathJax = {
  typesetPromise: jest.fn(),
};
global.window.MathJax = global.MathJax;
Object.defineProperty(window, 'MathJax', {
  writable: true,
  value: global.MathJax,
});

jest.spyOn(window, 'MathJax', 'typesetPromise').mockResolvedValue();
jest.spyOn(global.MathJax, 'typesetPromise').mockResolvedValue();
