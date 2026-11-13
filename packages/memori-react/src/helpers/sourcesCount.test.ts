import { getExposedSourcesCount } from './sourcesCount';

describe('getExposedSourcesCount', () => {
  it('returns undefined when the backend did not expose a count', () => {
    expect(getExposedSourcesCount({ text: 'Hello' })).toBeUndefined();
    expect(getExposedSourcesCount(undefined)).toBeUndefined();
  });

  it('reads an explicit count without inventing one', () => {
    expect(
      getExposedSourcesCount({ text: 'Hello', sourcesCount: 3 } as never)
    ).toBe(3);
    expect(
      getExposedSourcesCount({ text: 'Hello', matchesCount: 0 } as never)
    ).toBe(0);
  });

  it('uses a matches array length only when that array is present', () => {
    expect(
      getExposedSourcesCount({
        text: 'Hello',
        matches: [{}, {}],
      } as never)
    ).toBe(2);
  });
});
