import '@testing-library/jest-dom/extend-expect';
import { Settings, DateTime } from 'luxon';
import React from 'react';

// JSDOM does not implement blob URLs; MediaWidget and others call these in tests.
global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock');
global.URL.revokeObjectURL = jest.fn();

// jsdom 20 has no PointerEvent. Base UI checkboxes, radios, and switches
// dispatch one to toggle the hidden input, so clicks never change state without it.
if (typeof window.PointerEvent === 'undefined') {
  class PointerEvent extends MouseEvent {
    constructor(type, params = {}) {
      super(type, params);
      this.pointerId = params.pointerId ?? 1;
      this.width = params.width ?? 1;
      this.height = params.height ?? 1;
      this.pressure = params.pressure ?? 0;
      this.tangentialPressure = params.tangentialPressure ?? 0;
      this.tiltX = params.tiltX ?? 0;
      this.tiltY = params.tiltY ?? 0;
      this.twist = params.twist ?? 0;
      this.pointerType = params.pointerType ?? '';
      this.isPrimary = params.isPrimary ?? false;
    }
  }

  window.PointerEvent = PointerEvent;
}

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

let mockI18n = {
  language: 'en',
  lng: 'en',
  fallbackLng: 'en',
  languages: ['it', 'en', 'fr', 'de', 'es', 'default'],
  options: {},
  changeLanguage: jest.fn(),
};
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key, i18n: mockI18n }),
  i18n: mockI18n,
  I18nextProvider: ({ children }) => <>{children}</>,
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

// mocks external MathJax as global object
global.MathJax = {
  typesetPromise: jest.fn(),
};
global.window.MathJax = global.MathJax;
Object.defineProperty(window, 'MathJax', {
  writable: true,
  value: global.MathJax,
});

jest.spyOn(window.MathJax, 'typesetPromise').mockResolvedValue();
