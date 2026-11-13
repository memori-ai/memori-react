import {
  isEmptyPasswordError,
  resolveSessionPassword,
} from './sessionPassword';

describe('resolveSessionPassword', () => {
  it('skips blank values and returns the first real password', () => {
    expect(resolveSessionPassword(undefined, '', '   ', 'secret-key')).toBe(
      'secret-key'
    );
  });

  it('returns undefined when every candidate is blank', () => {
    expect(resolveSessionPassword(undefined, null, '', '  ')).toBeUndefined();
  });
});

describe('isEmptyPasswordError', () => {
  it('matches the engine empty-password response', () => {
    expect(isEmptyPasswordError(422, 'Empty password')).toBe(true);
  });

  it('does not match other 422 responses', () => {
    expect(isEmptyPasswordError(422, 'Empty Memori ID')).toBe(false);
    expect(isEmptyPasswordError(403, 'Empty password')).toBe(false);
  });
});
