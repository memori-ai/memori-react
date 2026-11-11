import {
  convertDocument,
  stripGatewayTruncationFooter,
} from './convertDocument';

describe('stripGatewayTruncationFooter', () => {
  it('removes the gateway truncation markdown footer', () => {
    const raw =
      'hello world\n\n> [conversione troncata a 11 caratteri su 182000]';
    expect(stripGatewayTruncationFooter(raw)).toBe('hello world');
  });

  it('leaves text without footer unchanged', () => {
    expect(stripGatewayTruncationFooter('plain')).toBe('plain');
  });
});

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
      convertDocument(file, {
        sessionID: 'session/id',
        baseUrl: 'https://www.aisuru.com/',
      })
    ).resolves.toEqual({
      text: '# Converted document',
      originalUrl: undefined,
      originalExpiresAt: undefined,
      truncated: false,
      shownChars: undefined,
      totalChars: undefined,
      connectorCap: undefined,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.aisuru.com/api/convert/session%2Fid',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );
    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(body.get('file')).toBe(file);
    expect(body.get('session_id')).toBe('session/id');
    expect(body.get('memori_id')).toBeNull();
    expect(body.get('max_caratteri')).toBeNull();
    expect(fetchMock.mock.calls[0][1].headers).toBeUndefined();
  });

  it('sends memori_id and max_caratteri when provided', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ text: 'Converted' }),
    });

    await convertDocument(new File(['document'], 'contract.pdf'), {
      sessionID: 'session',
      memoriID: 'memori',
      maxChars: 40000,
    });

    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(body.get('memori_id')).toBe('memori');
    expect(body.get('max_caratteri')).toBe('40000');
  });

  it('returns the original file link and truncation info, stripping the gateway footer', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        text: 'Partial text\n\n> [conversione troncata a 12 caratteri su 182000]',
        originale: {
          url: 'https://gateway.example.com/originali/abc/contract.docx',
          scade_il: '2026-11-21T10:00:00Z',
        },
        troncato: true,
        caratteri: 12,
        caratteri_totali: 182000,
        tetto_per_connettori: 50000,
      }),
    });

    await expect(
      convertDocument(new File(['document'], 'contract.docx'), {
        sessionID: 'session',
      })
    ).resolves.toEqual({
      text: 'Partial text',
      originalUrl: 'https://gateway.example.com/originali/abc/contract.docx',
      originalExpiresAt: '2026-11-21T10:00:00Z',
      truncated: true,
      shownChars: 12,
      totalChars: 182000,
      connectorCap: 50000,
    });
  });

  it('falls back to the X-Originale-Url header', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      headers: new Headers({
        'X-Originale-Url': 'https://gateway.example.com/originali/abc/a.pdf',
      }),
      json: jest.fn().mockResolvedValue({ text: 'Converted' }),
    });

    const result = await convertDocument(new File(['document'], 'a.pdf'), {
      sessionID: 'session',
    });

    expect(result.originalUrl).toBe(
      'https://gateway.example.com/originali/abc/a.pdf'
    );
  });

  it('uses the current origin when baseUrl is omitted', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ text: 'Converted' }),
    });

    await convertDocument(new File(['text'], 'notes.txt'), {
      sessionID: 'session',
    });

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
      convertDocument(new File(['document'], 'contract.pages'), {
        sessionID: 'session',
      })
    ).rejects.toThrow('Formato non supportato');
  });

  it('requires a session before uploading', async () => {
    await expect(
      convertDocument(new File(['document'], 'contract.pdf'), {
        sessionID: '',
      })
    ).rejects.toThrow('Session ID is required');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
