import { CreditsCheckError, getCredits } from './credits';

const mockFetch = (response: { ok: boolean; status?: number; body?: any }) =>
  jest.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? (response.ok ? 200 : 500),
    json: () => Promise.resolve(response.body),
  });

describe('getCredits', () => {
  const originalFetch = window.fetch;

  afterEach(() => {
    window.fetch = originalFetch;
  });

  it('sends engineMemoriID when userID is not known', async () => {
    window.fetch = mockFetch({ ok: true, body: { enough: true, required: 1 } });

    await getCredits({
      baseUrl: 'https://example.com',
      engineMemoriID: 'engine-1',
      tenant: 'tenant.example.com',
    });

    const [url, init] = (window.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('https://example.com/api/verify-tokens');
    expect(JSON.parse(init.body)).toEqual({
      operation: 'session_creation',
      engineMemoriID: 'engine-1',
      tenant: 'tenant.example.com',
    });
  });

  it('sends both identifiers when available', async () => {
    window.fetch = mockFetch({ ok: true, body: { enough: true, required: 1 } });

    await getCredits({
      baseUrl: 'https://example.com',
      userID: 'user-1',
      engineMemoriID: 'engine-1',
      tenant: 'tenant.example.com',
    });

    const [, init] = (window.fetch as jest.Mock).mock.calls[0];
    expect(JSON.parse(init.body)).toMatchObject({
      userID: 'user-1',
      engineMemoriID: 'engine-1',
    });
  });

  it('throws a CreditsCheckError without status when no identifier is given', async () => {
    window.fetch = jest.fn();

    await expect(
      getCredits({ baseUrl: 'https://example.com', tenant: 't' })
    ).rejects.toMatchObject({ name: 'CreditsCheckError', status: undefined });
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it('throws a CreditsCheckError with the response status on failure', async () => {
    window.fetch = mockFetch({ ok: false, status: 400 });

    const promise = getCredits({
      baseUrl: 'https://example.com',
      userID: 'user-1',
      tenant: 't',
    });

    await expect(promise).rejects.toBeInstanceOf(CreditsCheckError);
    await expect(promise).rejects.toMatchObject({ status: 400 });
  });
});
