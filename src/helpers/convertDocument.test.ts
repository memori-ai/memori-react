import { convertDocument } from './convertDocument';

describe('convertDocument', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  it('uploads a file through the session-gated endpoint', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ text: '# Converted document' }),
    });
    const file = new File(['document'], 'contract.pdf', {
      type: 'application/pdf',
    });

    await expect(
      convertDocument(file, 'session/id', 'https://www.aisuru.com/')
    ).resolves.toBe('# Converted document');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.aisuru.com/api/convert/session%2Fid',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );
    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(body.get('file')).toBe(file);
    expect(fetchMock.mock.calls[0][1].headers).toBeUndefined();
  });

  it('uses the current origin when baseUrl is omitted', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ text: 'Converted' }),
    });

    await convertDocument(new File(['text'], 'notes.txt'), 'session');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/convert/session',
      expect.any(Object)
    );
  });

  it('surfaces conversion API errors', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'Formato non supportato' }),
    });

    await expect(
      convertDocument(new File(['document'], 'contract.pages'), 'session')
    ).rejects.toThrow('Formato non supportato');
  });

  it('requires a session before uploading', async () => {
    await expect(
      convertDocument(new File(['document'], 'contract.pdf'), '')
    ).rejects.toThrow('Session ID is required');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
