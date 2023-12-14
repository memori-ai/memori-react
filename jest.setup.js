import '@testing-library/jest-dom/extend-expect';

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
  languages: ['it', 'en', 'default'],
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

jest.setSystemTime(new Date('2022-09-24'));
Date.now = jest.fn(() => new Date(Date.UTC(2022, 8, 24)).valueOf());

jest
  .spyOn(global.Date, 'now')
  .mockImplementation(() => new Date(2022, 8, 24, 0, 0, 0, 0).valueOf());

const DateTimeFormat = Intl.DateTimeFormat;
jest
  .spyOn(global.Intl, 'DateTimeFormat')
  .mockImplementation(
    (locale, options) =>
      new DateTimeFormat(locale, { ...options, timeZone: 'Europe/Rome' })
  );
