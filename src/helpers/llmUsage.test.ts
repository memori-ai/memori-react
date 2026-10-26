import {
  formatCacheHitPercent,
  getCacheHitPercent,
  hasCacheTokenDetails,
} from './llmUsage';

describe('hasCacheTokenDetails', () => {
  it('returns false when both cache fields are missing or zero', () => {
    expect(hasCacheTokenDetails({})).toBe(false);
    expect(
      hasCacheTokenDetails({
        inputCacheReadTokens: 0,
        inputCacheWriteTokens: 0,
      })
    ).toBe(false);
  });

  it('returns true when either cache field is greater than zero', () => {
    expect(hasCacheTokenDetails({ inputCacheReadTokens: 10 })).toBe(true);
    expect(hasCacheTokenDetails({ inputCacheWriteTokens: 5 })).toBe(true);
    expect(
      hasCacheTokenDetails({
        inputCacheReadTokens: 10,
        inputCacheWriteTokens: 5,
      })
    ).toBe(true);
  });
});

describe('getCacheHitPercent', () => {
  it('returns undefined when total input is zero or missing', () => {
    expect(getCacheHitPercent(10, 0)).toBeUndefined();
    expect(getCacheHitPercent(10, undefined)).toBeUndefined();
  });

  it('returns rounded percentage of cache read over total input', () => {
    expect(getCacheHitPercent(42, 100)).toBe(42);
    expect(getCacheHitPercent(1, 3)).toBe(33);
    expect(getCacheHitPercent(2, 3)).toBe(67);
    expect(getCacheHitPercent(0, 100)).toBe(0);
  });
});

describe('formatCacheHitPercent', () => {
  it('formats an integer percentage with a percent sign', () => {
    expect(formatCacheHitPercent(42, 'en-US')).toBe('42%');
    expect(formatCacheHitPercent(0, 'it-IT')).toBe('0%');
  });
});
