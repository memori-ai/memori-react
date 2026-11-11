import { getErrori18nKey } from './error';

describe('Error helper for HTTP status codes', () => {
  it('gets error i18n key correctly for 401', () => {
    expect(getErrori18nKey(401)).toBe('error.unauthorized');
  });

  it('gets error i18n key correctly for 404', () => {
    expect(getErrori18nKey(404)).toBe('error.notFound');
  });

  it('gets error i18n key correctly for 500', () => {
    expect(getErrori18nKey(500)).toBe('internal server error');
  });

  it('gets error i18n key correctly for 501', () => {
    expect(getErrori18nKey(501)).toBe('error.generic');
  });
});

describe('Error helper for backend error codes', () => {
  it('gets error i18n key correctly for -101', () => {
    expect(getErrori18nKey(-101)).toBe('errors.SESSION_NOT_FOUND');
  });

  it('gets error i18n key correctly for -51', () => {
    expect(getErrori18nKey(-51)).toBe('errors.MEMORI_NOT_FOUND');
  });
});
