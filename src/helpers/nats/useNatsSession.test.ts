import { AuthorizationError } from '@nats-io/nats-core';
import { isNatsAuthError, normalizeNatsEvent } from './useNatsSession';

describe('normalizeNatsEvent', () => {
  it('reads the message and correlation of a tool call', () => {
    expect(
      normalizeNatsEvent({
        eventType: 'tool_call',
        correlationID: 'corr-1',
        source: 'Engine',
        message: 'Looking up your order',
      })
    ).toEqual({
      eventType: 'tool_call',
      correlationID: 'corr-1',
      message: 'Looking up your order',
    });
  });

  it('drops a tool call message that is not text', () => {
    expect(
      normalizeNatsEvent({ eventType: 'tool_call', message: { name: 'x' } })
    ).toEqual({
      eventType: 'tool_call',
      correlationID: undefined,
      message: undefined,
    });
  });
});

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
