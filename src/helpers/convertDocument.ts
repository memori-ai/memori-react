type ConvertDocumentResponse = {
  text?: string;
  error?: string;
};

export const convertDocument = async (
  file: File,
  sessionID: string,
  baseUrl = ''
): Promise<string> => {
  if (!sessionID) {
    throw new Error('Session ID is required to convert documents');
  }

  const body = new FormData();
  body.append('file', file);

  const origin = baseUrl.replace(/\/+$/, '');
  const response = await fetch(
    `${origin}/api/convert/${encodeURIComponent(sessionID)}`,
    {
      method: 'POST',
      body,
    }
  );
  const payload = (await response
    .json()
    .catch(() => null)) as ConvertDocumentResponse | null;

  if (!response.ok || !payload?.text) {
    throw new Error(payload?.error || 'Document conversion failed');
  }

  return payload.text;
};
