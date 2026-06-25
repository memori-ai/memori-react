import {
  isSessionExpiredNatsError,
  isSessionExpiredNatsResponse,
} from './isSessionExpiredError';

describe('isSessionExpiredNatsError', () => {
  it('detects session not found from EnterTextAsync NATS error', () => {
    expect(
      isSessionExpiredNatsError({
        eventType: 'error',
        errorCode: 'EnterTextAsync Error',
        errorMessage:
          'Session with ID "c681a10b-37c1-4783-af3b-ecb592b93036" not found',
        correlationID: 'f85a6882-92e1-4e18-9fb7-29d3bc06fd7b',
      })
    ).toBe(true);
  });

  it('detects SESSION_EXPIRED result code on dialog response', () => {
    expect(
      isSessionExpiredNatsResponse({
        eventType: 'dialog_text_entered_response',
        resultCode: -103,
        correlationID: 'abc',
      })
    ).toBe(true);
  });

  it('ignores unrelated NATS errors', () => {
    expect(
      isSessionExpiredNatsError({
        eventType: 'error',
        errorCode: 'SomeOtherError',
        errorMessage: 'Something went wrong',
      })
    ).toBe(false);
  });
});
