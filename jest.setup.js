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

jest
  .spyOn(global.Date, 'now')
  .mockImplementation(() => new Date(2022, 11, 17, 0, 0, 0, 0).valueOf());
