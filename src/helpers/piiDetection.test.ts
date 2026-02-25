import { checkPii } from './piiDetection';

const baseConfig = {
  enabled: true,
  rules: [
    {
      id: 'email',
      label: 'Email',
      pattern: '\\b[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}\\b',
      message: { it: 'Contiene email.', en: 'Contains email.' },
    },
    {
      id: 'iban',
      label: 'IBAN',
      pattern: '\\b[A-Z]{2}\\d{2}(?:[ ]?[A-Z0-9]{4}){3,7}(?:[ ]?[A-Z0-9]{1,4})?\\b',
      message: { it: 'Contiene IBAN.', en: 'Contains IBAN.' },
    },
  ],
  errorMessage: {
    it: 'Dati sensibili.',
    en: 'Sensitive data.',
  },
};

describe('checkPii', () => {
  describe('edge cases: no match', () => {
    it('returns no match when config is disabled', () => {
      expect(
        checkPii('test@example.com', { ...baseConfig, enabled: false }, 'en')
      ).toEqual({ matched: false });
    });

    it('returns no match when config is null', () => {
      expect(checkPii('hello', null as any, 'en')).toEqual({ matched: false });
    });

    it('returns no match when config is undefined', () => {
      expect(checkPii('hello', undefined as any, 'en')).toEqual({
        matched: false,
      });
    });

    it('returns no match when rules is empty array', () => {
      expect(
        checkPii('test@example.com', { ...baseConfig, rules: [] }, 'en')
      ).toEqual({ matched: false });
    });

    it('returns no match when rules is not an array', () => {
      expect(
        checkPii('test@example.com', { ...baseConfig, rules: null as any }, 'en')
      ).toEqual({ matched: false });
    });

    it('returns no match when no rule matches the text', () => {
      expect(checkPii('just plain hello world', baseConfig, 'en')).toEqual({
        matched: false,
      });
    });

    it('skips rules with empty pattern (avoids matching everything)', () => {
      const configWithEmptyPattern = {
        ...baseConfig,
        rules: [
          { id: 'empty', label: 'Empty', pattern: '', message: { en: 'Empty' } },
          {
            id: 'space',
            label: 'Space',
            pattern: '   ',
            message: { en: 'Space' },
          },
        ],
      };
      expect(checkPii('anything at all', configWithEmptyPattern, 'en')).toEqual(
        { matched: false }
      );
    });

    it('treats invalid regex as no match and does not throw', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const configBadRegex = {
        ...baseConfig,
        rules: [
          {
            id: 'bad',
            label: 'Bad',
            pattern: '[unclosed',
            message: { en: 'Bad' },
          },
        ],
      };
      expect(checkPii('test', configBadRegex, 'en')).toEqual({ matched: false });
      expect(warnSpy).toHaveBeenCalledWith(
        '[PII] Invalid regex for rule:',
        'bad',
        '[unclosed',
        expect.any(Error)
      );
      warnSpy.mockRestore();
    });
  });

  describe('single rule match', () => {
    it('returns match and errorText when email pattern matches', () => {
      const result = checkPii('contact me at test@example.com please', baseConfig, 'en');
      expect(result.matched).toBe(true);
      expect(result.errorText).toContain('Sensitive data.');
      expect(result.errorText).toContain('Contains email.');
      expect(result.errorText).not.toContain('Contains IBAN.');
    });

    it('returns match with Italian messages when lang is it', () => {
      const result = checkPii('test@example.com', baseConfig, 'it');
      expect(result.matched).toBe(true);
      expect(result.errorText).toContain('Dati sensibili.');
      expect(result.errorText).toContain('Contiene email.');
    });

    it('falls back to en when lang has no translation', () => {
      const result = checkPii('test@example.com', baseConfig, 'fr');
      expect(result.matched).toBe(true);
      expect(result.errorText).toContain('Sensitive data.');
      expect(result.errorText).toContain('Contains email.');
    });

    it('falls back to first available message when errorMessage has no en or requested lang', () => {
      const configNoEn = {
        ...baseConfig,
        errorMessage: { it: 'Solo italiano' },
      };
      const result = checkPii('test@example.com', configNoEn, 'de');
      expect(result.matched).toBe(true);
      expect(result.errorText).toContain('Solo italiano');
    });
  });

  describe('multiple rules and deduplication', () => {
    it('returns match with both rule messages when text matches email and IBAN', () => {
      const text = 'send to test@example.com and IT60X0542811101000000123456';
      const result = checkPii(text, baseConfig, 'en');
      expect(result.matched).toBe(true);
      expect(result.errorText).toContain('Sensitive data.');
      expect(result.errorText).toContain('Contains email.');
      expect(result.errorText).toContain('Contains IBAN.');
    });

    it('deduplicates by rule id when multiple rules share same id', () => {
      const configDupId = {
        ...baseConfig,
        rules: [
          {
            id: 'email',
            label: 'Email 1',
            pattern: '\\b[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}\\b',
            message: { en: 'Email 1' },
          },
          {
            id: 'email',
            label: 'Email 2',
            pattern: '@',
            message: { en: 'Email 2' },
          },
        ],
      };
      const result = checkPii('test@example.com', configDupId, 'en');
      expect(result.matched).toBe(true);
      const lines = result.errorText!.split('\n');
      const emailLines = lines.filter(l => l.includes('Email'));
      expect(emailLines.length).toBe(1);
    });
  });

  describe('lang normalization', () => {
    it('handles empty string lang with fallback to en', () => {
      const result = checkPii('test@example.com', baseConfig, '');
      expect(result.matched).toBe(true);
      expect(result.errorText).toContain('Sensitive data.');
    });

    it('normalizes lang to lowercase for lookup', () => {
      const result = checkPii('test@example.com', baseConfig, 'EN');
      expect(result.matched).toBe(true);
      expect(result.errorText).toContain('Sensitive data.');
    });
  });
});
