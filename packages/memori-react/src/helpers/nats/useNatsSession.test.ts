import { AuthorizationError } from '@nats-io/nats-core';
import { isNatsAuthError } from './useNatsSession';

describe('isNatsAuthError', () => {
  it('recognizes typed NATS authorization failures', () => {
    expect(isNatsAuthError(new AuthorizationError('test'))).toBe(true);
  });

  it('recognizes the server authorization violation message', () => {
    expect(isNatsAuthError(new Error('Authorization Violation'))).toBe(true);
  });

  it('does not classify unrelated connection failures as auth failures', () => {
    expect(isNatsAuthError(new Error('connection refused'))).toBe(false);
  });
});
