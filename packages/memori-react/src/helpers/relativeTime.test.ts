import {
  formatExactDateTime,
  formatRelativeTime,
  parseTimestamp,
} from './relativeTime';

const NOW = new Date('2026-09-19T10:00:00.000Z');

describe('relativeTime', () => {
  it('parses timestamps and rejects invalid values', () => {
    expect(parseTimestamp('2026-09-16T10:00:00.000Z')?.toISOString()).toBe(
      '2026-09-16T10:00:00.000Z'
    );
    expect(parseTimestamp('not-a-date')).toBeNull();
    expect(parseTimestamp(undefined)).toBeNull();
  });

  it('formats a relative date in the current locale', () => {
    expect(
      formatRelativeTime('2026-09-16T10:00:00.000Z', 'en', NOW)
    ).toBe('3 days ago');
    expect(
      formatRelativeTime('2026-09-16T10:00:00.000Z', 'it', NOW)
    ).toBe('3 giorni fa');
  });

  it('puts the exact timestamp in a separate formatter', () => {
    const exact = formatExactDateTime('2026-09-16T09:48:00.000Z', 'en-GB');
    expect(exact).toMatch(/16/);
    expect(exact).toMatch(/09/);
  });
});
