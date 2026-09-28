import {
  SpeechRequestError,
  resolveSpeechSessionId,
  speechErrorFromResponse,
  speechErrorI18nKey,
  speechTenantForRequest,
} from './speechRequest';

describe('resolveSpeechSessionId', () => {
  it('reads the ref at call time, ahead of a stale sessionId', () => {
    const sessionIdRef = { current: 'session-live' as string | undefined };
    expect(resolveSpeechSessionId({ sessionId: undefined, sessionIdRef })).toBe(
      'session-live'
    );

    sessionIdRef.current = 'session-next';
    expect(
      resolveSpeechSessionId({ sessionId: 'session-live', sessionIdRef })
    ).toBe('session-next');
  });

  it('uses sessionId when no ref is provided', () => {
    expect(resolveSpeechSessionId({ sessionId: '  abc  ' })).toBe('abc');
  });

  it('rejects a missing session even if a stale sessionId is still in config', () => {
    expect(() => resolveSpeechSessionId({ sessionId: '  ' })).toThrow(
      SpeechRequestError
    );

    let caught: unknown;
    try {
      resolveSpeechSessionId({
        sessionId: 'stale',
        sessionIdRef: { current: undefined },
      });
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(SpeechRequestError);
    expect((caught as SpeechRequestError).code).toBe('missing_session');
    expect((caught as SpeechRequestError).status).toBe(401);
  });
});

describe('speechTenantForRequest', () => {
  it('sends an explicit tenant on localhost', () => {
    expect(
      speechTenantForRequest('http://localhost:3000/api/tts', 'www.aisuru.com')
    ).toBe('www.aisuru.com');
  });

  it('sends the tenant when it matches the request host', () => {
    expect(
      speechTenantForRequest(
        'https://www.aisuru.com/api/tts',
        'https://www.aisuru.com'
      )
    ).toBe('www.aisuru.com');
  });

  it('omits a tenant that does not match the production host', () => {
    expect(
      speechTenantForRequest(
        'https://aisuru-staging.aclambda.online/api/tts',
        'www.aisuru.com'
      )
    ).toBeUndefined();
  });

  it('omits an empty tenant', () => {
    expect(
      speechTenantForRequest('https://www.aisuru.com/api/stt', '  ')
    ).toBeUndefined();
  });
});

describe('speechErrorFromResponse', () => {
  const responseWith = (
    status: number,
    json: () => Promise<unknown>
  ): Response =>
    ({
      status,
      ok: status >= 200 && status < 300,
      json,
    } as Response);

  it('keeps status, message and code from the speech API', async () => {
    const response = responseWith(429, async () => ({
      error: 'Too many speech requests for this session',
      code: 'rate_limited',
    }));

    const error = await speechErrorFromResponse(response);
    expect(error).toBeInstanceOf(SpeechRequestError);
    expect(error.status).toBe(429);
    expect(error.code).toBe('rate_limited');
    expect(error.message).toBe('Too many speech requests for this session');
    expect(speechErrorI18nKey(error)).toBe('errors.speechRateLimited');
  });

  it('falls back when the body is not JSON', async () => {
    const response = responseWith(500, async () => {
      throw new Error('invalid json');
    });
    const error = await speechErrorFromResponse(response);
    expect(error.status).toBe(500);
    expect(error.code).toBeUndefined();
    expect(error.message).toBe('API error: 500');
    expect(speechErrorI18nKey(error)).toBeUndefined();
  });
});
